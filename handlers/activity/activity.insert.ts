import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { Static, Type } from "@sinclair/typebox"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isoDate } from "../../helper";

const InsertActivityReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    created_at: Type.String(),
    updated_at: Type.String(),
    id: Type.Number(),
    title: Type.String(),
    email: Type.String({ format: "email" }),
  })
});

const ErrorActivityReply = Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) })

const InsertBodyActivity = Type.Object({
  title: Type.String(),
  email: Type.String({ format: "email" })
});

export const InsertActivitySchema = {
  schema: {
    body: InsertBodyActivity,
    response: {
      200: InsertActivityReply,
      400: Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) }),
      500: Type.Object({ status: Type.String(), message: Type.String(), data: Type.Object({}) })
    }
  }
}

export type InsertActivityType = Static<typeof InsertActivityReply> | Static<typeof ErrorActivityReply>;
export type InsertActivityBodyType = Static<typeof InsertBodyActivity>;

// type PrismaClientType = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

const insertActivityHandler = (app: FastifyInstance) => async (req: FastifyRequest<{ Body: InsertActivityBodyType }>, reply: FastifyReply) => {
  try {
    const activity = await app.prisma.activities.create({ data: { ...req.body, created_at: isoDate(), updated_at: isoDate() } });
    reply.code(200)
      .type("application/json; charset=utf-8")
      .send({ status: "Success", message: "Success", data: activity });
  } catch (error) {
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
      reply.code(500)
        .type("application/json; charset=utf-8")
        .send({ status: "Error", message: "Database error", data: {} });
      return;
    }
    console.log(error);
    reply.code(500)
        .type("application/json; charset=utf-8")
        .send({ status: "Error", message: "Unknown Error", data: {} });
  }
}

export default insertActivityHandler;