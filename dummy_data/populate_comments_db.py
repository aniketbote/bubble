import boto3
import pandas as pd

comments_df = pd.read_csv("commentsIDs.csv")
columns = comments_df.columns
#print(columns)

commentIDs_list = comments_df['commentID'].tolist()
comment_list = comments_df['comment'].tolist()
timestamp_list = comments_df['timestamp'].tolist()

#print(len(commentIDs_list), len(comment_list), len(timestamp_list))

client = boto3.resource(
    service_name='dynamodb',
    region_name='us-east-1',
    aws_access_key_id="*",
    aws_secret_access_key="*"
)

comments_table = client.Table('comments-db')

with comments_table.batch_writer() as batch:
    for i in range(comments_df.shape[0]):
        new_record = {}
        new_record['comments_id'] = commentIDs_list[i]
        new_record['comment'] = comment_list[i]
        new_record['timestamp'] = timestamp_list[i]
        batch.put_item(Item=new_record)
        