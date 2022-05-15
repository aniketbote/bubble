import time
from decimal import Decimal
import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource("dynamodb")
    user_activity_table = dynamodb.Table("user-activity-db")
    #test_table = dynamodb.Table("test1")
    user_activity_list = (user_activity_table.scan())["Items"]
    with user_activity_table.batch_writer() as batch:    
        for cur_dict in user_activity_list:
            questions_voted = {}
            answers_voted = {}
            blogs_voted = {}
            for question_id in cur_dict["up_voted_questions"]:
                questions_voted[question_id] = 1
            for question_id in cur_dict["down_voted_questions"]:
                questions_voted[question_id] = -1
                
            for answer_id in cur_dict["up_voted_answers"]:
                answers_voted[answer_id] = 1
            for answer_id in cur_dict["down_voted_answers"]:
                answers_voted[answer_id] = -1
                
            #i = 1000000
            for blog_id in cur_dict["up_voted_blogs"]:
                blogs_voted[blog_id] = 1   
            new_record = {
                'user_id': cur_dict["user_id"],
                'questions_voted' : questions_voted,
                "answers_voted": answers_voted,
                "blogs_voted": blogs_voted,
                'questions_created': cur_dict["questions_created"],
                'blogs_created': cur_dict["blogs_created"],
                'answers_created': cur_dict["answers_created"],
                'comments_created': cur_dict["comments_created"]
            }
            #i+=1
            batch.put_item(Item=new_record)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
