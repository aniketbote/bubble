import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('user-activity-db')

def lambda_handler(event, context):
    '''
    A function to return question details based on question id
    '''
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'user_id': event['user_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    type = event["type"]
    query_dict = {} 
    if type == "question":
        query_dict = response["questions_voted"]
    elif type == "answer":
        query_dict = response["answers_voted"]
    elif type == "blog":
        query_dict = response["blogs_voted"]
    
    if event["id"] not in query_dict.keys():
        response = 0
    else:
        response = query_dict[event["id"]]

    return response