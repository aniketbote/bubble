
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import uuid
import random
import datetime


# In[2]:


answers_df = pd.read_csv("Answer_Id.csv")
questions_df = pd.read_csv("questionIDs.csv")
#answers_df.drop(["List of comment_id"], axis=1, inplace=True)
#questions_df.drop(["List of comment_id"], axis=1, inplace=True)


# In[3]:


answers_df.head()


# In[4]:


questions_df.head()


# In[5]:


answers_df_len = answers_df.shape[0]
questions_df_len = questions_df.shape[0]
print(answers_df_len, questions_df_len)


# In[6]:


def generate_text():
    with open('lord_of_ther_rings.txt') as lotr:
        lines_temp = lotr.readlines()
        ans = []
        for line in lines_temp:
            if len(line)>10:
                sentences = line.split(".")
                for sentence in sentences:
                    if len(sentence)>5:
                        ans.append(sentence[:])
    return ans
lines = generate_text()
print(len(lines))


# In[7]:


question_ids_list = questions_df['question_id'].tolist()
answer_ids_list = answers_df['answer_id'].tolist()


# In[8]:


print(type(question_ids_list), type(answer_ids_list))


# In[9]:


comments_df_dict = {
    "commentID": [],
    "comment" : [],
    "timestamp": []
}
comments_series_for_questions = []
for question_id in question_ids_list:
    num_comments = random.randint(1, 10)
    comment_list_cur_question = []
    for i in range(num_comments):
        comment_id = "".join(str(uuid.uuid1()).split('-'))
        comment_list_cur_question.append(comment_id)
        comment = ""
        for j in range(4):
            sentence_num = random.randint(0,len(lines)-1)
            comment = comment+lines[sentence_num][:]
        timestamp = str(datetime.datetime.now())
        comments_df_dict['commentID'].append(comment_id)
        comments_df_dict['comment'].append(comment)
        comments_df_dict['timestamp'].append(timestamp)
    comments_series_for_questions.append('-'.join(comment_list_cur_question))
questions_df['comment_id'] = pd.Series(comments_series_for_questions)
print(questions_df.tail(5))


# In[10]:


questions_df.to_csv('questionIDs.csv', index=False)


# In[11]:


comments_series_for_answers = []
for answer_id in answer_ids_list:
    num_comments = random.randint(1, 10)
    comment_list_cur_answer = []
    for i in range(num_comments):
        comment_id = "".join(str(uuid.uuid1()).split('-'))
        comment_list_cur_answer.append(comment_id)
        comment = ""
        for j in range(4):
            sentence_num = random.randint(0,len(lines)-1)
            comment = comment+lines[sentence_num][:]
        timestamp = str(datetime.datetime.now())
        comments_df_dict['commentID'].append(comment_id)
        comments_df_dict['comment'].append(comment)
        comments_df_dict['timestamp'].append(timestamp)
    comments_series_for_answers.append('-'.join(comment_list_cur_answer))
answers_df['comment_id'] = pd.Series(comments_series_for_answers)
print(answers_df.tail(5))


# In[12]:


answers_df.to_csv('Answer_Id.csv', index=False)


# In[13]:


comments_df = pd.DataFrame(comments_df_dict)
comments_df.to_csv('commentsIDs.csv', index=False)

