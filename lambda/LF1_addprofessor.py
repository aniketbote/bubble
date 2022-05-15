import json
import boto3
import logging 
import uuid
import time
import requests
from requests_aws4auth import AWS4Auth
from opensearchpy import OpenSearch, RequestsHttpConnection
from aws_requests_auth.aws_auth import AWSRequestsAuth


host = '****'
master_user = '****'
master_password = '*****'

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


dynamodb = boto3.resource("dynamodb")
professor_table = dynamodb.Table("professors-db")
#test_table = dynamodb.Table("test1")
def lambda_handler(event, context):
    # TODO implement
    #first_name, last_name
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    first_name = event['first_name']
    last_name = event['last_name']
    professor_id = uuid.uuid4().hex
    num_ratings = 0
    rating_type_counts ={ "average_count": 0, "awesome_count":0, "awful_count":0}
    total_rating = 0
    # reviews = []
    
    prof_dict = {
        "first_name" : first_name,
        "last_name": last_name,
        "professor_id": professor_id,
        "num_ratings": num_ratings,
        "rating_type_counts": rating_type_counts,
        "total_rating": total_rating
        # "reviews": reviews
    }
    
    #with test_table.batch_writer() as batch:
    #    prof_dict["t1"] = "prof_db_check_id_1"
    #    batch.put_item(Item=prof_dict)
    
    with professor_table.batch_writer() as batch:
        batch.put_item(Item=prof_dict)
    
    index = '/professors/Professors'
    url = host+'/'+index
    new_record = {}
    new_record["professor_id"] = professor_id
    new_record["first_name"] = first_name
    new_record["last_name"] = last_name
    url = host+index+ "/" + new_record["professor_id"] + "/"
    r = requests.post(url, auth=(master_user, master_password), json=new_record)
    time.sleep(0.1)
    
    return {
        'status': 200,
        'professor_id':professor_id,
        'message': json.dumps('success')
    }
