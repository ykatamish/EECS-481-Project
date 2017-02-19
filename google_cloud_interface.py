import time
import os
from google.cloud import speech
from google.cloud import storage


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
operation = sample.async_recognize(max_alternatives=2)
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
