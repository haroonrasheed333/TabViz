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
import collections

app = flask.Flask(__name__)
app.debug = True

UPLOAD_FOLDER = ''
ALLOWED_EXTENSIONS = set(['csv', 'tsv'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def file_type(filename):
    if '.' in filename:
        return filename.rsplit('.', 1)[1]


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

            with open(filename, 'rU') as csv_file:
                reader = csv.reader(csv_file)
                header = reader.next()

            response = {'update': rand, 'filename': filename, 'header': header}


            return json.dumps(response)

@app.route("/csv2json", methods=['POST'])
def csv2json():

    filename = request.json['filename']

    with open(filename, 'rU') as csv_file:
        filetype = file_type(filename)
        if filetype == 'csv':
            csv_dict = csv.DictReader(csv_file, restkey=None, restval=None,)
        elif filetype == 'tsv':
            csv_dict = csv.DictReader(csv_file, delimiter='\t', restkey=None, restval=None,)

        out = []
        header = csv_dict.fieldnames
        for row in csv_dict:
            temp_list = []
            for h in header:
                temp_list.append((h, row[h]))
            out.append(collections.OrderedDict(temp_list))
        #out = [obj for obj in csv_dict]
        output = json.dumps(out)

    return output


#if __name__ == "__main__":
#	app.run(port=5000)