import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { decode, verify } from "jsonwebtoken";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";


const cert: string = ``

export const handler = async(event: CustomAuthorizerEvent):Promise<CustomAuthorizerResult> =>{

    try{
        const token = getTokenFromAuthHeader(event.authorizationToken)
        const jwtPayload = await verifyToken(token)
        console.log('User authenticated with payload: ', jwtPayload)
        return {
            principalId: jwtPayload.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }

    }catch(e){

        console.log('User not authenticated, error: ', e)

        return {
            principalId: 'userId',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }

    
}

async function verifyToken(token: string): Promise<JwtPayload>{

    const jwt: Jwt = decode(token) as Jwt
    console.log(jwt)
    if(!jwt){
        throw new Error(`Invalid jwt token, jwt: ${jwt}`)
    }
    
    var verifiedToken = verify(token, cert, { algorithms: ['RS256'] })
    console.log(verifiedToken)

    return verifiedToken as JwtPayload
}

function getTokenFromAuthHeader(authHeader: string){
    if(!authHeader){
        throw new Error('No authentication header');
    }
    if(!authHeader.toLocaleLowerCase().startsWith('bearer ')){
        throw new Error('Invalid auth header');   
    }
    return authHeader.split(' ')[1];
}