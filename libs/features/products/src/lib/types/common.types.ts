import { GraphQLFormattedError } from 'graphql/error';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  message?: string;
  graphQLErrors?: GraphQLFormattedError[]; // 정확한 타입 사용
}
