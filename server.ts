import app from "./app";
import prismaPlugin from "./plugins/prisma";
import formbody from "@fastify/formbody";
import Fastify from 'fastify';

const server = app({
  logger: {
    level: "error",
    transport: {
      target: 'pino-pretty'
    }
  }
});

server.register(formbody, { parser: str => /^{.*}$/.test(str) ? JSON.parse(str) : {} });
server.register(prismaPlugin);
server.setErrorHandler((error, req, reply) => {
  if (error.validation && error.validation.length >= 1) {
    const validation = error.validation[0];

    const missing = Array.isArray(validation.params.missingProperty) && validation.params.missingProperty.join(", ") || validation.params.missingProperty;
    reply.code(400)
      .type("application/json; charset=utf-8")
      .send({ status: "Bad Request", message: `${missing} cannot be null`, data: {} });
    return;

  }
  // may need filter error type, but as documentation not spesific the error code, so I make it default error
  reply.code(500)
    .type("application/json; charset=utf-8")
    .send({ status: error.name, message: error.message, data: {} });
});

server.listen({ port: 3000 }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
});