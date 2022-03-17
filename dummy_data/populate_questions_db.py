#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from tqdm import tqdm
import tensorflow_hub as hub
import time
from decimal import Decimal
import boto3


# In[2]:


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('questions-db')


# In[3]:


module_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(module_url)
print ("module %s loaded" % module_url)


# In[4]:


def embed(inp):
    return model(inp)


# In[5]:


def put_data(data, table):
    response = table.put_item(Item=data)
    return response


# In[6]:


df = pd.read_csv('dummy_data\data\questionIDs.csv')
TAGLIST = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']


# In[7]:


for i in tqdm(range(len(df))): 
    sample = {
        "question_id": df['question_id'][i],
        "question": df['question'][i],
        "tags": df['tags'][i].split('-'),
        "upvotes": Decimal(str(df['upvotes'][i])),
        "downvotes":Decimal(str(df['downvotes'][i])),
        "timestamp":df['timestamp'][i],
        "math_vector": list(map(lambda x: Decimal(str(x)), list(embed([df['question'][i]])[0].numpy()))),
        "answer_id":[],
        "question_user_id":'user1',
        "image_urls": [],
        "comments_id": []
    }
#     put_data(sample, table)
    time.sleep(5)