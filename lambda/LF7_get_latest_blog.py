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
host = 'opensearch url'
port = 5000
master_user = '****'
master_password = '****'
auth = (master_user, master_password)

def lambda_handler(event, context):
    # TODO implement
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    start = int(event["start"])
    
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
    
    
    size = 10
    query = {
            "from": start*10 ,
            "size": size,
            "sort":
                {
                    "timestamp": {
                        "order": "desc"
                    
                    }
                }
            }
            
    candidates_list = []
            
    index_name = 'blogs'
    response = client.search(body = query, index = index_name)
    if response['hits']['total']['value'] > 0:
        for cur_dict in response['hits']['hits']:
            print(cur_dict)
            id = cur_dict["_id"]
            timestamp = cur_dict["_source"]["timestamp"]
            index_type = 'blogs'
            candidates_list.append([timestamp, id, index_type])
    print(candidates_list)
    candidates_list.sort(key=lambda x:x[0], reverse=True)
    
    responses = []
    blogs_table = dynamodb.Table('blogs-db')
    
    if "comment_ids" in response.keys():
                comment_count = len(response["comment_ids"])
    
    for i in range(min(10, len(candidates_list))):
        new_record = {}
        _id = candidates_list[i][1]
        _type = candidates_list[i][2]
        if _type == 'blogs':
            table = blogs_table
            q = {'blog_id': _id}
            response = table.get_item(Key=q)["Item"]
            read_time = max(1, response["read_time"])
            comment_count = 0
            if "comment_ids" in response.keys():
                comment_count = len(response["comment_ids"])
            cur_response = {
                "blog_id": response["blog_id"],
                "blog_title": response["blog_title"],
                "user_id": response["user_id"],
                "short_blog_description": response["blog_short_description"],
                "vote_count": response["upvotes"],
                "comment_count": comment_count,
                "timestamp": response["timestamp"],
                "read_time": read_time 
            }
            responses.append(cur_response)

    return {
        'statusCode': 200,
        'body': responses
    }