import time
import asyncio
from datetime import datetime
import random
import cv2
from threading import Lock
import simpleaudio as sa
import tempfile
import os
import mediapipe as mp
import pysynth
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse

app = FastAPI()

current_notes = set()
notes_lock = Lock()


WHITE_KEY_NOTES = [
    "C", "D", "E", "F", "G", "A", "B",
    "C", "D", "E", "F", "G", "A", "B", "C",
]

WHITE_KEY_DICT = {0: 'c4', 1: 'd4', 2: 'e4', 3: 'f4', 4: 'g4', 5: 'a4', 6: 'b4', 7: 'c5', 8: 'd5', 9: 'e5', 10: 'f5', 11: 'g5', 12: 'a5', 13: 'b5', 14: 'c6'}
BLACK_KEY_DICT = {1: "c#4", 2: "d#4", 4: "f#4", 5: "g#4", 6: "a#4", 8: "c#5", 9: "d#5", 11: 'f#5', 12: "g#5", 13: "a#5"}



note_queue = asyncio.Queue()

# ---- audio setup using pysynth ----
loaded_sounds = {}
def preload_notes():
    for note in list(WHITE_KEY_DICT.values()) + list(BLACK_KEY_DICT.values()):
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        tmp.close()
        pysynth.make_wav([(note, 1)], fn=tmp.name, bpm=120)
        loaded_sounds[note] = sa.WaveObject.from_wave_file(tmp.name)
        os.remove(tmp.name)
preload_notes()

def play_note(note_name):
    # play note by name
    if note_name in WHITE_KEY_NOTES:
        key_idx = WHITE_KEY_NOTES.index(note_name)
        sound_name = WHITE_KEY_DICT.get(key_idx)
        if sound_name:
            loaded_sounds[sound_name].play()
    elif note_name in BLACK_KEY_DICT.values():
        loaded_sounds[note_name].play()



# ---- camera + mediapipe setup ----
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("ERROR: Could not open webcam")



# ---- constants for the piano rectangles ----
WHITE_KEYS = 15
WHITE_WIDTH = 50  # will scale dynamically
BLACK_WIDTH = int(WHITE_WIDTH * 0.6)
TOP_Y = 240
BOTTOM_Y = 480
BLACK_POSITIONS = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13]

def is_point_in_rect(pt, rect):
    x, y = pt
    x1, y1, x2, y2 = rect
    return x1 <= x <= x2 and y1 <= y <= y2

def get_piano_rectangles(frame_width):
    # white rectangles
    white_rects = [(i, (i*WHITE_WIDTH, TOP_Y, (i+1)*WHITE_WIDTH, BOTTOM_Y)) for i in range(WHITE_KEYS)]
    black_rects = [(i, (i*WHITE_WIDTH - BLACK_WIDTH//2, TOP_Y, i*WHITE_WIDTH + BLACK_WIDTH//2, TOP_Y + int((BOTTOM_Y-TOP_Y)*0.6))) for i in BLACK_POSITIONS]
    return white_rects, black_rects

note_events: asyncio.Queue = asyncio.Queue()

# boundaries for MJPEG stream
BOUNDARY = "frame"

last_pressed = None
finger_below_line = False

def draw_piano_and_hands(frame):
    global current_notes, last_pressed, finger_below_line

    # Draw piano + hands and update the set of currently pressed notes.
    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    # --- piano rectangles ---
    scale = w / (WHITE_KEYS * WHITE_WIDTH)
    white_width = int(WHITE_WIDTH * scale)
    black_width = int(BLACK_WIDTH * scale)
    top_y = int(h/2)
    bottom_y = h
    cv2.line(frame, (0, top_y), (w, top_y), (255, 0, 0), 3)

    # white_width = w // white_keys


    # draw white keys
    for i in range(WHITE_KEYS):
        cv2.rectangle(frame, (i*white_width, top_y), ((i+1)*white_width, bottom_y), (255,255,255), -1)
        cv2.rectangle(frame, (i*white_width, top_y), ((i+1)*white_width, bottom_y), (0,0,0), 2)
    # draw black keys
    for i in BLACK_POSITIONS:
        cv2.rectangle(frame, (i*white_width - black_width//2, top_y),
                      (i*white_width + black_width//2, top_y + int((bottom_y-top_y)*0.6)),
                      (0,0,0), -1)
    white_rects, black_rects = get_piano_rectangles(WHITE_KEYS * WHITE_WIDTH)

    # --- mediapipe hands + fingertip circles ---
    result = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    finger_tip_ids = [4, 8, 12, 16, 20]

    detected_notes = set()

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp.solutions.drawing_utils.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
            )

            for tip_id in finger_tip_ids:
                x = int(hand_landmarks.landmark[tip_id].x * w)
                y = int(hand_landmarks.landmark[tip_id].y * h)
                cv2.circle(frame, (x, y), 5, (0,255,0), -1)


                if y > top_y:
                    if not finger_below_line:
                        pressed_key = None
                        # black keys first
                        for label, rect in black_rects:
                            if is_point_in_rect((x, y), rect):
                                pressed_key = BLACK_KEY_DICT[label]
                                break
                        # white keys next
                        if not pressed_key:
                            for label, rect in white_rects:
                                if is_point_in_rect((x, y), rect):
                                    pressed_key = WHITE_KEY_DICT[label]
                                    break
                        if pressed_key and pressed_key != last_pressed:
                            play_note(pressed_key)
                            detected_notes.add(pressed_key)
                            last_pressed = pressed_key
                        finger_below_line = True
                else:
                    finger_below_line = False
                    last_pressed = None

    # update global current_notes
    global current_notes
    with notes_lock:
        current_notes = detected_notes

    return frame


def frame_generator():
    """Yield JPEG frames for the <img src='/api/stream'> tag."""
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        frame = draw_piano_and_hands(frame)
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        jpg_bytes = buffer.tobytes()
        yield (b"--"+BOUNDARY.encode()+b"\r\n"
               b"Content-Type: image/jpeg\r\n\r\n"+jpg_bytes+b"\r\n")


# -------- HTTP: video stream --------
@app.get("/api/stream")
async def video_stream():
    return StreamingResponse(
        frame_generator(),
        media_type=f"multipart/x-mixed-replace; boundary={BOUNDARY}",
    )


# -------- WebSocket: notes --------
subscribers = set()

@app.websocket("/api/ws/notes")
async def ws_notes(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"type": "hello", "t": int(time.time() * 1000)})

    prev = set()

    try:
        while True:
            # read the current notes detected by CV
            with notes_lock:
                now = set(current_notes)

            t_ms = int(time.time() * 1000)

            # notes that just started being pressed
            for note in now - prev:
                await ws.send_json({
                    "type": "down",
                    "note": note,
                    "t": t_ms,
                })

            # notes that were pressed before but now are gone
            for note in prev - now:
                await ws.send_json({
                    "type": "up",
                    "note": note,
                    "t": t_ms,
                })

            prev = now

            # small delay so we don't spam too hard
            await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        print("ws client disconnected")
