import simplejson as json
import logging
import boto3
import uuid
from datetime import datetime

from boto3.dynamodb.types import TypeSerializer
import re
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
    
    comment = {
     "comment_id": uuid.uuid4().hex,
     "user_id": event["user_id"],
     "username": event["username"],
     "comment_content": event["comment_content"],
     "timestamp": str(datetime.now()).split('.')[0]
    }
    table_name, prim_key = ("questions-db", "question_id") if "question_id" in event.keys() else ("answers-db", "answer_id")
    logger.debug(f"[USER][VAR] table_name : {table_name}  prim_key: {prim_key}")
    
    
    
    logger.debug(f"[USER][COMMENT] {dumps(comment, as_dict=True)}")
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Put":{
                        "TableName": "comments-db",
                        "Item":dumps(comment, as_dict=True)
                    }
                },
                {
                    "Update":{
                        "TableName": table_name,
                        "Key":{
                            prim_key:{"S":event[prim_key]}
                        },
                        "UpdateExpression": "SET comment_ids = list_append(comment_ids,:new_element)",
                        "ExpressionAttributeValues":{
                            ":new_element": {"L": [{"S":comment['comment_id']}]}
                        }
                        
                    }
                },
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "SET comments_created = list_append(comments_created,:new_element)",
                        "ExpressionAttributeValues":{
                            ":new_element": {"L": [{"S":comment['comment_id']}]}
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
