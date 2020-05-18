import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { checkItemExists, getItem } from "../../businessLogic/Item";

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const imageId = event.pathParameters.imageId

    if(await checkItemExists(imageId) !== 1){
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: `Item does not exist for ${imageId}`
        }
    }

    const items = getItem(imageId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            item: items[0]
        })
    }
}