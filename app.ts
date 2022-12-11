import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import insertActivityHandler, { InsertActivityBodyType, InsertActivitySchema, InsertActivityType } from './handlers/activity/activity.insert';
import listActivityHandler, { ActivityReplyListType, ActivitySchema } from './handlers/activity/activity.list';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt).withTypeProvider<TypeBoxTypeProvider>();
  app.post<{Body: InsertActivityBodyType, Reply: InsertActivityType}>('/activity-groups',InsertActivitySchema, insertActivityHandler(app));
  app.get<{Reply: ActivityReplyListType}>('/activity-groups', ActivitySchema, listActivityHandler(app));
  app.get('/activity-groups/:group_id', () => {});
  app.delete('/activity-groups/:group_id', () => {});
  return app;
}