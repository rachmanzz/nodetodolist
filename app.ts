import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import insertActivityHandler, { InsertActivityBodyType, InsertActivitySchema, InsertActivityType } from './handlers/activity/activity.insert';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt).withTypeProvider<TypeBoxTypeProvider>();
  app.post<{Body: InsertActivityBodyType, Reply: InsertActivityType}>('/activity-groups',InsertActivitySchema, insertActivityHandler(app));
  return app;
}