import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('professors-db')

def lambda_handler(event, context):
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'professor_id': event['professor_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    if 'reviews' not in response.keys():
        response['reviews'] = []
    else:
        response['reviews'] = list(response['reviews'])
    return response