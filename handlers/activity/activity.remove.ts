import { PrismaClientValidationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const ActivityReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) });

export const ActivityRemoveSchema = {
  schema: {
    response: {
      200: ActivityReply,
      204: ActivityReply,
      500: ActivityReply
    }
  }
}

export type RemoveActivityReplyType = Static<typeof ActivityReply>;

const removeActivityHandler = (app: FastifyInstance) => async (req: FastifyRequest<{ Params: { group_id: string } }>, reply: FastifyReply) => {
  try {
    await app.prisma.activities.delete({ where: { id: parseInt(req.params.group_id) } });
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: {} });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.meta && "cause" in error.meta && /does not exist.$/.test(error.meta.cause as string)) {
        reply.code(404)
          .type("application/json; charset=utf-8")
          .send({ status: "Not Found", message: `Activity with ID ${req.params.group_id} Not Found`, data: {} });
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

export default removeActivityHandler;