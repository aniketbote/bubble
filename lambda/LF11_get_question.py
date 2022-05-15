import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('questions-db')

def lambda_handler(event, context):
    '''
    A function to return question details based on question id
    '''
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'question_id': event['question_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    response.pop("math_vector")
    if 'comment_ids' not in response.keys():
        response['comment_ids'] = []
    else:
        response['comment_ids'] = list(response['comment_ids'])
    return response