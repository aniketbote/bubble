
# coding: utf-8

# In[1]:


import boto3
import json
import requests
import datetime
from decimal import Decimal
from time import sleep


# In[2]:


import pandas as pd


# In[3]:


comments_df = pd.read_csv("commentsIDs.csv")


# In[4]:


comments_df.head(5)


# In[5]:


columns = comments_df.columns
print(columns)


# In[6]:


commentIDs_list = comments_df['commentID'].tolist()
comment_list = comments_df['comment'].tolist()
timestamp_list = comments_df['timestamp'].tolist()


# In[7]:


print(len(commentIDs_list), len(comment_list), len(timestamp_list))


# In[8]:



client = boto3.resource(
    service_name='dynamodb',
    region_name='us-east-1',
    aws_access_key_id="AKIA2DHJUBNXZOBNU6EF",
    aws_secret_access_key="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"
)


# In[9]:


comments_table = client.Table('comments-db')


# In[10]:


with comments_table.batch_writer() as batch:
    for i in range(comments_df.shape[0]):
        new_record = {}
        new_record['commentID'] = commentIDs_list[i]
        new_record['comment'] = comment_list[i]
        new_record['timestamp'] = timestamp_list[i]
        batch.put_item(Item=new_record)

