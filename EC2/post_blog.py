from multiprocessing import Event
from bs4 import BeautifulSoup as BSHTML
from decimal import Decimal
from datetime import datetime
import urllib
import uuid
import time
import simplejson as json

import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow_hub as hub

import re
import logging
import boto3
import requests

import sys
from boto3.dynamodb.types import TypeSerializer
import six

client = boto3.client('dynamodb', aws_access_key_id="*****", 
                        aws_secret_access_key="*******", region_name= 'us-east-1')

dynamodb = boto3.resource(service_name='dynamodb',
                          aws_access_key_id="*******",
                          aws_secret_access_key="*********",
                          region_name="us-east-1",
                          endpoint_url="***********")
table1 = dynamodb.Table('blogs-db')
table2 = dynamodb.Table('user-activity-db')

host = '**********'

master_user = '******'
master_password = '*********'

WPM = 200
WORD_LENGTH = 5



def findimagesrc(data):
    soup = BSHTML(data)
    images = soup.findAll('img')
    imgSrcs = []
    for image in images:
        imgSrcs.append(image['src'])
    return imgSrcs

def _count_words_in_text(text: str) -> int:
    return len(text) // WORD_LENGTH

def remove_html_tags(text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', str(text))

def estimate_reading_time(text: str) -> int:
    filtered_text = remove_html_tags(text)
    total_words = _count_words_in_text(filtered_text)
    return total_words // WPM


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def post_blog(event, model):
    
    logger.debug(f"[USER][EVENT] {event}")

    removetag = remove_html_tags(event['blog_content'])

    create_blog = {
     "blog_id": uuid.uuid4().hex if 'blog_id' not in event.keys() else event['blog_id'],
     "blog_title": event["blog_title"],
     "blog_content": event["blog_content"],
     "blog_short_description": removetag[:750],
     "image_urls": findimagesrc(event["blog_content"]),
     "math_vector": list(map(lambda x: Decimal(str(x)), \
            list(model([event['blog_title']])[0].numpy()))),
     "timestamp": str(datetime.now()).split('.')[0],
     "edited": False,
     "edited_timestamp": "",
     "tags": event["tags"],
     "upvotes": 0,
     "user_id": event["user_id"],
     "username": event["username"],
     #"comment_ids": [],
     "read_time": estimate_reading_time(event["blog_content"])
    }

    logger.debug(f"[USER][BLOG] {dumps(create_blog, as_dict=True)}")
 
    for url in create_blog["image_urls"]:
        sqsid = imageSQSRequest(url, create_blog['blog_id'], create_blog['user_id'])


    if 'blog_id' not in event.keys():
        reponse = create_new(create_blog, event)
    else:
        reponse = create_edit(event, create_blog)
    return reponse


def imageSQSRequest(requestData, blogid, userid):
    

    sqs = boto3.client('sqs', aws_access_key_id="********", 
                        aws_secret_access_key="********", region_name= 'us-east-1', endpoint_url="*******")
    


    queue_url = "********"
    messageAttributes = {
        "blog_id": blogid,
        "image_urls": requestData,
        "user_id":userid,
        "pkey": blogid
    }
    #messageBody=(messageAttributes)

    response = sqs.send_message(QueueUrl = queue_url, MessageBody = json.dumps(messageAttributes))
    
    return response


def create_new(create_blog, event):
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Put":{
                        "TableName": "blogs-db",
                        "Item":dumps(create_blog, as_dict=True)
                    }
                },
                {
                   "Update":{
                       "TableName": "user-activity-db",
                       "Key":{
                           "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "SET blogs_created = list_append(blogs_created,:new_element)",
                        "ExpressionAttributeValues":{
                            ":new_element": {"L": [{"S":create_blog['blog_id']}]}
                        }
                        
                    }
                }
            ]
        )

        new_record = {}
        index = '/blogs/Blogs'
        #url = host+'/'+index

        new_record["blog_id"] = create_blog["blog_id"]
        new_record['timestamp'] = int(time.time()*10000)
        new_record["blog_title"] = event["blog_title"]
        url = host+index+ "/" + new_record["blog_id"] + "/"
        r = requests.post(url, auth=(master_user, master_password), json=new_record)
        time.sleep(0.1)
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed",'body': json.dumps('Inserted into bubble-domain'), "blog_id":create_blog["blog_id"], "timestamp":create_blog["timestamp"], 'headers':{"Access-Control-Allow-Origin": "*"}}

def create_edit(event, create_blog):

    removetag = remove_html_tags(event['blog_content'])

    try:
        edit_time = str(datetime.now()).split('.')[0]
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Update":{
                        "TableName": "blogs-db",
                        "Key":{
                            "blog_id":{"S":event["blog_id"]}
                        },
                        "UpdateExpression": "SET blog_content = :new_blog_content, blog_title = :new_blog_title, blog_short_description = :new_blog_short_description, edited = :edit_bool, edited_timestamp = :edit_time, image_urls = :new_image_urls",
                        "ExpressionAttributeValues":{
                            ":new_blog_content": {"S":event['blog_content']},
                            ":new_blog_title": {"S":event['blog_title']},
                            ":new_image_urls": {"L":create_blog["image_urls"]},
                            ":new_blog_short_description": {"S":removetag[:750]},
                            ":edit_bool": {"BOOL": True},
                            ":edit_time": {"S":edit_time}
                        }
                        
                    }
                }
            ]
        )
        update_Elastic_Search(event)
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed", "blog_id":event["blog_id"], "timestamp":edit_time, 'headers':{"Access-Control-Allow-Origin": "*"}}


def update_Elastic_Search(event):
    try:
        data = event
        if event['blog_id'] is None or event['blog_id'] == "":
            return {"error_message": "Invalid request body"}
        query = host + '/blogs/_search'
        data2 = {
            "query": {
                "match": {
                    "blog_id": {
                        "query": str(event['blog_id'])
                    }
                }
            }
        }
        response = requests.get(query, auth=(master_user, master_password), json=data2,
                                headers={"Content-Type": "application/json"}).json()
        if len(response["hits"]["hits"]) == 0:
            return {"error_message": "Data not found"}
        doc_id = response["hits"]["hits"][0]["_id"]
        url = host + '/blogs/Blogs/' + str(doc_id)
        print(data)
        document = {
            "blog_id": event['blog_id'],
            "timestamp": int(time.time()*10000),
            "blog_title": event['blog_title']
        }
        #document = {"doc": data}
        requests.post(url, auth=(master_user, master_password), json=document,
                      headers={"Content-Type": "application/json"}).json()
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400, "message": "Something unexpected happened in inner function"}


def json_serial(o):
    if isinstance(o, datetime):
        serial = o.strftime('%Y-%m-%dT%H:%M:%S.%f')
    elif isinstance(o, Decimal):
        if o % 1 > 0:
            serial = float(o)
        elif six.PY3:
            serial = int(o)
        elif o < sys.maxsize:
            serial = int(o)
        else:
            serial = int(o)
    elif isinstance(o, uuid.UUID):
        serial = str(o.hex)
    elif isinstance(o, set):
        serial = list(o)
    else:
        serial = o
    return serial


def dumps(dct, as_dict=False, **kwargs):
    """ Dump the dict to json in DynamoDB Format
        You can use any other simplejson or json options
        :param dct - the dict to dump
        :param as_dict - returns the result as python dict (useful for DynamoDB boto3 library) or as json sting
        :returns: DynamoDB json format.
        """

    result_ = TypeSerializer().serialize(json.loads(json.dumps(dct, default=json_serial),
                                                    use_decimal=True))
    if as_dict:
        return next(six.iteritems(result_))[1]
    else:
        return json.dumps(next(six.iteritems(result_))[1], **kwargs)
