#! /usr/bin/env python2

import re #
import hashlib #
import uuid #
from flask import *

audioParse = Blueprint('audioParse', __name__, template_folder='templates')

@audioParse.route("/api/v1/audioParse", methods=['POST'])
def audioParse_route():
    if (request.method == 'POST'):
        content = request.get_json()
        return (content['file'])

        # Build JSON Object
        # data = {
        #     "access": albumaccess,
        #     "albumid": albumid,
        #     "created": created,
        #     "lastupdate": lastupdated,
        #     "pics": pics,
        #     "title": title,
        #     "username": albumusername
        # }
        # return jsonify(data)