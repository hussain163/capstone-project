import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../../../utils";
import { checkItemExists, deleteItem } from "../../../businessLogic/Item";


export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event)
    const imageId = event.pathParameters.imageId 
    

    if(await checkItemExists(imageId) !== 1){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: 'Item Not found'
        }
    }

    await deleteItem(userId, imageId)
    

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: 'Item and image delete successfully'

    }
}