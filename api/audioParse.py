import re #
import hashlib #
import uuid #
from flask import *

audioParse = Blueprint('audioParse', __name__, template_folder='templates')

@audioParse.route("/api/v1/album/<albumid>")
def albumApi(data):

    return ("Hello")
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