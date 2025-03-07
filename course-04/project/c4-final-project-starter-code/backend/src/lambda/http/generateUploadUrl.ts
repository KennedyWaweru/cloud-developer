import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/attachmentUtils'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    try{
      const presignedUrl = createAttachmentPresignedUrl(todoId);
      return {
        statusCode: 201,
        body: JSON.stringify(
          { uploadUrl: presignedUrl }
        )
      }
    }catch(e){
      return {
        statusCode: 500,
        body: JSON.stringify(
          {msg: (e as Error).message }
        )
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
