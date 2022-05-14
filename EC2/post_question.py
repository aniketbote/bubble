
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

client = boto3.client('dynamodb', aws_access_key_id="AKIA2DHJUBNXY7BMXBOI",
						  aws_secret_access_key="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", region_name= 'us-east-1')

dynamodb = boto3.resource(service_name='dynamodb',
						  aws_access_key_id="AKIA2DHJUBNXY7BMXBOI",
						  aws_secret_access_key="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",
						  region_name="us-east-1",
						  endpoint_url="http://dynamodb.us-east-1.amazonaws.com")
table1 = dynamodb.Table('questions-db')
table2 = dynamodb.Table('user-activity-db')

host = 'https://search-bubble-domain-rfgwnz5ocgakgdb44rflkimdbi.us-east-1.es.amazonaws.com'

master_user = 'admin'
master_password = 'Admin@12345'


def findimagesrc(data):
	soup = BSHTML(data)
	images = soup.findAll('img')
	imgSrcs = []
	for image in images:
		imgSrcs.append(image['src'])
	return imgSrcs


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def post_question(event, model):
	
	logger.debug(f"[USER][EVENT] {event}")

	create_question = {
	 "question_id": uuid.uuid4().hex if 'question_id' not in event.keys() else event['question_id'],
	 "question_title": event["question_title"],
	 "question_description": event["question_description"],
	 "answer_ids": [],
	 #"comment_ids": [],
	 "downvotes": 0,
	 "image_urls": list(findimagesrc(event["question_description"])),
	 "math_vector": list(map(lambda x: Decimal(str(x)), \
			list(model([event['question_title']])[0].numpy()))),
	 "tags": event["tags"],
	 "timestamp": str(datetime.now()).split('.')[0],
	 "edited": False,
	 "edited_timestamp": " ",
	 "upvotes": 0,
	 "user_id": event["user_id"],
	 "username": event["username"],
	 "accepted_id": "empty"
	}

	logger.debug(f"[USER][QUESTION] {dumps(create_question, as_dict=True)}")

	for url in create_question["image_urls"]:
		sqsid = imageSQSRequest(url, create_question['question_id'], create_question['user_id'])

	if 'question_id' not in event.keys():
		reponse = create_new(create_question, event)
	else:
		reponse = create_edit(event, create_question)
	return reponse

def imageSQSRequest(requestData, questionid, userid):
	

	sqs = boto3.client('sqs', aws_access_key_id="AKIA2DHJUBNXY7BMXBOI", 
						aws_secret_access_key="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", region_name= 'us-east-1', endpoint_url="https://sqs.us-east-1.amazonaws.com/694127168367/Q1")
	
	# sqs = boto3.resource(service_name='sqs',
	#                       aws_access_key_id="AKIA2DHJUBNXY7BMXBOI",
	#                       aws_secret_access_key="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",
	#                       region_name="us-east-1",
	#                       endpoint_url="https://sqs.us-east-1.amazonaws.com/694127168367/Q1")

	queue_url = "https://sqs.us-east-1.amazonaws.com/694127168367/Q1"
	messageAttributes = {
		"question_id": questionid ,
		"image_urls": requestData ,
		"user_id": userid ,
		"pkey": questionid
	}
	#messageBody=(messageAttributes)
	
	response = sqs.send_message(QueueUrl = queue_url, MessageBody = json.dumps(messageAttributes))
	
	return response

def create_new(create_question, event):
	try:
		response = client.transact_write_items(
			TransactItems=[
				{
					"Put":{
						"TableName": "questions-db",
						"Item":dumps(create_question, as_dict=True)
					}
				},
				{
					"Update":{
						"TableName": "user-activity-db",
						"Key":{
							"user_id":{"S":event["user_id"]}
						},
						"UpdateExpression": "SET questions_created = list_append(questions_created,:new_element)",
						"ExpressionAttributeValues":{
							":new_element": {"L": [{"S":create_question['question_id']}]}
						}
						
					}
				}
			]
		)
		new_record = {}
		index = '/questions/Questions'
		#url = host+'/'+index
	
		new_record["question_id"] = create_question["question_id"]
		new_record['timestamp'] = create_question["timestamp"]
		new_record["question_title"] = event["question_title"]
	
		url = host+index+ "/" + new_record["question_id"] + "/"
		r = requests.post(url, auth=(master_user, master_password), json=new_record)
		time.sleep(0.1)
	except Exception as e:
		logger.debug(f"[USER][EXCEPTION] {e}")
		return {"status": 400,"message":"Something unexpected happened"}
	
	return {"status": 200,"message":"Task completed",'body': json.dumps('Inserted into bubble-domain'), "question_id":create_question["question_id"], "timestamp":create_question["timestamp"]}   

def create_edit(event, create_question):
	try:
		edit_time = str(datetime.now()).split('.')[0]
		response = client.transact_write_items(
			TransactItems=[
				{
					"Update":{
						"TableName": "questions-db",
						"Key":{
							"question_id":{"S":event["question_id"]}
						},
						"UpdateExpression": "SET question_description = :new_question_description, question_title = :new_question_title, edited = :edit_bool, edited_timestamp = :edit_time, image_urls = :new_image_urls",
						"ExpressionAttributeValues":{
							":new_question_description": {"S":event['question_description']},
							":new_question_title": {"S":event['question_title']},
							":new_image_urls" : create_question["image_urls"],
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
	
	return {"status": 200,"message":"Task completed", "question_id":event["question_id"], "timestamp":edit_time}

def update_Elastic_Search(event):
	try:
		data = event
		if event['question_id'] is None or event['question_id'] == "":
			return {"error_message": "Invalid request body"}
		query = host + '/questions/_search'
		data2 = {
			"query": {
				"match": {
					"question_id": {
						"query": str(event['question_id'])
					}
				}
			}
		}
		response = requests.get(query, auth=(master_user, master_password), json=data2,
								headers={"Content-Type": "application/json"}).json()
		if len(response["hits"]["hits"]) == 0:
			return {"error_message": "Data not found"}
		doc_id = response["hits"]["hits"][0]["_id"]
		url = host + '/questions/Questions/' + str(doc_id)
		print(data)
		document = {
			"question_id": event['question_id'],
			"timestamp": int(time.time()*10000),
			"question_title": event['question_title']
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