import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { getUserId } from "../../../utils"
import { getAllItems } from "../../../businessLogic/Item"

export const handler: APIGatewayProxyHandler =  async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event)
    const items = await getAllItems(userId);

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
          items
        })
      }

}