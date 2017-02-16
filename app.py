#!/usr/bin/env python2

from flask import Flask, render_template
import controllers
import api

# Initialize Flask app with the template folder address
app = Flask(__name__, template_folder='templates')

app.register_blueprint(controllers.main)

app.register_blueprint(api.audioParse)

print controllers

# Listen on external IPs
# For us, listen to port 3000 so you can just run 'python app.py' to start the server
if __name__ == '__main__':
    # listen on external IPs
    app.run(host='0.0.0.0', port=3000, debug=True)
