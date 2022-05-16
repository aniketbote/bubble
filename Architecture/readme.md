# Architecture

![Architecture](https://github.com/aniketbote/bubble/blob/master/Architecture/Bubble_Architecture.png)

* Cognito is used to add user sign-up, sign-in, and access control to the website.
* Also, it manages client sessions and validates the JWT of client requests at API Gateway.
* When user sends request, API Gateway captures the request and directs the request to the correct lambda.
* In the Architecture diagram, We have shown a lambda stack, which is basically group of lambdas in the backend. 
* Everytime User post on a platform. The data will be stored in database using transaction to maintain the consistency of the database.
* Tensorflow model is stored in a Elastic Block Storage which is used in EC2 to generates sentence embaddings.
* For the search query we have used OpenSearch which will query the required unique ids which will used to fetch data from DynamoDB.
* Every time a review is posted, sentiment will analyze using AWS comprehend.
* All the content posted on a platform will go through explicit content check using AWS rekognition and if any explicit content is found post/data would be deleted. We used SQS to make a system Asynchronous.
