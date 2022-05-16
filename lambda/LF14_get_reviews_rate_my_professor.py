import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

client = boto3.resource('dynamodb')


def lambda_handler(event, context):
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    if len(event['review_ids']) == 0:
        return []
    response = client.batch_get_item(
        RequestItems={
            'professor-reviews-db': {'Keys': [{'review_id': id} for id in event['review_ids']]}
        }
    )['Responses']['professor-reviews-db']
    logger.debug(f"[USER][RESPONSE] {response}")
    
    
    return response