import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const TodoItemReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    id: Type.Number(),
    title: Type.String(),
    activity_group_id: Type.Number(),
    is_active: Type.String(),
    priority: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String(),
    deleted_at: Type.Null({default: null})
  })
});

const ErrorTodoItemReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) });

export const TodoItemSchema = {
  schema: {
    response: {
      200: TodoItemReply,
      400: ErrorTodoItemReply,
      500: ErrorTodoItemReply
    }
  }
}

export type TodoItemReplyType = Static<typeof TodoItemReply> | Static<typeof ErrorTodoItemReply>;

const getOneTodoItemHandler = (app: FastifyInstance) => async (req: FastifyRequest<{Params: {todo_id: string}}>, reply: FastifyReply) => {
  try {
    const {is_active, ...todo} = await app.prisma.todos.findFirstOrThrow({where: {id: +req.params.todo_id}});
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: {...todo, is_active: is_active ? "1": "0"} });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.name === "NotFoundError") {
        reply.code(404)
        .type("application/json; charset=utf-8")
        .send({ status: "Not Found", message: `Todo with ID ${req.params.todo_id} Not Found`, data: {} });
        return;
      }
    }
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

export default getOneTodoItemHandler;