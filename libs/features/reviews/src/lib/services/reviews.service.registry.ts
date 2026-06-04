import type { ApolloClient } from '@apollo/client';
import { ReviewsService } from './reviews.service';
import { serviceRegistry } from './service-registry';

export const createReviewsService = (client: ApolloClient): ReviewsService =>
  new ReviewsService(client);

serviceRegistry.registerService<ReviewsService>(
  'reviews',
  (ctx: ApolloClient) => {
    return new ReviewsService(ctx);
  }
);

export const initReviewsService = (client: ApolloClient): ReviewsService => {
  return serviceRegistry.initializeService<ReviewsService>('reviews', client);
};

export const getReviewsService = (): ReviewsService => {
  return serviceRegistry.getService<ReviewsService>('reviews');
};
