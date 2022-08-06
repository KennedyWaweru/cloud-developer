import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    const userId = getUserId(event);

    try {
      const deletedTodo = await deleteTodo(todoId,userId)
      return {
        statusCode: 204,
        body: JSON.stringify(
          {item: deletedTodo}
        )
      }
    }catch(e){
      return {
        statusCode: 500,
        body: JSON.stringify(
          {msg: (e as Error).message}
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
