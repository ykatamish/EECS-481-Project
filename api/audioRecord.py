#! /usr/bin/env python2

import re #
import hashlib #
import uuid #
from flask import *

audioRecord = Blueprint('audioRecord', __name__, template_folder='templates')

@audioRecord.route("/api/v1/audioRecord", methods=['GET'])
def audioRecord_route():
    if (request.method == 'GET'):
        return ("Hello World")
