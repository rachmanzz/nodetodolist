import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import insertActivityHandler, { InsertActivityBodyType, InsertActivitySchema, InsertActivityType } from './handlers/activity/activity.insert';
import listActivityHandler, { ActivityReplyListType, ActivitySchema } from './handlers/activity/activity.list';
import getActivityHandler, { ActivityOneSchema, ActivityReplyType } from './handlers/activity/activity.one';
import removeActivityHandler, {ActivityRemoveSchema, RemoveActivityReplyType } from './handlers/activity/activity.remove';
import getUpdateActivityHandler, { UpdateActivityBodyType, UpdateActivityReplyType, UpdateActivitySchema } from './handlers/activity/activity.update';
import insertTodoItemHandler, { InsertBodyTodoItemRequestType, InsertTodoItemReplyType, InsertTodoItemSchema } from './handlers/todo/todo.insert';
import getListTodoItemHandler, { ListTodoItemReplyType, ListTodoItemSchema } from './handlers/todo/todo.list';
import getOneTodoItemHandler, { TodoItemReplyType, TodoItemSchema } from './handlers/todo/todo.one';
import removeTodoItemHandler, { RemoveTodoItemReplyType, RemoveTodoItemSchema } from './handlers/todo/todo.remove';
import updateTodoItemHandler, { UpdateBodyTodoItemRequestType, UpdateTodoItemReplyType, UpdateTodoItemSchema } from './handlers/todo/todo.update';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt).withTypeProvider<TypeBoxTypeProvider>();
  app.post<{Body: InsertActivityBodyType, Reply: InsertActivityType}>('/activity-groups',InsertActivitySchema, insertActivityHandler(app));
  app.get<{Reply: ActivityReplyListType}>('/activity-groups', ActivitySchema, listActivityHandler(app));
  app.get<{Reply: ActivityReplyType, Params: {group_id: string}}>('/activity-groups/:group_id',ActivityOneSchema, getActivityHandler(app));
  app.patch<{Params: {group_id: string}, Body: UpdateActivityBodyType, Reply: UpdateActivityReplyType}>('/activity-groups/:group_id', UpdateActivitySchema, getUpdateActivityHandler(app));
  app.delete<{Reply: RemoveActivityReplyType, Params: {group_id: string}}>('/activity-groups/:group_id', ActivityRemoveSchema, removeActivityHandler(app));

  // todo
  app.post<{Body: InsertBodyTodoItemRequestType, Reply: InsertTodoItemReplyType}>('/todo-items', InsertTodoItemSchema, insertTodoItemHandler(app));
  app.get<{Reply: ListTodoItemReplyType, Querystring: {activity_group_id?: string}}>('/todo-items', ListTodoItemSchema, getListTodoItemHandler(app));
  app.get<{Params: {todo_id: string}, Reply: TodoItemReplyType}>('/todo-items/:todo_id', TodoItemSchema, getOneTodoItemHandler(app));
  app.patch<{Params: {todo_id: string}, Body: UpdateBodyTodoItemRequestType, Reply: UpdateTodoItemReplyType}>('/todo-items/:todo_id', UpdateTodoItemSchema, updateTodoItemHandler(app));
  app.delete<{Params: {todo_id: string}, Reply: RemoveTodoItemReplyType}>('/todo-items/:todo_id', RemoveTodoItemSchema, removeTodoItemHandler(app));
  return app;
}