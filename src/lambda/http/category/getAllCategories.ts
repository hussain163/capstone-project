import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { getAllCategories } from "../../../businessLogic/Category";

export const handler: APIGatewayProxyHandler =  async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const categories = await getAllCategories();

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
          categories
        })
      }

}