import app from "./app";

const server = app({
  logger: {
    level: "info",
    transport: {
      target: 'pino-pretty'
    }
  }
});

server.listen({ port: 3000 }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
});