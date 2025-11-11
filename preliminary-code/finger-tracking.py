# %%
import mediapipe as mp #needs python 3.10 or less!!
import cv2
import numpy as np

# %%
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode = False,          #it's a continuous video
    max_num_hands = 2,                  #2 hands - pretty self explanatory
    min_detection_confidence = 0.5,     #minimum confidence to recognize the hand - need to experiment with this value to find optimal
    min_tracking_confidence = 0.5       #minimum confidence to track hands across frames in the vid - need to experiment to find optimal
)

mp_draw = mp.solutions.drawing_utils #to draw graph on the hands - not needed, just for our reference right now
#may or may not be needed to draw piano lines?

# %%
finger_tip_ids = [4, 8 ,12, 16, 20] #thumb, index, middle, ring, pinky - the indices of each finger... each number corresponds to a node on the hand
capture = cv2.VideoCapture(0) #starts camera - if more than one camera, the index can vary
if not capture.isOpened():
    print("Error: Could not open your camera")
    exit()

# %%
while True: #goes endlessly
    ret, frame = capture.read() #ret is a boolean value indicating if read correctly, frame is the Image
    if not ret:
        print("Error: Could not read the frame")
        break
    frame = cv2.flip(frame, 1)  # Flip horizontally for selfie-view
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb_frame)
    cv2.line(img = frame, pt1 = (0, round(frame.shape[0] / 2)), pt2 = (frame.shape[1], round(frame.shape[0] / 2)), color = (255, 0, 0), thickness = 5)
    #piano line... more ideas on this later
    #identifying the limits of the piano setup
    top_y = round(frame.shape[0] / 2) 
    bottom_y = frame.shape[0]

    white_keys = 15 # we're doing 3 Cs
    white_width = frame.shape[1] // white_keys #to set the width for each white key depending on the length of the window

    #alterating between solid white and then the black outline 
    #the -1 is for filling in solid white and 2 is for black outline
    #cv2.rectangle(frame [in which we're inputting], x dimension, y dimension, color, -1 for white fit, 2 for black outline)
    #C
    cv2.rectangle(frame, (0 * white_width, top_y), (1 * white_width, bottom_y), (255, 255, 255), -1)
    cv2.rectangle(frame, (0 * white_width, top_y), (1 * white_width, bottom_y), (0, 0, 0), 2)  
    #D
    cv2.rectangle(frame, (1 * white_width, top_y), (2 * white_width, bottom_y), (255, 255, 255), -1)
    cv2.rectangle(frame, (1 * white_width, top_y), (2 * white_width, bottom_y), (0, 0, 0), 2)  
    #E
    cv2.rectangle(frame, (2 * white_width, top_y), (3 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (2 * white_width, top_y), (3 * white_width, bottom_y), (0, 0, 0), 2) 
    #F
    cv2.rectangle(frame, (3 * white_width, top_y), (4 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (3 * white_width, top_y), (4 * white_width, bottom_y), (0, 0, 0), 2) 
    #G
    cv2.rectangle(frame, (4 * white_width, top_y), (5 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (4 * white_width, top_y), (5 * white_width, bottom_y), (0, 0, 0), 2) 
    #A
    cv2.rectangle(frame, (5 * white_width, top_y), (6 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (5 * white_width, top_y), (6 * white_width, bottom_y), (0, 0, 0), 2) 
    #B
    cv2.rectangle(frame, (6 * white_width, top_y), (7 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (6 * white_width, top_y), (7 * white_width, bottom_y), (0, 0, 0), 2) 
    #C
    cv2.rectangle(frame, (7 * white_width, top_y), (8 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (7 * white_width, top_y), (8 * white_width, bottom_y), (0, 0, 0), 2) 
    #D
    cv2.rectangle(frame, (8 * white_width, top_y), (9 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (8 * white_width, top_y), (9 * white_width, bottom_y), (0, 0, 0), 2) 
    #E
    cv2.rectangle(frame, (9 * white_width, top_y), (10 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (9 * white_width, top_y), (10 * white_width, bottom_y), (0, 0, 0), 2) 
    #F
    cv2.rectangle(frame, (10 * white_width, top_y), (11 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (10 * white_width, top_y), (11 * white_width, bottom_y), (0, 0, 0), 2) 
    #G
    cv2.rectangle(frame, (11 * white_width, top_y), (12 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (11 * white_width, top_y), (12 * white_width, bottom_y), (0, 0, 0), 2) 
    #A
    cv2.rectangle(frame, (12 * white_width, top_y), (13 * white_width, bottom_y), (255, 255, 255), -1) 
    cv2.rectangle(frame, (12 * white_width, top_y), (13 * white_width, bottom_y), (0, 0, 0), 2)
    #B
    cv2.rectangle(frame, (13 * white_width, top_y), (14 * white_width, bottom_y), (255, 255, 255), -1)
    cv2.rectangle(frame, (13 * white_width, top_y), (14 * white_width, bottom_y), (0, 0, 0), 2)
    #C
    cv2.rectangle(frame, (14 * white_width, top_y), (15 * white_width, bottom_y), (255, 255, 255), -1)
    cv2.rectangle(frame, (14 * white_width, top_y), (15 * white_width, bottom_y), (0, 0, 0), 2)

    #we can keep top same because they all start from line
    #but we need the height width and bottom to be slightly shorter to fit with the idea of black key
    #also need to account for its positions which should be between two white keys
    black_keys = 13
    black_width = int(white_width * 0.6)
    black_height = int((bottom_y - top_y) * 0.6) #manually identifying the right dimensions
    black_bottom = top_y + black_height

    #cv2.rectangle(frame [which we're putting black keys into], x dimension, y dimension, black color, -1 for black color)
    #doesnt need outline addition since its just black key
    cv2.rectangle(frame, (1 * white_width - black_width // 2, top_y), (1 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)  
    cv2.rectangle(frame, (2 * white_width - black_width // 2, top_y), (2 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1) 
    cv2.rectangle(frame, (4 * white_width - black_width // 2, top_y), (4 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (5 * white_width - black_width // 2, top_y), (5 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (6 * white_width - black_width // 2, top_y), (6 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (8 * white_width - black_width // 2, top_y), (8 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (9 * white_width - black_width // 2, top_y), (9 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (11 * white_width - black_width // 2, top_y), (11 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (12 * white_width - black_width // 2, top_y), (12 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)
    cv2.rectangle(frame, (13 * white_width - black_width // 2, top_y), (13 * white_width + black_width // 2, black_bottom), (0, 0, 0), -1)


    if result.multi_hand_landmarks:

        for hand_landmarks in result.multi_hand_landmarks:
            # Draw hand landmarks on the frame
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS) #the circles

            # Get landmark positions
            h, w, _ = frame.shape
            landmarks = hand_landmarks.landmark

            # Example: Print fingertip coordinates
            for tip_id in finger_tip_ids:
                x = int(landmarks[tip_id].x * w)
                y = int(landmarks[tip_id].y * h)
                cv2.circle(frame, (x, y), 5, (0, 255, 0), cv2.FILLED) #green circles for each of them
    
    cv2.imshow('Finger Tracking', frame) #shows every frame on the screen, Finger Tracking is the title, can be a cool other name as well.

    if (cv2.waitKey(5) & 0xFF == ord('i')): #if i (I chose it for Illinois, lol) is clicked, it terminates the window
        #this is read every 5 ms - may have to increase this time because taking a reading every 5ms can be computationally exhaustive.
        break

capture.release() #frees up the resources/camera - camera won't be allowed to be used otherwise
cv2.destroyAllWindows() #closes the window automatically - can stop this

# %%



