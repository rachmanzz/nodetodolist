import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isoDate } from "../../helper";

const InsertBodyTodoItemRequest = Type.Object({
  activity_group_id: Type.Number(),
  title: Type.String()
});

const InsertTodoItemReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    id: Type.Number(),
    title: Type.String(),
    activity_group_id: Type.Number(),
    is_active: Type.Boolean(),
    priority: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String()
  })
});

const ErrorTodoItemReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) });

export const InsertTodoItemSchema = {
  schema: {
    body: InsertBodyTodoItemRequest,
    response: {
      201: InsertTodoItemReply,
      400: ErrorTodoItemReply,
      500: ErrorTodoItemReply
    }
  }
}




export type InsertBodyTodoItemRequestType = Static<typeof InsertBodyTodoItemRequest>;
export type InsertTodoItemReplyType = Static<typeof InsertTodoItemReply>;

const insertTodoItemHandler = (app: FastifyInstance) => async (req: FastifyRequest<{ Body: InsertBodyTodoItemRequestType }>, reply: FastifyReply) => {
  const { activity_group_id, ...props } = req.body;
  try {
    const todoValue = { is_active: true, ...props, activity: { connect: { id: activity_group_id } }, priority: "very-high", created_at: isoDate(), updated_at: isoDate() };
    const todo = await app.prisma.todos.create({ data: todoValue });
    reply.code(201)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: todo });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.meta && "cause" in error.meta && /^No 'Activities' record/.test(error.meta.cause as string)) {
        reply.code(404)
          .type("application/json; charset=utf-8")
          .send({ status: "Not Found", message: "activity_group_id cannot be null", data: {} });
        return;
      }
    }
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
      reply.code(500)
        .type("application/json; charset=utf-8")
        .send({ status: "Error", message: "Database error", data: {} });
      return;
    }
    reply.code(500)
      .type("application/json; charset=utf-8")
      .send({ status: "Error", message: "Unknown Error", data: {} });
  }
}

export default insertTodoItemHandler;