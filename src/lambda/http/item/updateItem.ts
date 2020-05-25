import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UpdateItem } from "../../../requests/item/UpdateItem";
import { getUserId } from "../../../utils";
import { updateItem, checkItemExists } from "../../../businessLogic/Item";

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const item: UpdateItem = JSON.parse(event.body)
    const userId = getUserId(event)
    const imageId = event.pathParameters.imageId

    if( await checkItemExists(imageId) !== 1 ){
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: `Item does not exists for the given ${imageId}`
        }
    }

    const result = await updateItem(item, userId, imageId)


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

