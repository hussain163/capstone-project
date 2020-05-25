## Udacity Capstone

In this project we build a serverless application using AWS tech such as Lambda, API Gateway, DynamoDB etc.
The project has two main features:
1. The open feed page which displays different categories. We have different Lambda functions for the CRUD operations. These apis are now open, which can furthur be closed/restricted to a certain user only in the future scope.
2. We also have apis where an only authenticated users can add/update/delete their items. Each user has access to his/her items only. This is something similar to that of todo list.

Features:
1. We have CRUD operations for categories and items. Categories CRUD operations are open whereas Items CRUD operations needs to be authenticated.
2. We use an external service Auth0 for the authentication. We use JWT token and OAuth as the auth mechanism
3. We use ApiGateway, Lambda functions, DynamoDb, ElasticSearch instance, Cloudwatch, AWS XRAY etc from AWS.
4. We use serverless plugin too.

To run the project, first run npm install which will first install all the dependencies.
Then deploy using sls deploy -v

