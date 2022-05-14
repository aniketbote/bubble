import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('blogs-db')

def lambda_handler(event, context):
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'blog_id': event['blog_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    response.pop("math_vector")
    if 'comment_ids' not in response.keys():
        response['comment_ids'] = []
    else:
        response['comment_ids'] = list(response['comment_ids'])
    return response