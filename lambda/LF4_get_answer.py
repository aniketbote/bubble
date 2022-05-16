import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

client = boto3.resource('dynamodb')


def lambda_handler(event, context):
    # TODO implement
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    if len(event['answer_ids']) == 0:
        return []
    response = client.batch_get_item(
        RequestItems={
            'answers-db': {'Keys': [{'answer_id': id} for id in event['answer_ids']]}
        }
    )['Responses']['answers-db']
    logger.debug(f"[USER][RESPONSE] {response}")
    for i in range(len(response)):
        if 'comment_ids' not in response[i].keys():
            response[i]['comment_ids'] = []
        else:
            response[i]['comment_ids'] = list(response[i]['comment_ids'])
    
    return response
