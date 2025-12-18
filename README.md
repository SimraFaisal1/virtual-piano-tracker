# Introduction

## What is the Virtual Piano Website?
Piano is an instrument that a lot of people are deeply interested in learning. However, there are some limitations in terms of the finances for getting the instrument or even hiring a teacher and committing specific hours to classes. This tool aims to provide free-access to a virtual piano that provides basic functionality along with mini lessons that can be done at the user’s convenience.

For more details, view the full project proposal [here](https://docs.google.com/document/d/1pkxDHbYGbWe_pH_AxGgNAwO4P3VTYI0WYEBoXAxSFFA/edit?usp=sharing).

# Technical Architecture
<img width="763" height="679" alt="Image" src="https://github.com/user-attachments/assets/0f3a5504-cd9c-4f96-983d-ccaf457b1829" />

# Developers
- **Simra Faisal:** Developing the piano and finger tracking connection, note tracking draft for Happy Birthday, dockerfile
- **Ria Sinha:** Hand tracking for base computer vision, frontend UI design, integrating audio for the freestyl section
- **Anthony Smykalov:** Initial Vite & React frontend base, Node.js backend server, REST APIs and WebSockets
- **Minyoung Kim:** Optimizing the python finger tracking events to send to the frontend. Implemented Uvicorn python streaming to send to server. Designed the forum section in the webapp.

# Environment Setup
- Install Python 3.9.6-3.10.11
- Clone the repo
```bash
cd cv-piano-webapp
```
- Activate virtual environment
```bash
python -m venv .\myenv
```
```bash
pip install --upgrade pip
```
```bash
pip install -r requirements.txt
```
- Activate virtual environment
```bash
myenv\Scripts\Activate.ps1
```
```bash 
python -m uvicorn web.main:app --port 8000
```
```bash 
cd server
```
```bash 
node index.js
```
```bash
npm run dev
```
- Open
```bash
http://localhost:5173
```

# Project Instruction
