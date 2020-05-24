import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { CreateCategory } from "../../../requests/category/CreateCategory";
import { createCategory } from "../../../businessLogic/Category";

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const request: CreateCategory = JSON.parse(event.body)

    const category = await createCategory(request)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            category
        })
    }
} 