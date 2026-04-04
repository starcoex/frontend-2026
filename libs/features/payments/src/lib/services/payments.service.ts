import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_PAYMENT,
  GET_PAYMENTS,
  GET_PAYMENT_CANCELLATION,
  CREATE_PAYMENT,
  COMPLETE_PAYMENT,
  CANCEL_PAYMENT,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IPaymentsService,
  GetPaymentInput,
  GetPaymentsInput,
  GetCancellationInput,
  CreatePaymentInput,
  CompletePaymentInput,
  CancelPaymentInput,
  GetPaymentOutput,
  GetPaymentsOutput,
  GetCancellationOutput,
  CreatePaymentOutput,
  CompletePaymentOutput,
  CancelPaymentOutput,
} from '../types';

export class PaymentsService implements IPaymentsService {
  constructor(private client: ApolloClient) {}

  // ============================================================
  // 공통 헬퍼
  // ============================================================

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ============================================================
  // Queries
  // ============================================================

  async getPayment(
    input: GetPaymentInput
  ): Promise<ApiResponse<GetPaymentOutput>> {
    const res = await this.query<{ payment: GetPaymentOutput }>(GET_PAYMENT, {
      input,
    });
    if (res.success && res.data?.payment) {
      return { success: true, data: res.data.payment };
    }
    return res as unknown as ApiResponse<GetPaymentOutput>;
  }

  async getPayments(
    input?: GetPaymentsInput
  ): Promise<ApiResponse<GetPaymentsOutput>> {
    const res = await this.query<{ payments: GetPaymentsOutput }>(
      GET_PAYMENTS,
      { input }
    );
    if (res.success && res.data?.payments) {
      return { success: true, data: res.data.payments };
    }
    return res as unknown as ApiResponse<GetPaymentsOutput>;
  }

  async getPaymentCancellation(
    input: GetCancellationInput
  ): Promise<ApiResponse<GetCancellationOutput>> {
    const res = await this.query<{
      paymentCancellation: GetCancellationOutput;
    }>(GET_PAYMENT_CANCELLATION, { input });
    if (res.success && res.data?.paymentCancellation) {
      return { success: true, data: res.data.paymentCancellation };
    }
    return res as unknown as ApiResponse<GetCancellationOutput>;
  }

  // ============================================================
  // Mutations
  // ============================================================

  async createPayment(
    input: CreatePaymentInput
  ): Promise<ApiResponse<CreatePaymentOutput>> {
    const res = await this.mutate<{ createPayment: CreatePaymentOutput }>(
      CREATE_PAYMENT,
      { input }
    );
    if (res.success && res.data?.createPayment) {
      return { success: true, data: res.data.createPayment };
    }
    return res as unknown as ApiResponse<CreatePaymentOutput>;
  }

  async completePayment(
    input: CompletePaymentInput
  ): Promise<ApiResponse<CompletePaymentOutput>> {
    const res = await this.mutate<{ completePayment: CompletePaymentOutput }>(
      COMPLETE_PAYMENT,
      { input }
    );
    if (res.success && res.data?.completePayment) {
      return { success: true, data: res.data.completePayment };
    }
    return res as unknown as ApiResponse<CompletePaymentOutput>;
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<ApiResponse<CancelPaymentOutput>> {
    const res = await this.mutate<{ cancelPayment: CancelPaymentOutput }>(
      CANCEL_PAYMENT,
      { input }
    );
    if (res.success && res.data?.cancelPayment) {
      return { success: true, data: res.data.cancelPayment };
    }
    return res as unknown as ApiResponse<CancelPaymentOutput>;
  }
}
