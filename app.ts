import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt);
  app.get('/', async function (request, reply) {
    return { hello: 'world' }
  })
  return app;
}