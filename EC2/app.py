import post_question as pq
import post_blog as pb

import tensorflow_hub as hub
import simplejson as json

from flask import Flask, request
from flask_cors import CORS, cross_origin

model = hub.load("./model")
print (f"module {model} loaded")


app = Flask(__name__)
CORS(app,resources={r"/api/*":{"origins":"*"}} )
app.config['CORS HEADERS'] = 'Content-Type'
            
@app.route('/question', methods=['POST'])
@cross_origin()
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        return pq.post_question(json, model)
    else:
        return 'Content-Type not supported!'

@app.route("/", methods=['GET'])
@cross_origin()
def getData():
    return "Data"

@app.route('/blog', methods=['POST'])
@cross_origin()
def process_json_blog():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        return pb.post_blog(json, model)
    else:
        return 'Content-Type not supported!'

if __name__ == "__main__":
	app.run(host= '0.0.0.0', debug=True, port=****)