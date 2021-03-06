# EECS-481-Project

**Project Description:**
A web app project to transcribe recordings using Google speech to text API. Since the project is not fully deployed on a server, it requires a lot of quick setups on the local machine where it will be run. The instruction have only been tested on MAC. There is a directory named "sample audio files" which contains some .wav files that are useful for testing.

**List of implemented features:**
- Recording from the computer microphone (10 second per interval)
- Uploading an audio file for transcription (only accepts .wav files of reasonable length)
- Download the lecture transcripts (in .txt format)
- Data persistence in the browser cache (persists if tab is closed)
- Ability to clear file history (using "Clear History" button)
- Ability to rename a lecture recording


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

**Installing Google Cloud API on MAC**

1 - Follow readme.txt instructions in google_api_interface folder

**HEROKU setup**

make sure PyAudio is not in requirements.txt

1 - heroku create -b https://github.com/Galarius/heroku-buildpack-portaudio.git
2 - heroku buildpacks:add --index 2 heroku/python
3 - heroku buildpacks:add --index 3 https://github.com/Galarius/heroku-buildpack-pyaudio.git

git push heroku master
