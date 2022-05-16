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
    if len(event['comment_ids']) == 0:
        return []
    response = client.batch_get_item(
        RequestItems={
            'comments-db': {'Keys': [{'comment_id': id} for id in event['comment_ids']]}
        }
    )['Responses']['comments-db']
    logger.debug(f"[USER][RESPONSE] {response}")
    
    
    return response
