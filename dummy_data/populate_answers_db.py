import time
from decimal import Decimal

import pandas as pd
from tqdm import tqdm
import boto3

db2 = boto3.resource(service_name='dynamodb',
                          aws_access_key_id="",
                          aws_secret_access_key="",
                          region_name="us-east-1",
                          endpoint_url="http://dynamodb.us-east-1.amazonaws.com")
table_item = db2.Table('answers-db')

def put_data(data1, db_table):
    '''
    A function to insert data into dynamodb table
    '''
    response = db_table.put_item(Item=data1)
    return response

df = pd.read_csv(r'C:\Users\Aniket\Documents\Aniket\bubble\dummy_data\data\Answer_Id.csv')

for i in tqdm(range(len(df))):
    sample1 = {
        "answer_id": df['answer_id'][i],
        "answers": df['answers'][i],
        "upvotes": Decimal(str(df['upvotes'][i])),
        "downvotes":Decimal(str(df['downvotes'][i])),
        "timestamp":df['timestamp'][i],
        "comments_id": df['commentID'][i],
        "image_urls": [],
    }
    put_data(sample1, table_item)
    time.sleep(5)
