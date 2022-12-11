import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import insertActivityHandler, { InsertActivityBodyType, InsertActivitySchema, InsertActivityType } from './handlers/activity/activity.insert';
import listActivityHandler, { ActivityReplyListType, ActivitySchema } from './handlers/activity/activity.list';
import getActivityHandler, { ActivityOneSchema, ActivityReplyType } from './handlers/activity/activity.one';
import removeActivityHandler, {ActivityRemoveSchema, RemoveActivityReplyType } from './handlers/activity/activity.remove';

export default function build (opt: FastifyServerOptions) {
  const app: FastifyInstance = Fastify(opt).withTypeProvider<TypeBoxTypeProvider>();
  app.post<{Body: InsertActivityBodyType, Reply: InsertActivityType}>('/activity-groups',InsertActivitySchema, insertActivityHandler(app));
  app.get<{Reply: ActivityReplyListType}>('/activity-groups', ActivitySchema, listActivityHandler(app));
  app.get<{Reply: ActivityReplyType, Params: {group_id: string}}>('/activity-groups/:group_id',ActivityOneSchema, getActivityHandler(app));
  app.delete<{Reply: RemoveActivityReplyType, Params: {group_id: string}}>('/activity-groups/:group_id', ActivityRemoveSchema, removeActivityHandler(app));
  return app;
}