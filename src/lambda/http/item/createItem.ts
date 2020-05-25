import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../../../utils";
import { CreateItem } from "../../../requests/item/CreateItem";
import { createItem } from "../../../businessLogic/Item";

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event)
    const request: CreateItem = JSON.parse(event.body)

    const item = await createItem(request, userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            item
        })
    }
} 