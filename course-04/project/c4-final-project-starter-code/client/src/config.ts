// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3dfuxvhgg0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-dbm4c03k.us.auth0.com',            // Auth0 domain
  clientId: 'nJdpzg8npPy29VlXG7rwcQkemcQMEftD',          // Auth0 client id
  //callbackUrl: 'http://localhost:3000/callback'
  callbackUrl: 'http://my-534465564748-bucket.s3-website.us-east-2.amazonaws.com/callback'
}
