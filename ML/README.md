# Machine Learning

* In this project we have also provided functionality of similar documents.
* To achieve this we trained and tested five different models for generating sentence encodings. All of these models used some variant of transformers which is the current State of the art for generating embeddings. 
    * Universal Sentence Encoder 
    * MP Net (General Use cases)
    * MP Net (Semantic Search)
    * DistilBert (Semantic Search)
    * MiniLM (General Use cases)

* We used StackOverflow data to train and test our model. After trying out all the listed models we found out that Universal Sentence Encoder gave best results for our use case. 
* After generating sentence embeddings we used cosine similarity to find the k-most similar documents from the entire corpus.

*****************************
![image1](https://github.com/aniketbote/bubble/blob/master/ML/all-MiniLM-L6-v2.PNG)
************************
![image2](https://github.com/aniketbote/bubble/blob/master/ML/all-mpnet-base-v2.PNG)
**********************
![image3](https://github.com/aniketbote/bubble/blob/master/ML/multi-qa-distilbert-cos-v1.PNG)
*****************
![image4](https://github.com/aniketbote/bubble/blob/master/ML/multi-qa-mpnet-base-dot-v1.PNG)
*****************************
![image5](https://github.com/aniketbote/bubble/blob/master/ML/use_projection.PNG)