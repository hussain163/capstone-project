import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UpdateCategory } from "../../../requests/category/UpdateCategory";
import { checkCategoryExists, updateCategory } from "../../../businessLogic/Category";

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const category: UpdateCategory = JSON.parse(event.body)
    const categoryId = event.pathParameters.categoryId

    if( await checkCategoryExists(categoryId) !== 1 ){
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: `Category does not exist for the given ${categoryId}`
        }
    }

    const result = await updateCategory(category, categoryId)


    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
                result
        })
    }
    
}

