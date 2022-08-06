import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios, { AxiosResponse } from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set

// url to download certificate
const jwksUrl = 'https://dev-dbm4c03k.us.auth0.com/.well-known/jwks.json';
// const origCert = `-----BEGIN CERTIFICATE-----
// MIIDDTCCAfWgAwIBAgIJQUWNK+AjFBsNMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
// BAMTGWRldi1kYm00YzAzay51cy5hdXRoMC5jb20wHhcNMjIwNzMxMDQyNDAyWhcN
// MzYwNDA4MDQyNDAyWjAkMSIwIAYDVQQDExlkZXYtZGJtNGMwM2sudXMuYXV0aDAu
// Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv8ZxKgxkosbz+zyc
// pU7FWjGbfOBXmfUDW6KCIlp03gLuspZlaxXx75QTCkywauRJQg68YGmz2YLHCarC
// MC7o5JWfXPgk9UvRS2Tp6sxjEhMBl9soSBREs/saq70bbcOKqAoN8e7sZvZb/Eb+
// zl6pDHfonlepDQ17BRwTzPkOd6II6Ou7UZnNiv5NnkeOusLzE6MyxZTQ+yLPpGXP
// 6umSoGmNQR8fHoEBOkx+5Wh8wL59UKDvutXKS5tDHw7JqOhvVlcz/JDwx2bCIG4w
// yYXm3zHaC7GmZomzD7JmJ6+9PuRKhiUMAjdjjMFlvrWjdN61RYawB90mYMkh5Zok
// V1s0lQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBStuOdoli8V
// W4qLtRXmE4mLgNwKnjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
// AFrAF+I6o7OtIlamrlEdv2v+TGdj+HpcVg9WUu2yM5jgBu8TjNwNf8ENdV6vOsn2
// zqIgVZVjTw4J06GEGcdZv1uatYkYg8v2CRU5i/pG5EE0RO9sFoJC3a7Z+C2mjoSu
// 1HrmhbsPy+JeSVnzkxVu4j1MXcf9gQcaMSbF3XEIwOfyCG56ChqQ7VrSEzu7Upwm
// 6fvZlqKwWrOXV1kVzANq4IWA6GfWNsybFAvP/u44XbGdldTaBzbW7fzvmcqkAIxT
// eTcqEubA2Pkl7NoCPrt155F2NEAre8ICkX80nIQbIJ0meRFzS3W8zqRZj9h+ygN3
// XHGR2ytuzZprHKvnxUoZFJo=
// -----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
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
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
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

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
  try{
    logger.info('Getting certificate')
    const jwk: AxiosResponse = await Axios.get(jwksUrl);
    const signKey = jwk['data']['keys'][0]['x5c'][0];
    const cert = `-----BEGIN CERTIFICATE-----\n${signKey}\n-----END CERTIFICATE-----`
    
    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  }catch(e){
    logger.error('Authentication Failure',e)
  }
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
