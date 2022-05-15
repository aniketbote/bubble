import json
import boto3
import requests
import base64
from io import BytesIO
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    # TODO implement
    client = boto3.client('sqs')
    lambda_client = boto3.client('lambda')
    QueueUrl = '***********'
    response = client.receive_message(
        QueueUrl=QueueUrl,
        MaxNumberOfMessages=1,
        MessageAttributeNames=[
            'All'
        ],
        VisibilityTimeout=0,
        WaitTimeSeconds=0
        )
    logger.debug(f"[USER][RESPONSE] {response}")
    keys = list(response.keys())
    if 'Messages' not in keys:
        return {
            'statusCode': 200,
            'body': json.dumps('No messages')
        }
        
    data = json.loads(response['Messages'][0]['Body'])
    receipt_handle = response['Messages'][0]['ReceiptHandle']
    
    logger.debug(f"[USER][DATA] {data}")
    logger.debug(f"[USER][RECEIPT_HANDLE] {receipt_handle}")

    try:
        image_data = requests.get(data['image_urls']).content
        num_labels = moderate_image(image_data)
        if num_labels > 0:
            msg = dict()
            msg['user_id'] = data['user_id']
            msg[data['pkey']] = data[data['pkey']]
            response = lambda_client.invoke(FunctionName="delete",
                                InvocationType='RequestResponse',
                                Payload=json.dumps(msg))
            response = json.loads(response['Payload'].read().decode())
            logger.debug(f"[USER][LAMBDA] {response}")
            if response['status'] == 400:
                raise Exception("Lambda Failed")
        else:
            logger.debug(f"[USER][LAMBDA] No explicit content found")
    except Exception as e:
        logger.debug(f"[USER][EXCEPTION] {e}")
    
    client.delete_message(
        QueueUrl=QueueUrl,
        ReceiptHandle=receipt_handle
    )
            
        
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }

def moderate_image(img_bytes):

    client=boto3.client('rekognition')

    response = client.detect_moderation_labels(Image={
        'Bytes': img_bytes})
    logger.debug(f"[USER][REKOGNITION] {response}")

    # print('Detected labels for ' + photo)    
    # for label in response['ModerationLabels']:
    #     print (label['Name'] + ' : ' + str(label['Confidence']))
    #     print (label['ParentName'])
    return len(response['ModerationLabels'])