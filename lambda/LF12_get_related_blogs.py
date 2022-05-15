import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('related-blogs-db')

def lambda_handler(event, context):
    '''
    A function to return related blogs 
    '''
    
    logger.debug(f"[USER][EVENT] {event}")
    logger.debug(f"[USER][CONTEXT] {context}")
    q = {'blog_id': event['blog_id']}
    logger.debug(f"[USER][QUERY] {q}")
    response = table.get_item(Key=q)['Item']
    #return response
    related_blogs_ids = response["related_blogs_ids"]
    #print("Related blogs ids: ", related_blogs_ids)
    #return related_blogs_ids
    blogs_table = dynamodb.Table('blogs-db')
    related_blogs_response = []
    for id in related_blogs_ids:
        #print(response)
        try:
            response = blogs_table.get_item(Key={"blog_id": id})["Item"]
        except:
            continue
        if response["deleted"]==True:
            continue
        new_record = {
            "blog_id": response["blog_id"],
            "blog_title": response["blog_title"],
            "vote_count": response["upvotes"]
        }
        related_blogs_response.append(new_record)
    
    #print(related_blogs_response)
    return related_blogs_response