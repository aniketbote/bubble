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
                'default_field' : 'question_title',
                'query': search_string
            }
        }
    }

    candidates_list = []

    index_name = 'questions'
    response = client.search(body = query, index = index_name)
    if response['hits']['total']['value'] > 0:
        for cur_dict in response['hits']['hits']:
            print(cur_dict)
            id = cur_dict["_id"]
            score = cur_dict["_score"]
            index_type = 'questions'
            candidates_list.append([score, id, index_type])


    candidates_list.sort(key=lambda x:x[0], reverse=True)


    responses = []
    questions_table = dynamodb.Table('questions-db')

    for i in range(min(15, len(candidates_list))):
        new_record = {}
        _id = candidates_list[i][1]
        _type = candidates_list[i][2]
        if _type == 'questions':
            table = questions_table
            q = {'question_id': _id}
            response = table.get_item(Key=q)["Item"]
            comment_count = 0
            if "comment_ids" in response.keys():
                comment_count = len(response["comment_ids"])
            cur_response = {
                "question_id": response["question_id"],
                "question_title": response["question_title"],
                "username": response["username"],
                "tags": response["tags"],
                "vote_count": response["upvotes"] - response["downvotes"],
                "answer_count": len(response["answer_ids"]),
                "comment_count": comment_count,
                "timestamp": response["timestamp"]
            }
            responses.append(cur_response)

    return {
        'statusCode': 200,
        'body': responses
    }