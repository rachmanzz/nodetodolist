import { PrismaClientValidationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const ActivityReplyList = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Array(Type.Object({
    created_at: Type.String(),
    updated_at: Type.String(),
    deleted_at: Type.Null({default: null}),
    id: Type.Number(),
    title: Type.String(),
    email: Type.String({ format: "email" }),
  }))
});


export const ActivitySchema = {
  schema: {
    response: {
      200: ActivityReplyList,
      400: ActivityReplyList, // empty array is fine
      500: ActivityReplyList // empty array is fine
    }
  }
}

export type ActivityReplyListType = Static<typeof ActivityReplyList>;

const listActivityHandler = (app: FastifyInstance) => async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const activities = await app.prisma.activities.findMany();
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: activities.map( v => v.deleted_at ? v : ({...v, deleted_at: null}) ) });
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

export default listActivityHandler;