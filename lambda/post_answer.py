import simplejson as json
import logging
import boto3
import uuid
from datetime import datetime

from boto3.dynamodb.types import TypeSerializer
from decimal import Decimal
import six
import sys

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    # TODO implement
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    answer = {
     "answer_id": uuid.uuid4().hex,
     "upvotes": 0,
     "user_id": event["user_id"],
     "downvotes": 0,
     "timestamp": str(datetime.now()).split('.')[0],
     "username": event["username"],
     "answer": event["answer"],
     "image_urls": event["image_urls"],
     "comment_ids": []
    }
    
    logger.debug(f"[USER][ANSWER] {dumps(answer, as_dict=True)}")
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Put":{
                        "TableName": "answers-db",
                        "Item":dumps(answer, as_dict=True)
                    }
                },
                {
                    "Update":{
                        "TableName": "questions-db",
                        "Key":{
                            "question_id":{"S":event['question_id']}
                        },
                        "UpdateExpression": "SET answer_ids = list_append(answer_ids,:new_element)",
                        "ExpressionAttributeValues":{
                            ":new_element": {"L": [{"S":answer['answer_id']}]}
                        }
                        
                    }
                },
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "SET answers_created = list_append(answers_created,:new_element)",
                        "ExpressionAttributeValues":{
                            ":new_element": {"L": [{"S":answer['answer_id']}]}
                        }
                        
                    }
                }
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed"}
        
        
    
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
            serial = long(o)
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
