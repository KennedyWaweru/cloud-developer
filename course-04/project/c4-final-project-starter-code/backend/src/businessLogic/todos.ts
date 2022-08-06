import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getStorageUrl } from './attachmentUtils';

import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess();
const logger = createLogger('todos');

export async function createTodo(userId: string, req: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4();
    const url = getStorageUrl(todoId);
    logger.info(`Create new ToDo : ${todoId} for user : ${userId}`);

    const todoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: url,
        ...req
    };

    await todoAccess.storeTodo(todoItem)
    return todoItem;
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info(`Fetching Todos for user with ID: ${userId}`);

    return await todoAccess.getUserTodos(userId);
}

export async function updateTodo(userId: string, todoId: string, req: UpdateTodoRequest): Promise<TodoUpdate>{
    logger.info(`Updating ToDo: ${todoId} for User: ${userId}`);
    return await todoAccess.updateTodo(userId, todoId, req)

}

export async function deleteTodo(todoId: string, userId: string): Promise<string> {
    logger.info(`Deleting ToDo with id: ${todoId} from User : ${userId}`);

    return await todoAccess.deleteTodo(todoId,userId);
    
}
