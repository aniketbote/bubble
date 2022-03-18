import boto3
import pandas as pd

comments_df = pd.read_csv("commentsIDs.csv")
comments_df.head(5)
columns = comments_df.columns
print(columns)

commentIDs_list = comments_df['commentID'].tolist()
comment_list = comments_df['comment'].tolist()
timestamp_list = comments_df['timestamp'].tolist()

print(len(commentIDs_list), len(comment_list), len(timestamp_list))

client = boto3.resource(
    service_name='dynamodb',
    region_name='us-east-1',
    aws_access_key_id="AKIA2DHJUBNXZOBNU6EF",
    aws_secret_access_key="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"
)

comments_table = client.Table('comments-db')

with comments_table.batch_writer() as batch:
    for i in range(comments_df.shape[0]):
        new_record = {}
        new_record['commentID'] = commentIDs_list[i]
        new_record['comment'] = comment_list[i]
        new_record['timestamp'] = timestamp_list[i]
        batch.put_item(Item=new_record)
        