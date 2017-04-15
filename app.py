#!/usr/bin/env python2

from flask import Flask, render_template
import controllers
import api
import os

# Initialize Flask app with the template folder address
app = Flask(__name__, template_folder='templates')

app.register_blueprint(controllers.main)

app.register_blueprint(api.uploadParse)
app.register_blueprint(api.audioRecord)
app.register_blueprint(api.onlineRecord)

print controllers

# Listen on external IPs
# For us, listen to port 3000 so you can just run 'python app.py' to start the server
if __name__ == '__main__':
    # listen on external IPs
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
