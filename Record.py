import pyaudio
import wave
import threading

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 10
WAVE_OUTPUT_FILENAME = "output.wav"

record = True


def wait():
  global record
  raw_input("\nPress Enter to continue.")
  record = False

def main():
  p = pyaudio.PyAudio()

  stream = p.open(format=FORMAT,
                  channels=CHANNELS,
                  rate=RATE,
                  input=True,
                  frames_per_buffer=CHUNK)

  print("* recording")

  frames = []
  
  
  t = threading.Thread(target=wait)
  t.start()
  

  while(record):
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
  
if __name__ == "__main__":
    main()

