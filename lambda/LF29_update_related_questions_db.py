import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time

def calc_dist(vec1, vec2):
    dist = 0.0
    #print(len(vec1))
    dist = 0
    for i in range(len(vec1)):
        dist+= (vec1[i]-vec2[i])**2
    dist = dist/len(vec1)
    return dist
    

def lambda_handler(event, context):
    
    dynamodb = boto3.resource("dynamodb")
    question_table = dynamodb.Table("questions-db")
    questions_list = (question_table.scan())["Items"]
    question_ids_list = []
    question_math_vectors_list = []
    is_question_deleted_list = [] 
    for cur_dict in questions_list:
        question_ids_list.append(cur_dict["question_id"])
        question_math_vectors_list.append(cur_dict["math_vector"])
        is_question_deleted_list.append(cur_dict["deleted"])
        
    put_table = dynamodb.Table('related-questions-db')
    with put_table.batch_writer() as batch:
        for i in range(len(question_ids_list)):
            if is_question_deleted_list[i]==True:
                continue
            possible_candidates = []
            for j in range(len(question_ids_list)):
                if is_question_deleted_list[j]==True or i == j:
                    continue
                dist = calc_dist(question_math_vectors_list[i], question_math_vectors_list[j])
                possible_candidates.append([dist, question_ids_list[j]])
            possible_candidates.sort(key=lambda x: x[0])
            related_questions = []
            for j in range(10):
                related_questions.append(possible_candidates[j][1][:])
            new_record = {
                "question_id" : question_ids_list[i],
                "related_questions_ids": related_questions
            }
            batch.put_item(Item=new_record)
            time.sleep(1)
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully updated related-questions-db')
    }