import { PrismaClientValidationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const UpdateActivityReply = Type.Object({
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

const UpdateBodyActivity = Type.Partial(Type.Object({
  title: Type.String(),
  email: Type.String({ format: "email" })
}));

export const UpdateActivitySchema = {
  body: UpdateBodyActivity,
  schema: {
    response: {
      200: UpdateActivityReply,
      404: ErrorActivityReply,
      500: ErrorActivityReply
    }
  }
}

export type UpdateActivityReplyType = Static<typeof UpdateActivityReply> | Static<typeof ErrorActivityReply>;
export type UpdateActivityBodyType = Static<typeof UpdateBodyActivity>;

const getUpdateActivityHandler = (app: FastifyInstance) => async (req: FastifyRequest<{Params: {group_id: string}, Body: UpdateActivityBodyType}>, reply: FastifyReply) => {
  try {
    const activity = await app.prisma.activities.update({where: {id: parseInt(req.params.group_id)}, data: req.body});
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: activity});
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.meta && "cause" in error.meta && /^Record to update not found/.test(error.meta.cause as string)) {
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

export default getUpdateActivityHandler;