import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createSignedUrl } from "../../../businessLogic/Item";

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const imageId: string = event.pathParameters.imageId
    const uploadUrl = createSignedUrl(imageId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}