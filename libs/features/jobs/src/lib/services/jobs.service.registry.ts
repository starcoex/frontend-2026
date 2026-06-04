import type { ApolloClient } from '@apollo/client';
import { JobsService } from './jobs.service';
import { serviceRegistry } from './service-registry';

export const createJobsService = (client: ApolloClient): JobsService =>
  new JobsService(client);

serviceRegistry.registerService<JobsService>(
  'jobs',
  (ctx: ApolloClient) => new JobsService(ctx)
);

export const initJobsService = (client: ApolloClient): JobsService =>
  serviceRegistry.initializeService<JobsService>('jobs', client);

export const getJobsService = (): JobsService =>
  serviceRegistry.getService<JobsService>('jobs');
