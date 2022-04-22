import time
from decimal import Decimal
# import random

import pandas as pd
from tqdm import tqdm
import tensorflow_hub as hub
import boto3

dynamodb = boto3.resource('dynamodb', 
                            aws_access_key_id="",
                            aws_secret_access_key="")
table = dynamodb.Table('questions-db')

print("Loading Model")
MODULE_URL = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(MODULE_URL)
print (f"module {MODULE_URL} loaded")

df = pd.read_csv(r'dummy_data\data\question_db.csv')
# TAGLIST = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', \
#     'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']


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

for i in tqdm(range(len(df))):
    sample = {
        "question_id": df['question_id'][i],
        "question_title": df['question_title'][i],
        "question_description": df['question_description'][i],
        "tags": df['tags'][i].split('-'),
        "upvotes": Decimal(str(df['upvotes'][i])),
        "downvotes":Decimal(str(df['downvotes'][i])),
        "timestamp":df['timestamp'][i],
        "math_vector": list(map(lambda x: Decimal(str(x)), \
            list(embed([df['question_title'][i]])[0].numpy()))),
        "answer_ids":[] if pd.isna(df['answer_ids'][i]) else df['answer_ids'][i].split('----'),
        "user_id":df['user_id'][i],
        "username":df['username'][i],
        "image_urls": [df['image_urls'][i]],
        "comment_ids":[] if pd.isna(df['comment_ids'][i]) else df['comment_ids'][i].split('----'),
        "accepted_id": '' if pd.isna(df['accepted_answer_id'][i]) else df['accepted_answer_id'][i]
    }
    # print(sample)
    put_data(sample, table)
    time.sleep(2)



# for i in tqdm(range(len(df))):
#     sample = {
#         "question_id": df['question_id'][i],
#         "question_title": df['question_title'][i],
#         "question_description": df['question_description'][i],
#         "tags": df['tags'][i].split('-'),
#         "upvotes": Decimal(str(df['upvotes'][i])),
#         "downvotes":Decimal(str(df['downvotes'][i])),
#         "timestamp":df['timestamp'][i],
#         "math_vector": list(map(lambda x: Decimal(str(x)), \
#             list(embed([df['question_title'][i]])[0].numpy()))),
#         "answer_ids":df['answer_id'][i].split('-'),
#         "user_id":'user1',
#         "image_urls": [],
#         "comments_ids": df['comments_id'][i].split('-'),
#         "accepted_id": random.choice([random.choice(df['answer_id'][i].split('-')), ''])
#     }
#     put_data(sample, table)
#     time.sleep(1)
