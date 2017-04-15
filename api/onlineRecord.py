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
import threading

onlineRecord = Blueprint('onlineRecord', __name__, template_folder='templates')

@onlineRecord.route("/api/v1/onlineRecord", methods=['GET'])

def onlineRecord_route():
