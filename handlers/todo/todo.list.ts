import { Todos } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const ListTodoItemReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Array(Type.Object({
    id: Type.Number(),
    title: Type.String(),
    activity_group_id: Type.Number(),
    is_active: Type.String(),
    priority: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String(),
    deleted_at: Type.Null({default: null})
  }))
});

export const ListTodoItemSchema = {
  schema: {
    response: {
      200: ListTodoItemReply,
      400: ListTodoItemReply,
      500: ListTodoItemReply
    }
  }
}

export type ListTodoItemReplyType = Static<typeof ListTodoItemReply>;

const getListTodoItemHandler = (app: FastifyInstance) => async (req: FastifyRequest<{Querystring: {activity_group_id?: string}}>, reply: FastifyReply) => {
  try {
    const todolist = await (req.query.activity_group_id ? app.prisma.todos.findMany({where: {activity_group_id: +req.query.activity_group_id}}) : app.prisma.todos.findMany());
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: todolist.map( (v: Todos) => v.deleted_at ? v : ({...v, deleted_at: null, is_active: v.is_active ? "1" : "0"}) ) });
  } catch (error) {
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
      reply.code(500)
        .type("application/json; charset=utf-8")
        .send({ status: "Error", message: "Database error", data: [] });
      return;
    }
    reply.code(500)
        .type("application/json; charset=utf-8")
        .send({ status: "Error", message: "Unknown Error", data: [] });
  }
}

export default getListTodoItemHandler;