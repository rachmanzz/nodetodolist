import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isoDate } from "../../helper";

const UpdateBodyTodoItemRequest = Type.Partial(Type.Object({
  title: Type.String(),
  is_active: Type.Boolean(),
  priority: Type.String()
}));

const UpdateTodoItemReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    id: Type.Number(),
    title: Type.String(),
    activity_group_id: Type.Number(),
    is_active: Type.String(),
    priority: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String()
  })
});

const ErrorTodoItemReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) });

export const UpdateTodoItemSchema = {
  schema: {
    body: UpdateBodyTodoItemRequest,
    response: {
      200: UpdateTodoItemReply,
      404: ErrorTodoItemReply,
      500: ErrorTodoItemReply
    }
  }
}




export type UpdateBodyTodoItemRequestType = Static<typeof UpdateBodyTodoItemRequest>;
export type UpdateTodoItemReplyType = Static<typeof UpdateTodoItemReply> | Static<typeof ErrorTodoItemReply>;

const updateTodoItemHandler = (app: FastifyInstance) => async (req: FastifyRequest<{ Body: UpdateBodyTodoItemRequestType, Params: {todo_id: string} }>, reply: FastifyReply) => {
  try {
    const {is_active, ...todo} = await app.prisma.todos.update({ data: {...req.body}, where: {id: +req.params.todo_id} });
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: {...todo, is_active: is_active ? "1" : "0"} });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.meta && "cause" in error.meta && /^Record to update not found/.test(error.meta.cause as string)) {
        reply.code(404)
        .type("application/json; charset=utf-8")
        .send({ status: "Not Found", message: `Todo with ID ${req.params.todo_id} Not Found`, data: {} });
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

export default updateTodoItemHandler;