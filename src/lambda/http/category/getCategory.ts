import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { checkCategoryExists, getCategory } from "../../../businessLogic/Category";

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const categoryId = event.pathParameters.categoryId

    if(await checkCategoryExists(categoryId) !== 1){
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: `Category does not exist for ${categoryId}`
        }
    }

    const category = await getCategory(categoryId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            item: category[0]
        })
    }
}