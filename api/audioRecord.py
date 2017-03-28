#! /usr/bin/env python2

import re #
import hashlib #
import uuid #
from flask import *
import pyaudio
import wave
import time
import os
from google.cloud import speech
from google.cloud import storage

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

		dir_path = os.getcwd() + "/"


		## convert from wav to raw:
		input_file_name = "output.wav"
		output_file_name = "output.raw"

		bash_command_begin = "./sox "
		bash_command_end = "-t raw --channels=1 --bits=16 --rate=16000 --encoding=signed-integer --endian=little "
		full_bash_command = bash_command_begin + input_file_name + " " + bash_command_end + output_file_name
		os.system(full_bash_command)


		## interface with storage:
		bucket_name = "brad-mstudy-481"

		storage_client = storage.Client()
		bucket = storage_client.get_bucket(bucket_name)
		full_path = dir_path + output_file_name
		blob_to_upload = storage.Blob(output_file_name, bucket)

		with open(dir_path + output_file_name, 'rb') as my_file:
		    blob_to_upload.upload_from_file(my_file)



		## interface with speech:
		uri_path = "gs://" + bucket_name + "/" + output_file_name
		speech_client = speech.Client()
		sample = speech_client.sample(source_uri=uri_path, encoding=speech.Encoding.LINEAR16, sample_rate=16000)
		operation = sample.async_recognize(max_alternatives=1)
		retry_count = 100

		while retry_count > 0 and not operation.complete:
		    retry_count -= 1
		    time.sleep(10)
		    operation.poll()  # API call

		full_transcript = ""

		for result in operation.results:
		    full_transcript = full_transcript + result.transcript

		print(full_transcript)


		"""
		for result in operation.results:
		    print '=' * 20
		    print result.transcript
		    print result.confidence 
		"""

   		return full_transcript
