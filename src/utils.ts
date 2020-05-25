import { APIGatewayProxyEvent } from "aws-lambda";
import { decode } from "jsonwebtoken";
import { JwtPayload } from "./auth/JwtPayload";

export function getUserId(event: APIGatewayProxyEvent): string{
    
    const authorization = event.headers.Authorization
    const token = authorization.split(' ')[1]
    return (decode(token) as JwtPayload).sub
    
}