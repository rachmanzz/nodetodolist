import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import insertActivityHandler, { InsertActivitySchema, InsertActivityType } from './handlers/activity/activity.insert';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt).withTypeProvider<TypeBoxTypeProvider>();
  app.post<{Reply: InsertActivityType}>('/activity-groups', InsertActivitySchema, insertActivityHandler);
  return app;
}