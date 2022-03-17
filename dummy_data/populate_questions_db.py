import time
from decimal import Decimal

import pandas as pd
from tqdm import tqdm
import tensorflow_hub as hub
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('questions-db')

MODULE_URL = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(MODULE_URL)
print (f"module {MODULE_URL} loaded")

def embed(inp):
    '''
    A function to create sentence embeddings using universal sentence encoder model.
    '''
    return model(inp)

def put_data(data, d_table):
    '''
    A function to insert data into dynamodb table
    '''
    response = d_table.put_item(Item=data)
    return response

df = pd.read_csv(r'dummy_data\data\questionIDs.csv')
TAGLIST = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', \
    'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

for i in tqdm(range(len(df))):
    sample = {
        "question_id": df['question_id'][i],
        "question": df['question'][i],
        "tags": df['tags'][i].split('-'),
        "upvotes": Decimal(str(df['upvotes'][i])),
        "downvotes":Decimal(str(df['downvotes'][i])),
        "timestamp":df['timestamp'][i],
        "math_vector": list(map(lambda x: Decimal(str(x)), list(embed([df['question'][i]])[0] \
            .numpy()))),
        "answer_id":[],
        "question_user_id":'user1',
        "image_urls": [],
        "comments_id": []
    }
#     put_data(sample, table)
    time.sleep(5)
