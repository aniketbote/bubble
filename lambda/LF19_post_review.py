import simplejson as json
import logging
import boto3
import uuid
from datetime import datetime

from boto3.dynamodb.types import TypeSerializer
from decimal import Decimal
import six
import sys
import re

CLEANR = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

client = boto3.client('dynamodb')
comprehend = boto3.client(service_name='comprehend')

def cleanhtml(raw_html):
  cleantext = re.sub(CLEANR, '', raw_html)
  return cleantext

def lambda_handler(event, context):
    # TODO implement
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    clean_text = cleanhtml(event['review'])
    logger.debug(f"[USER][CLEANED] {clean_text}")
    
    review_sentiment_response = comprehend.detect_sentiment(Text=clean_text, LanguageCode='en')
    logger.debug(f"[USER][SENTIMENT_RESPONSE] {review_sentiment_response}")
    logger.debug(f"[USER][SENTIMENT] {review_sentiment_response['Sentiment']}")
    
    
    
    
    review = {
    #  "review_id": uuid.uuid4().hex if 'review_id' not in event.keys() else event['review_id'],
     "review_id": uuid.uuid4().hex,
     "attendance": event['attendance'],
     "difficulty": event['difficulty'],
     "for_credit": event['for_credit'],
     "grade": event['grade'],
     "online": event['online'],
     "professor_id": event['professor_id'],
     "quality": event['quality'],
     "rating": event['rating'],
     "review": event['review'],
     "tags": event['tags'],
     "take_again": event['take_again'],
     "timestamp": str(datetime.now()).split('.')[0],
     "user_id": event['user_id'],
     "review_sentiment": review_sentiment_response['Sentiment'].lower(),
     "edited": False,
     "edited_timestamp": "",
     "deleted":False
    }
    
    logger.debug(f"[USER][REVIEW] {dumps(review, as_dict=True)}")
    
    if 'review_id' not in event.keys():
        response = create_new(review, event)
    else:
        response = {"status": 400,"message":"Bad Request"}
    return response
    
    
def create_new(review, event):
    try:
        response = client.transact_write_items(
            TransactItems=[
                {
                    "Put":{
                        "TableName": "professor-reviews-db",
                        "Item":dumps(review, as_dict=True)
                    }
                },
                {
                    "Update":{
                        "TableName": "professors-db",
                        "Key":{
                            "professor_id":{"S":event['professor_id']}
                        },
                        "UpdateExpression": "SET num_ratings = num_ratings + :incr, total_rating = total_rating + :curr_rating, #cv.#tag_created = #cv.#tag_created + :incr  ADD reviews :new_element",
                        "ExpressionAttributeValues":{
                            ":incr": {"N": "1"},
                            ":curr_rating": {"N": str(event['rating'])},
                            ":new_element": {"SS": [review['review_id']]}
                        },
                        "ExpressionAttributeNames":{
                            '#cv': "rating_type_counts",
                            '#tag_created': event['tags'] + "_count"
                            
                        }
                        
                    }
                },
                {
                    "Update":{
                        "TableName": "user-activity-db",
                        "Key":{
                            "user_id":{"S":event["user_id"]}
                        },
                        "UpdateExpression": "ADD reviews_created :new_element",
                        "ExpressionAttributeValues":{
                            ":new_element": {"SS": [review['review_id']]}
                        }
                        
                    }
                }
                
                
            ]
        )
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
        return {"status": 400,"message":"Something unexpected happened"}
    
    return {"status": 200,"message":"Task completed", "review_id":review["review_id"], "timestamp":review["timestamp"]}
    
# def create_edit(event):
#     try:
#         edit_time = str(datetime.now()).split('.')[0]
#         response = client.transact_write_items(
#             TransactItems=[
#                 {
#                     "Update":{
#                         "TableName": "professor-reviews-db",
#                         "Key":{
#                             "review_id":{"S":event["review_id"]}
#                         },
#                         "UpdateExpression": "SET review = :new_review, edited = :edit_bool, edited_timestamp = :edit_time",
#                         "ExpressionAttributeValues":{
#                             ":new_review": {"S":event['review']},
#                             ":edit_bool": {"BOOL": True},
#                             ":edit_time": {"S":edit_time}
#                         }
                        
#                     }
#                 }
#             ]
#         )
#     except Exception as e:
#         logger.debug(f"[USER][EXCEPTION] {e}")
#         return {"status": 400,"message":"Something unexpected happened"}
    
#     return {"status": 200,"message":"Task completed", "review_id":event["review_id"], "timestamp":edit_time}
    
        
        
    
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