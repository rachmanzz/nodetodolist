import app from "./app";
import prismaPlugin from "./plugins/prisma";
import formbody from "@fastify/formbody";

const server = app({
  logger: {
    level: "info",
    transport: {
      target: 'pino-pretty'
    }
  }
});

server.register(formbody, { parser: str => {
  // remove all space and new line to validate JSON
  // this is not best way to validate JSON, but this fast way for now
  const strNoSpace = str.replace(/\n/g, "").replace(/\s+/g, "");
  return /^{.*}$/.test(strNoSpace) ? JSON.parse(str) : {}
} });
server.register(prismaPlugin);
server.setErrorHandler((error, _, reply) => {
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
const port  = process.env.PORT && parseInt(process.env.PORT) || 3030;
server.listen({ port: port, host: '0.0.0.0' }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.log(`listen on port 3030`);
});