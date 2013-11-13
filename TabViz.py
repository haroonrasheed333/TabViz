__author__ = 'haroon'
import json
import flask
from flask import request
from flask import make_response
from flask import jsonify
import csv
import os
import random
import string


app = flask.Flask(__name__)
app.debug = True

UPLOAD_FOLDER = ''
ALLOWED_EXTENSIONS = set(['csv'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/')
def index():

    response = make_response(flask.render_template('index.html'))
    return response

@app.route("/fileupload", methods=['POST'])
def fileupload():
    if request.method:
        file = request.files.getlist('file')[0]
        if file and allowed_file(file.filename):
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            rand = ''.join(random.choice(string.ascii_uppercase) for i in range(12))

            response = {'update': rand, 'filename': filename}


            return json.dumps(response)

@app.route("/csv2json", methods=['POST'])
def csv2json():

    filename = request.json['filename']

    with open(filename, 'rU') as csv_file:
        csv_dict = csv.DictReader(csv_file, restkey=None, restval=None,)
        out = [obj for obj in csv_dict]
        output = json.dumps(out)

    return output


#if __name__ == "__main__":
#    app.run(port=5000)