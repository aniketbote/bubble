import boto3
import time
import requests
import logging
import json

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    
    dynamodb = boto3.resource("dynamodb")
    reverse_mapping_table = dynamodb.Table("profile-data-collection-db")
    user_activity_table = dynamodb.Table("user-activity-db")
    
    questions = []
    answers = []
    blogs = []
    comments_answer = []
    comments_question = []
    comments_blog = []
    posted_reviews = []
    
    query = {'user_id': event['user_id']}
    user_activity_details = user_activity_table.get_item(Key=query)['Item']
    
    #get questions - questions:[{question_id, question_title,question_deleted,question_timestamp}]}, 
    questions_table = dynamodb.Table("questions-db")
    questions_created_list = user_activity_details["questions_created"]
    print("Questions created list: ", questions_created_list)
    for question_id in questions_created_list:
        q_query = {'question_id': question_id}
        print(question_id)
        question_details = questions_table.get_item(Key=q_query)["Item"]
        cur_dict = {}
        cur_dict["question_id"] = question_id
        cur_dict["question_title"] = question_details["question_title"]
        cur_dict["question_deleted"] = question_details["deleted"]
        cur_dict["question_timestamp"] = question_details["timestamp"]
        questions.append(cur_dict)
        
    #get answers: answers: [{answer_id, question_id, title,answer_deleted,answer_timestamp}]} 
    answers_table = dynamodb.Table('answers-db')
    answers_created_list = user_activity_details["answers_created"]
    
    for answer_id in answers_created_list:
        a_query = {"answer_id": answer_id}
        answer_details = answers_table.get_item(Key=a_query)["Item"]
        cur_dict = {}
        
        cur_dict["answer_id"] = answer_id
        
        query = {"id" : answer_id}
        q_id = reverse_mapping_table.get_item(Key=query)["Item"]["question_id"]
        q_query = {'question_id': q_id}
        question_details = questions_table.get_item(Key=q_query)["Item"]
        
        cur_dict["question_id"] = q_id
        cur_dict["title"] = question_details["question_title"]
        cur_dict["answer_deleted"]=answer_details["deleted"]
        cur_dict["answer_timestamp"] = answer_details["timestamp"]
        answers.append(cur_dict)
        
    
    #get blogs: blogs: [{blog_id, blog_title,blog_deleted,blog_timestamp}]} 
    blogs_table = dynamodb.Table('blogs-db')
    blogs_created_list = user_activity_details["blogs_created"]
    for blog_id in blogs_created_list:
        blog_query = {"blog_id": blog_id}
        blog_details = blogs_table.get_item(Key=blog_query)["Item"]
        cur_dict = {}
        cur_dict["blog_id"] = blog_id
        cur_dict["blog_title"] = blog_details['blog_title']
        cur_dict['blog_deleted'] = blog_details['deleted']
        cur_dict['blog_timestamp'] = blog_details['timestamp']
        blogs.append(cur_dict)
        
    
    #get comments_answers: [{question_id,question_title,comment_timestamp}] (if comment id deleted then don’t send)
    #get comments_question: [{question_id,question_title,comment_timestamp}] (if comment id deleted then don’t send)
    #get comments_blog:  Comments_blog: [{blog_id,blog_title,comment_timestamp}]
    comments_table = dynamodb.Table("comments-db")
    comments_created_list = list(user_activity_details["comments_created"])
    for comment_id in comments_created_list:
        comment_query = {"comment_id":comment_id}
        comment_details = comments_table.get_item(Key=comment_query)["Item"]
        
        cur_dict = {}
        cur_dict["comment_timestamp"] = comment_details["timestamp"]
        
        comment_reverse_mapping_details = reverse_mapping_table.get_item(Key={'id': comment_id})["Item"]
        if comment_reverse_mapping_details["type"] == "question_comment":
            cur_dict["question_id"] = comment_reverse_mapping_details["question_id"]
            cur_dict["question_title"] = questions_table.get_item(Key={"question_id": cur_dict["question_id"]})["Item"]["question_title"]
            comments_question.append(cur_dict)
        elif comment_reverse_mapping_details["type"] == "answer_comment":
            answer_id = comment_reverse_mapping_details["answer_id"]
            question_id = reverse_mapping_table.get_item(Key={'id': answer_id})["Item"]["question_id"]
            cur_dict["question_id"] = question_id
            cur_dict["question_title"] = questions_table.get_item(Key={"question_id": cur_dict["question_id"]})["Item"]["question_title"]
            comments_answer.append(cur_dict)
        elif comment_reverse_mapping_details["type"]=="blog_comment":
            blog_id = comment_reverse_mapping_details["blog_id"]
            cur_dict["blog_id"] = blog_id
            cur_dict["blog_title"] = blogs_table.get_item(Key={'id': blog_id})["Item"]["blog_title"]
            comments_blog.append(cur_dict)
    
    #get posted_reviews: Posted_reviews: [review_id,professor_id,professor_name,timestamp, deleted]
    reviews_table = dynamodb.Table("professor-reviews-db")
    professors_table = dynamodb.Table('professors-db')
    review_ids = user_activity_details["reviews_created"]
    for review_id in review_ids:
        cur_dict = {}
        
        review_details = reviews_table.get_item(Key={'review_id':review_id})["Item"]
        cur_dict["review_id"] = review_id
        cur_dict['professor_id'] = review_details["professor_id"]
        professors_details = professors_table.get_item(Key={'professor_id': cur_dict["professor_id"]})["Item"]
        cur_dict['professor_name'] = professors_details["first_name"] + " " + professors_details["last_name"]
        cur_dict["timestamp"] = review_details["timestamp"]
        cur_dict['deleted'] = review_details['deleted']
        posted_reviews.append(cur_dict)
        
    response = {
        'questions':questions,
        'answers':answers,
        'blogs': blogs,
        'comments_answer': comments_answer,
        'comments_question':comments_question,
        'comments_blog': comments_blog,
        'posted_reviews': posted_reviews
    } 
    # TODO implement
    return response
