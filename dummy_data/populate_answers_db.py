import time
from decimal import Decimal

import pandas as pd
from tqdm import tqdm
import tensorflow_hub as hub
import boto3

dynamodb = boto3.resource(service_name='dynamodb',
                          aws_access_key_id="",
                          aws_secret_access_key="",
                          region_name="us-east-1",
                          endpoint_url="http://dynamodb.us-east-1.amazonaws.com")
table = dynamodb.Table('answers-db')

def put_data(data, d_table):
    '''
    A function to insert data into dynamodb table
    '''
    response = d_table.put_item(Item=data)
    return response

df = pd.read_csv(r'/content/drive/MyDrive/AFile/answerIDs.csv')

for i in tqdm(range(len(df))):
    sample = {
        "answer_id": df['answer_id'][i],
        "answers": df['answers'][i],
        "upvotes": Decimal(str(df['upvotes'][i])),
        "downvotes":Decimal(str(df['downvotes'][i])),
        "timestamp":df['timestamp'][i],
        "commentID": df['commentID'][i]
    }
    put_data(sample, table)
    time.sleep(5)
