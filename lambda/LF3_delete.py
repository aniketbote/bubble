import simplejson as json
import logging
import boto3
import uuid
from datetime import datetime


from boto3.dynamodb.types import TypeSerializer
from decimal import Decimal
import six
import requests
import sys

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('professor-reviews-db')

host = '******'
master_user = '****'
master_password = '*****'

def lambda_handler(event, context):
    # TODO implement
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    
    if "question_id" in event.keys():
        table_name, prim_key = ("questions-db", "question_id")
    elif "answer_id" in event.keys():
        table_name, prim_key= ("answers-db", "answer_id")
    elif "review_id" in event.keys():
        table_name, prim_key, parent_table, parent_id = ("professor-reviews-db", "review_id", "professors-db", "professor_id")
    elif "comment_id" in event.keys():
        table_name, prim_key, parent_table, parent_id = ("comments-db", "comment_id", event['parent'] + "s-db", event['parent'] + "_id")
        if event['parent'] not in ['question', 'answer', 'blog']:
            return {"status": 400,"message":"Bad request"}
    elif 'blog_id' in event.keys():
        table_name, prim_key= ("blogs-db", "blog_id")
    else:
        return {"status": 400,"message":"Bad request"}
        
    
    if 'comment_id' in event.keys():
        response = delete_comment(event, parent_table, parent_id)
    elif 'review_id' in event.keys():
        response = delete_review(event, parent_table, parent_id)
    else:
        response = set_delete(event, table_name, prim_key)
    return response
    
def delete_review(event, parent_table, parent_id):
    try:
        review_data = table.get_item(Key={"review_id": event["review_id"]})['Item']
        rating = int(review_data['rating'])
        logger.debug(f"[USER][REVIEW] {review_data}")
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Delete":{
                        "TableName": "professor-reviews-db",
                        "Key":{
                            "review_id":{"S":event['review_id']}
                        }
                    }
                },
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "DELETE reviews_created :del_review",
                        "ExpressionAttributeValues":{
                            ":del_review": {'SS':[event["review_id"]]}
                        }
                    }
                },
                {
                    "Update":{
                        "TableName": parent_table,
                        "Key":{
                            "professor_id":{"S":review_data["professor_id"]}
                        },
                        "UpdateExpression": "DELETE reviews :del_review  SET num_ratings = num_ratings - :dcr, total_rating = total_rating - :del_rating, #cv.#tag_created = #cv.#tag_created - :dcr",
                        "ExpressionAttributeValues":{
                            ":del_review": {'SS':[event["review_id"]]},
                            ":dcr" : {"N":"1"},
                            ":del_rating":{"N": str(rating)}
                        },
                        "ExpressionAttributeNames":{
                            '#cv': "rating_type_counts",
                            '#tag_created': review_data['tags'] + "_count"
                            
                        }
                    }
                }
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed"}
    
    
def delete_comment(event, parent_table, parent_id):
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Delete":{
                        "TableName": "comments-db",
                        "Key":{
                            "comment_id":{"S":event['comment_id']}
                        }
                    }
                },
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "DELETE comments_created :del_comment",
                        "ExpressionAttributeValues":{
                            ":del_comment": {'SS':[event["comment_id"]]}
                        }
                    }
                },
                {
                    "Update":{
                        "TableName": parent_table,
                        "Key":{
                            parent_id:{"S":event["parent_id"]}
                        },
                        "UpdateExpression": "DELETE comment_ids :del_comment",
                        "ExpressionAttributeValues":{
                            ":del_comment": {'SS':[event["comment_id"]]}
                        }
                    }
                }
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed"}
    
def set_delete(event, tname, pkey):
    try:
        open_response = {'result':"Not Executed"}
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Update":{
                        "TableName": tname,
                        "Key":{
                            pkey:{"S":event[pkey]}
                        },
                        "UpdateExpression": "SET deleted = :delete_bool",
                        "ExpressionAttributeValues":{
                            ":delete_bool": {"BOOL": True}
                        }
                        
                    }
                }
            ]
        )
        if pkey == 'question_id':
            index = '/questions/Questions'
            url = host + index + "/" + event[pkey]
            logger.debug(f"[USER][URL] {url}")
            r = requests.delete(url, auth=(master_user, master_password))
            open_response = json.loads(r.text)
            logger.debug(f"[USER][OPENSEARCH] {open_response}")
        elif pkey == 'blog_id':
            index = '/blogs/Blogs'
            url = host + index + "/" + event[pkey]
            logger.debug(f"[USER][URL] {url}")
            r = requests.delete(url, auth=(master_user, master_password))
            open_response = json.loads(r.text)
            logger.debug(f"[USER][OPENSEARCH] {open_response}")
        else:
            open_response = {'result':"Not applicable"}
            
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened","opensearch": open_response['result']}
    
    return {"status": 200,"message":"Task completed", "opensearch": open_response['result']}
    
        
        
    
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