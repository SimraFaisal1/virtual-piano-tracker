import time
import asyncio
from datetime import datetime
import random
import cv2
from threading import Lock
import mediapipe as mp
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


note_queue = asyncio.Queue()

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

NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B",
              "C", "D", "E", "F", "G", "A", "B", "C"]

pressed_notes = set()

note_events: asyncio.Queue = asyncio.Queue()

# boundaries for MJPEG stream
BOUNDARY = "frame"


def draw_piano_and_hands(frame):
    """Draw piano + hands and update the set of currently pressed notes."""
    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    # --- piano rectangles ---
    top_y = h // 2
    bottom_y = h

    white_keys = 15
    white_width = w // white_keys

    # draw white keys
    for i in range(white_keys):
        x1 = i * white_width
        x2 = (i + 1) * white_width
        cv2.rectangle(frame, (x1, top_y), (x2, bottom_y), (255, 255, 255), -1)
        cv2.rectangle(frame, (x1, top_y), (x2, bottom_y), (0, 0, 0), 2)

    # draw black keys (same as before)
    black_width = int(white_width * 0.6)
    black_height = int((bottom_y - top_y) * 0.6)
    black_bottom = top_y + black_height
    black_positions = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13]
    for idx in black_positions:
        cx = idx * white_width
        cv2.rectangle(
            frame,
            (cx - black_width // 2, top_y),
            (cx + black_width // 2, black_bottom),
            (0, 0, 0),
            -1,
        )

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
                lm = hand_landmarks.landmark[tip_id]
                x = int(lm.x * w)
                y = int(lm.y * h)

                # draw fingertip
                cv2.circle(frame, (x, y), 5, (0, 255, 0), cv2.FILLED)

                # check if fingertip is within the piano strip
                if top_y <= y <= bottom_y:
                    key_idx = x // white_width
                    if 0 <= key_idx < len(WHITE_KEY_NOTES):
                        note = WHITE_KEY_NOTES[key_idx]
                        detected_notes.add(note)

    # update global current_notes
    global current_notes
    with notes_lock:
        current_notes = detected_notes

    return frame


def frame_generator():
    """Yield JPEG frames for the <img src='/api/stream'> tag."""
    while True:
        if not cap.isOpened():
            break

        ok, frame = cap.read()
        if not ok:
            continue

        frame = draw_piano_and_hands(frame)

        ok, buffer = cv2.imencode(".jpg", frame)
        if not ok:
            continue
        jpg_bytes = buffer.tobytes()

        yield (
            b"--" + BOUNDARY.encode() + b"\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + jpg_bytes + b"\r\n"
        )


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
