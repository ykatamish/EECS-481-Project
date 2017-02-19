#! /usr/bin/env python2

import re #
import hashlib #
import uuid #
from flask import *
import pyaudio
import wave

audioRecord = Blueprint('audioRecord', __name__, template_folder='templates')

@audioRecord.route("/api/v1/audioRecord", methods=['GET'])
def audioRecord_route():
    if (request.method == 'GET'):

		CHUNK = 1024
		FORMAT = pyaudio.paInt16
		CHANNELS = 2
		RATE = 44100
		RECORD_SECONDS = 10
		WAVE_OUTPUT_FILENAME = "output.wav"

		p = pyaudio.PyAudio()

		stream = p.open(format=FORMAT,
		                channels=CHANNELS,
		                rate=RATE,
		                input=True,
		                frames_per_buffer=CHUNK)

		print("* recording")

		frames = []

		for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
		    data = stream.read(CHUNK)
		    frames.append(data)

		print("* done recording")

		stream.stop_stream()
		stream.close()
		p.terminate()

		wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
		wf.setnchannels(CHANNELS)
		wf.setsampwidth(p.get_sample_size(FORMAT))
		wf.setframerate(RATE)
		wf.writeframes(b''.join(frames))
		wf.close()

   		return ("Hello World")
