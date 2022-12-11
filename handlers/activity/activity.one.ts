import { PrismaClientValidationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const ActivityReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    created_at: Type.String(),
    updated_at: Type.String(),
    deleted_at: Type.Null({default: null}),
    id: Type.Number(),
    title: Type.String(),
    email: Type.String({ format: "email" }),
  })
});

const ErrorActivityReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) });

export const ActivityOneSchema = {
  schema: {
    response: {
      200: ActivityReply,
      404: ErrorActivityReply,
      500: ErrorActivityReply
    }
  }
}

export type ActivityReplyType = Static<typeof ActivityReply> | Static<typeof ErrorActivityReply>;

const getActivityHandler = (app: FastifyInstance) => async (req: FastifyRequest<{Params: {group_id: string}}>, reply: FastifyReply) => {
  try {
    const activity = await app.prisma.activities.findFirstOrThrow({where: {id: parseInt(req.params.group_id)}});
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: activity});
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.name === "NotFoundError") {
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

export default getActivityHandler;