import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const RemoveTodoItemReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({})
});


export const RemoveTodoItemSchema = {
  schema: {
    response: {
      200: RemoveTodoItemReply,
      400: RemoveTodoItemReply,
      500: RemoveTodoItemReply
    }
  }
}

export type RemoveTodoItemReplyType = Static<typeof RemoveTodoItemReply>;

const removeTodoItemHandler = (app: FastifyInstance) => async (req: FastifyRequest<{Params: {todo_id: string}}>, reply: FastifyReply) => {
  try {
    await app.prisma.todos.delete({where: {id: +req.params.todo_id}});
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: {}});
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.meta && "cause" in error.meta && /^Record to delete does not exist/.test(error.meta.cause as string)) {
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

export default removeTodoItemHandler;