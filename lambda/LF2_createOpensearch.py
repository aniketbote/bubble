import boto3
import time
import requests
from requests_aws4auth import AWS4Auth
from datetime import datetime
import json
from opensearchpy import OpenSearch, RequestsHttpConnection
from aws_requests_auth.aws_auth import AWSRequestsAuth

#region = 'us-east-1'
#service='es'
host = '*****'
#credentials = boto3.Session().get_credentials()
#awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
master_user = '****'
master_password = '*****'


#os = OpenSearch(
#    hosts = [{'host': host, 'port':443}],
#    http_auth=awsauth,
#    use_ssl=True,
#    verify_certs=True,
#    connection_class= RequestsHttpConnection
#)


def lambda_handler(event, context):
    
    dynamodb = boto3.resource("dynamodb")
    
    #blogs index created
    
    blogs_table = dynamodb.Table("blogs-db")
    blogs_list = (blogs_table.scan())["Items"]
    index = '/blogs/Blogs'
    url = host+'/'+index
    for cur_blog_dict in blogs_list:
        new_record = {}
        new_record["blog_id"] = cur_blog_dict["blog_id"]
        new_record["timestamp"] = int(time.time()*10000)
        new_record["blog_title"] = cur_blog_dict["blog_title"]
        url = host+index+ "/" + new_record["blog_id"] + "/"
        r = requests.post(url, auth=(master_user, master_password), json=new_record)
        time.sleep(0.1)
    #question index created
    questions_table = dynamodb.Table("questions-db")
    questions_list = (questions_table.scan())["Items"]
    index = '/questions/Questions'
    url = host+'/'+index
    for cur_question_dict in questions_list:
        new_record = {}
        new_record["question_id"] = cur_question_dict["question_id"]
        new_record["timestamp"] = int(time.time()*10000)
        new_record["question_title"] = cur_question_dict["question_title"]
        url = host+index+ "/" + new_record["question_id"] + "/"
        r = requests.post(url, auth=(master_user, master_password), json=new_record)
        time.sleep(0.1)
    #Professor Index Created
    professors_table = dynamodb.Table("professors-db")
    professors_list = (professors_table.scan())["Items"]
    index = '/professors/Professors'
    url = host+'/'+index
    for cur_professor_dict in professors_list:
        new_record = {}
        new_record["professor_id"] = cur_professor_dict["professor_id"]
        new_record["first_name"] = cur_professor_dict["first_name"]
        new_record["last_name"] = cur_professor_dict["last_name"]
        url = host+index+ "/" + new_record["professor_id"] + "/"
        r = requests.post(url, auth=(master_user, master_password), json=new_record)
        time.sleep(0.1)
        
    return {
        'statusCode': 200,
        'body': json.dumps('Inserted into bubble-domain')
    }
