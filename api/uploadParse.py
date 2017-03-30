#! /usr/bin/env python2

import re #
import hashlib #
import uuid #
from flask import *

import time
import os
from pydub import AudioSegment
from google.cloud import speech
from google.cloud import storage
from werkzeug.utils import secure_filename


def check_status(operations):
	for operation in operations:
		if not operation.complete:
			return False
	return True

def poll(operations):
	for operation in operations:
		if not operation.complete:
			try:
				operation.poll()
			except:
				pass
	return



uploadParse = Blueprint('uploadParse', __name__, template_folder='templates')

@uploadParse.route("/api/v1/uploadParse", methods=['POST'])
def uploadParse_route():
    if (request.method == 'POST'):
        
        file = request.files['upload']
        file.save(os.path.join(os.getcwd() + "/", "output.wav"))
        
        output_file_name = "test.raw"

        ## get the input file:
        input_file_name = "output.wav"
        dir_path = os.getcwd() + "/"
        mp3_flag = True
        full_transcript = ""

        if mp3_flag:
          sound = AudioSegment.from_mp3(dir_path + input_file_name)
        else:
          sound = AudioSegment.from_wav(dir_path + input_file_name)

        done = False
        full_transcript = ""
        counter = 0
        partition_start = 0
        segment_length = 5
        partition_length =  segment_length * 1000 # length partition

        while not done:

          print("iteration: " + str(counter))
          length = len(sound)

          if partition_start + partition_length < length:
            curr_partition = sound[partition_start:partition_start + partition_length]
            partition_start = partition_start + partition_length
          else:
            curr_partition = sound[partition_start:length]
            done = True

          # create temp file:
          wav_input_file = "output_" + str(counter) + ".wav"
          curr_partition.export(dir_path + wav_input_file, format="wav")


          # create temp file:
          bash_command_begin = "./sox "
          bash_command_end = " -t raw --channels=1 --bits=16 --rate=16000 --encoding=signed-integer --endian=little "
          output_file_name = "output_" + str(counter) + ".raw"
          full_bash_command = bash_command_begin + wav_input_file + bash_command_end + output_file_name
          os.system(full_bash_command)

          # interface with storage:
          bucket_name = "brad-mstudy-481"
          storage_client = storage.Client()
          bucket = storage_client.get_bucket(bucket_name)
          blob_to_upload = storage.Blob(output_file_name, bucket)

          with open(dir_path + output_file_name, 'rb') as my_file:
            blob_to_upload.upload_from_file(my_file)

          counter = counter + 1

          ##

        all_done = False 
        all_speech_clients = []
        all_samples = []

        for iter in range(counter):
          output_file_name = "output_" + str(iter) + ".raw"
          uri_path = "gs://" + bucket_name + "/" + output_file_name
          all_speech_clients.append(speech.Client())
          all_samples.append(all_speech_clients[iter].sample(source_uri=uri_path, encoding=speech.Encoding.LINEAR16, sample_rate=16000))

        all_operations = []

        for iter in range(counter):
          all_operations.append(all_samples[iter].async_recognize(max_alternatives=1))

        retry_count = 100
        while retry_count > 0 and not check_status(all_operations):
          retry_count -= 1
          time.sleep(15)
          poll(all_operations) # API call

        for operation in all_operations:
          if operation != None and operation.results != None:
            for result in operation.results:
              if result != None:
				  print("adding " + result.transcript)
				  full_transcript = full_transcript + " " + result.transcript
		
        return(full_transcript)

