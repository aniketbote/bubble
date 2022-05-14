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
    response = client.batch_get_item(
        RequestItems={
            'answers-db': {'Keys': [{'answer_id': id} for id in event['answer_ids']]}
        }
    )['Responses']['answers-db']
    logger.debug(f"[USER][RESPONSE] {response}")
    
    return response
