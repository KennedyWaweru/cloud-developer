import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

//const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}

    // async getTodoById(todoId: string): Promise<TodoItem> {
    //     logger.info(``)
    // }

    async storeTodo(todoItem: TodoItem): Promise<void> {
        logger.info(`Creating a new todo for user ${todoItem.userId}`)

        await this.docClient.put(
            {
                TableName: this.todosTable,
                Item: todoItem,
            }
        ).promise();

    }

    async getUserTodos(userId: string): Promise<TodoItem[]> {
        logger.info(`Getting a User's todo, user: ${userId}`);
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise();
        const items = result.Items 
        return items as TodoItem[]

    }

    async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info(`Updating todo with todoId: ${todoId}`);
        const { name, dueDate, done } = todoUpdate;
        try{
           await this.docClient.update({
                TableName: this.todosTable,
                Key: {userId: userId, todoId: todoId },
                UpdateExpression: 'set #n = :val_n, #dt = :val_dt, #dn = :val_dn',
                    ExpressionAttributeValues: {
                        ":val_n": name,
                        ":val_dt": dueDate,
                        ":val_dn": done
                    },
                    ExpressionAttributeNames: {
                        "#n": "name",
                        "#dt": "dueDate",
                        "#dn": "done"
                    },
                    ReturnValues: "UPDATED_NEW"
            }).promise();
            logger.info('TODO item Updated successfully')
            return todoUpdate;
        }catch(e){
            logger.info(`Error updating todo item ${( e as Error ).message }`)
        }
        

    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {userId: userId, todoId: todoId},
        }).promise();
        return 'deleted'
    }
}