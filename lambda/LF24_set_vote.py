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
    
    table_name, prim_key, att_name = ("questions-db", "question_id", "questions_voted") if "question_id" in event.keys() else ("answers-db", "answer_id", "answers_voted") if "answer_id" in event.keys() else ("blogs-db", "blog_id", "blogs_voted")
    logger.debug(f"[USER][CONTEXT] table_name:{table_name}  prim_key:{prim_key}  att_name:{att_name}")
    
    if event['previous'] == 0:
        response = new_vote(event, table_name, prim_key, att_name)
    elif event['value'] == 0:
        response = change_vote(event, table_name, prim_key, att_name)
    elif event['value'] in [1, -1] and event['previous'] in [1, -1] and event['value'] != event['previous']:
        response = multi_change(event, table_name, prim_key, att_name)
    else:
        logger.debug(f"[USER][EXCEPTION] Bad request")
        return {"status": 400,"message":"Bad request"}
        
    return response
    
def multi_change(data, tname, pkey, aname):
    cur_vote_type, new_vote_type = ("upvotes", "downvotes") if data['previous'] == 1 else ("downvotes", "upvotes")
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":data['user_id']}
                        },
                        "UpdateExpression": "SET #av.#aid = :curr_val",
                        "ExpressionAttributeValues":{
                            ":curr_val": {"N":str(data['value'])}},
                        "ExpressionAttributeNames":{
                            '#av': aname,
                            '#aid': data[pkey]}
                    }
                },
                {
                    "Update":{
                        "TableName": tname,
                        "Key":{
                            pkey:{"S":data[pkey]}
                        },
                        "UpdateExpression": "SET #cvt = #cvt - :val, #nvt = #nvt + :val",
                        "ExpressionAttributeValues":{
                            ":val": {"N":"1"}},
                        "ExpressionAttributeNames":{
                            '#cvt': cur_vote_type,
                            '#nvt': new_vote_type
                        }
                    }
                }
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed"}
    
def change_vote(data, tname, pkey, aname):
    vote_type = "upvotes" if data['previous'] == 1 else "downvotes"
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":data['user_id']}
                        },
                        "UpdateExpression": "REMOVE #av.#aid",
                        "ExpressionAttributeNames":{
                            '#av': aname,
                            '#aid': data[pkey]}
                    }
                },
                {
                    "Update":{
                        "TableName": tname,
                        "Key":{
                            pkey:{"S":data[pkey]}
                        },
                        "UpdateExpression": "SET #vt = #vt - :val",
                        "ExpressionAttributeValues":{
                            ":val": {"N":"1"}},
                        "ExpressionAttributeNames":{
                            '#vt': vote_type}
                    }
                }
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed"}
    
    
def new_vote(data, tname, pkey, aname):
    vote_type = "upvotes" if data['value'] == 1 else "downvotes"
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":data['user_id']}
                        },
                        "UpdateExpression": "SET #av.#aid = :val",
                        "ExpressionAttributeValues":{
                            ":val": {"N":str(data['value'])}},
                        "ExpressionAttributeNames":{
                            '#av': aname,
                            '#aid': data[pkey]}
                    }
                },
                {
                    "Update":{
                        "TableName": tname,
                        "Key":{
                            pkey:{"S":data[pkey]}
                        },
                        "UpdateExpression": "SET #vt = #vt + :val",
                        "ExpressionAttributeValues":{
                            ":val": {"N":str(1)}},
                        "ExpressionAttributeNames":{
                            '#vt': vote_type}
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