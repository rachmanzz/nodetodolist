import { Static, Type } from "@sinclair/typebox"
import { FastifyReply, FastifyRequest } from "fastify";

export const InsertActivityReply = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    created_at: Type.String({ format: "date" }),
    updated_at: Type.String({ format: "date" }),
    id: Type.Number(),
    title: Type.String(),
    email: Type.String({ format: "email" })
  })
});

export const InsertActivitySchema = {
  schema: {
    response: {
      200: InsertActivityReply
    }
  }
}

export type InsertActivityType = Static<typeof InsertActivityReply>;


export default function insertActivityHandler(_: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    status: "Success", message: "Success", data: {
      created_at: (new Date()).toString(),
      updated_at: (new Date()).toString(),
      id: 1188,
      title: "test"
    }
  });
}