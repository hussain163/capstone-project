import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { decode, verify } from "jsonwebtoken";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import Axios from 'axios'

const jwkToPem = require('jwk-to-pem');

// const cert: string = `-----BEGIN CERTIFICATE-----
// MIIC+TCCAeGgAwIBAgIJWi2TjgGhO/v8MA0GCSqGSIb3DQEBCwUAMBoxGDAWBgNV
// BAMTD2h1c3N1LmF1dGgwLmNvbTAeFw0yMDA1MDMxMTExMjBaFw0zNDAxMTAxMTEx
// MjBaMBoxGDAWBgNVBAMTD2h1c3N1LmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEB
// BQADggEPADCCAQoCggEBAMaAr4WuNiUdR5s5OR2G7e1/9SHs66Oy2zHGIYitxG1u
// lwHNX5BJHT2osubfB8NTGuoPIci6P1DvH+DgzwImOf4JgpLgMbKBMiuXOKBMMox4
// +JVJFS9Lf51iLVHw5JQRbUY+9CaLjnblWq9uYpCHrIU9vD/Tot/QrYlEXMiZsrvM
// +11aLA/2o6G1nDPQm93wux9S95BFb9TIu550gh9TgsNNhPhkwtxSYEcQ+Y7W4kxf
// oppv/ct3IGG/1uZLlHYZS8Oqn6JEODVS9EiOP8kNbKMM2PGgfuJzwZ4xrLYCPlpZ
// IBRAHoXaZ0Vwo5MMXYBd+rzSNYC1V6MESZTm/bJbJmsCAwEAAaNCMEAwDwYDVR0T
// AQH/BAUwAwEB/zAdBgNVHQ4EFgQUUN4R5Oa0li5ttOWRo2+XnTx6ejowDgYDVR0P
// AQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAKTs98Ym+OQk0+iFvXKUvLqp0W
// aVy7hdndxMVy/EU4jt0wr13Z/wk+8kxr2sBV2TVuz7FuDTnDMGiFd4zoE8ac4HLg
// 3y3BPnGEWwU6ektydGB5CQdX/CsqD1O5kaMVsWGdYbr9nDuK36AmpPtSftRD+0JM
// T46b5lmHQVZpAa8u/SQ6f3jEW1pOiVHOntlLNCa6cpWzxLS1UMhFyK9SGGjSxXms
// 8li82qfm64Nx7xzV6OJ7lE5Mqu6lzVd6lBTEG23W1X1VS66/IUmQq7hiL1ICPrdE
// 1AmWPO8YLK0WWJx51D42dOu4OGXB+cdjDIm/0r27udNyz9SkBiUYWA4PRMvm
// -----END CERTIFICATE-----`

const jwksUrl = 'https://hussu.auth0.com/.well-known/jwks.json'

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

    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    console.log(jwt)
    if(!jwt){
        throw new Error(`Invalid jwt token, jwt: ${jwt}`)
    }
    
    // Use the certificate to verify the token
    // var verifiedToken = verify(token, cert, { algorithms: ['RS256'] })
    
    
    // Use the url to fetch the certificate and verify the token
    const response = await Axios.get(jwksUrl)
    console.log("Response: ",response.data)
    var verifiedToken = verify(token, jwkToPem(response.data['keys'].find(key => key['kid'] === jwt['header']['kid']), {algorithms: ['RS256']}))
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