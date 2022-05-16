import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    
    dynamodb = boto3.resource("dynamodb")
    user_activity_table = dynamodb.Table("user-activity-db")
    user_details_table = dynamodb.Table("user-details-db")
    username = event["username"]
    user_id = event["user_id"]
    email = event["email"]
    with user_activity_table.batch_writer() as batch:
        new_record = {
            'user_id': user_id,
            'questions_voted':{},
            'answers_voted':{},
            'questions_created': [],
            'blogs_created': [],
            'answers_created': [],
            'comments_created': [],
            'blogs_voted': {}
        }
        print("user_activity_table")
        print(new_record)
        batch.put_item(Item=new_record)
        
    with user_details_table.batch_writer() as batch:
        new_record = {
            'user_id': user_id,
            'username' : username,
            'email': email,
        }
        print("user details table")
        print(new_record)
        batch.put_item(Item=new_record)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
