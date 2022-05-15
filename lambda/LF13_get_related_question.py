import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('related-questions-db')

def lambda_handler(event, context):
    '''
    A function to return question details based on question id
    '''
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'question_id': event['question_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    #return response
    related_questions_ids = response["related_questions_ids"]
    print("Related question ids: ", related_questions_ids)
    #return related_questions_ids
    questions_table = dynamodb.Table('questions-db')
    related_questions_response = []
    for id in related_questions_ids:
        print(response)
        try:
            response = questions_table.get_item(Key={"question_id": id})["Item"]
        except:
            continue
        print(response)
        accepted_answer = response["accepted_id"]
        print(type(accepted_answer), accepted_answer)
        new_record = {
            "question_id": response["question_id"],
            "question_title": response["question_title"],
            "vote_count": int(response["upvotes"])-int(response["downvotes"]),
            "accepted_answer": accepted_answer
        }
        related_questions_response.append(new_record)
    
    #print(related_questions_response)
    return related_questions_response