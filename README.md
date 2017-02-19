# EECS-481-Project

**Project Description:**
A web app project to transcribe recordings using Google speech to text API. Since the project is not fully deployed on a server, it requires a lot of quick setups on the local machine where it will be run. The instruction have only been tested on MAC.

**List of implemented features:**
- Recording from the computer microphone (10 second per interval)
- Uploading an audio file for transcription (only accepts .wav files)
- Download the lecture transcripts (in .txt format)
- Data persistence in the browser cache (persists if tab is closed)
- Ability to clear file history (using "Clear History" button)


**Dependencies Used:**
- Flask
- PyAudio
- Google API Speech Platform
- SOX
- Virtual Environment to launch flask


**Below is a list of steps to run the project:**
1- Setup FLASK (instructions below). This version requires Python 2.7 and is incompatible with python 3

2- run the virtual environment

3- install pyaudio

4- follow the Google API install steps (reference the readme in the google_api_interface directory)


**Installing FLASK**

1- Navigate to EECS-481-Project in terminal

2- Run ". venv/bin/activate"

3- Run "python app.py"

4- Go to http://0.0.0.0:3000/


**In case of no module named "flask" (only tested on Mac)**

1 - In C:\ run "easy_install pip"

2 - then run "pip install flask"


**Installing pyaudio on MAC**

1 - brew install portaudio

2 - pip install --global-option='build_ext' --global-option='-I/usr/local/include' --global-option='-L/usr/local/lib' pyaudio

