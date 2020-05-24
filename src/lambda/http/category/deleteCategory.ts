import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../../../utils";
import { checkCategoryExists, deleteCategory } from "../../../businessLogic/Category";


export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const categoryId = event.pathParameters.categoryId 
    

    if(await checkCategoryExists(categoryId) !== 1){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: 'Category Not found'
        }
    }

    await deleteCategory(categoryId)
    

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: 'Category deletion successfull'

    }
}