import boto3
import time
import requests
import logging
from requests_aws4auth import AWS4Auth
import json
from opensearchpy import OpenSearch, RequestsHttpConnection
from aws_requests_auth.aws_auth import AWSRequestsAuth

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
dynamodb = boto3.resource("dynamodb")
host = '****'
port = 5000
master_user = '****'
master_password = '****'
auth = (master_user, master_password)

def lambda_handler(event, context):

    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    client = OpenSearch(
        hosts = [{
            'host': host, 
            'port': '443'
        }],
        http_auth = auth, 
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection
        )
        
    search_string = event['search_string']

    query = {
        'size' : 15,
        'query' : {
            'query_string' :{
                'default_field' : 'first_name',
                'query': search_string
            }
        }
    }
    
    candidates_list = []

    index_name = 'professors'
    response = client.search(body = query, index = index_name)
    if response['hits']['total']['value'] > 0:
        for cur_dict in response['hits']['hits']:
            print(cur_dict)
            id = cur_dict["_id"]
            score = cur_dict["_score"]
            index_type = 'professors'
            candidates_list.append([score, id, index_type])
            
    candidates_list.sort(key=lambda x:x[0], reverse=True)


    responses = []
    professors_table = dynamodb.Table('professors-db')

    for i in range(min(15, len(candidates_list))):
        new_record = {}
        _id = candidates_list[i][1]
        _type = candidates_list[i][2]
        if _type == 'professors':
            table = professors_table
            q = {'professor_id': _id}
            response = table.get_item(Key=q)["Item"]
            cur_response = {
                "professor_id": response["professor_id"],
                "first_name": response["first_name"],
                "last_name": response["last_name"]
            }
            responses.append(cur_response)

    return {
        'statusCode': 200,
        'body': responses
    }