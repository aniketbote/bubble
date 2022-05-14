import post_question as pq
import post_blog as pb

import tensorflow_hub as hub
import simplejson as json

from flask import Flask, request

model = hub.load("./model")
print (f"module {model} loaded")


app = Flask(__name__)
            
@app.route('/question', methods=['POST'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        return pq.post_question(json, model)
    else:
        return 'Content-Type not supported!'

@app.route("/", methods=['GET'])
def getData():
    return "Data"

@app.route('/blog', methods=['POST'])
def process_json_blog():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        return pb.post_blog(json, model)
    else:
        return 'Content-Type not supported!'

if __name__ == "__main__":
	app.run(host= '0.0.0.0', debug=True, port=***)