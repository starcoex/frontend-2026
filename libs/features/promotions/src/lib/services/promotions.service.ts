import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  IPromotionsService,
  Promotion,
  PromotionListResult,
  PromotionSummaryStats,
  CreatePromotionInput,
  UpdatePromotionInput,
  DeletePromotionInput,
  DeletePromotionOutput,
  BulkDeletePromotionsInput,
  BulkDeletePromotionsOutput,
  ChangePromotionStatusInput,
  ChangePromotionStatusOutput,
  GetPromotionsInput,
} from '../types';
import {
  GET_PROMOTION_BY_ID,
  FIND_PROMOTION_BY_ID,
  GET_PROMOTIONS,
  GET_PROMOTION_SUMMARY_STATS,
  CREATE_PROMOTION,
  UPDATE_PROMOTION,
  DELETE_PROMOTION,
  BULK_DELETE_PROMOTIONS,
  CHANGE_PROMOTION_STATUS,
} from '@starcoex-frontend/graphql';

export class PromotionsService implements IPromotionsService {
  constructor(private client: ApolloClient) {}

  // 공통 query helper
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
      } as any);

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
        return createErrorResponse(apiErrorFromGraphQLErrors([gqlError]));
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse(apiError);
    }
  }

  // 공통 mutation helper
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
        return createErrorResponse(apiErrorFromGraphQLErrors([gqlError]));
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse(apiError);
    }
  }

  // ===== Queries =====

  async getPromotionById(id: number): Promise<ApiResponse<Promotion>> {
    const res = await this.query<{ getPromotionById: Promotion }>(
      GET_PROMOTION_BY_ID,
      { id }
    );
    if (res.success && res.data?.getPromotionById) {
      return { success: true, data: res.data.getPromotionById };
    }
    return res as unknown as ApiResponse<Promotion>;
  }

  async findPromotionById(id: number): Promise<ApiResponse<Promotion>> {
    const res = await this.query<{ findPromotionById: Promotion }>(
      FIND_PROMOTION_BY_ID,
      { id }
    );
    if (res.success && res.data?.findPromotionById) {
      return { success: true, data: res.data.findPromotionById };
    }
    return res as unknown as ApiResponse<Promotion>;
  }

  async getPromotions(
    input: GetPromotionsInput
  ): Promise<ApiResponse<PromotionListResult>> {
    const res = await this.query<{ getPromotions: PromotionListResult }>(
      GET_PROMOTIONS,
      { input }
    );
    if (res.success && res.data?.getPromotions) {
      return { success: true, data: res.data.getPromotions };
    }
    return res as unknown as ApiResponse<PromotionListResult>;
  }

  async getPromotionSummaryStats(): Promise<
    ApiResponse<PromotionSummaryStats>
  > {
    const res = await this.query<{
      getPromotionSummaryStats: PromotionSummaryStats;
    }>(GET_PROMOTION_SUMMARY_STATS);
    if (res.success && res.data?.getPromotionSummaryStats) {
      return { success: true, data: res.data.getPromotionSummaryStats };
    }
    return res as unknown as ApiResponse<PromotionSummaryStats>;
  }

  // ===== Mutations =====

  async createPromotion(
    input: CreatePromotionInput
  ): Promise<ApiResponse<Promotion>> {
    const res = await this.mutate<{ createPromotionNew: Promotion }>(
      CREATE_PROMOTION,
      { input }
    );
    if (res.success && res.data?.createPromotionNew) {
      return { success: true, data: res.data.createPromotionNew };
    }
    return res as unknown as ApiResponse<Promotion>;
  }

  async updatePromotion(
    input: UpdatePromotionInput
  ): Promise<ApiResponse<Promotion>> {
    const res = await this.mutate<{ updatePromotionNew: Promotion }>(
      UPDATE_PROMOTION,
      { input }
    );
    if (res.success && res.data?.updatePromotionNew) {
      return { success: true, data: res.data.updatePromotionNew };
    }
    return res as unknown as ApiResponse<Promotion>;
  }

  async deletePromotion(
    input: DeletePromotionInput
  ): Promise<ApiResponse<DeletePromotionOutput>> {
    const res = await this.mutate<{ deletePromotion: DeletePromotionOutput }>(
      DELETE_PROMOTION,
      { input }
    );
    if (res.success && res.data?.deletePromotion) {
      return { success: true, data: res.data.deletePromotion };
    }
    return res as unknown as ApiResponse<DeletePromotionOutput>;
  }

  async bulkDeletePromotions(
    input: BulkDeletePromotionsInput
  ): Promise<ApiResponse<BulkDeletePromotionsOutput>> {
    const res = await this.mutate<{
      bulkDeletePromotions: BulkDeletePromotionsOutput;
    }>(BULK_DELETE_PROMOTIONS, { input });
    if (res.success && res.data?.bulkDeletePromotions) {
      return { success: true, data: res.data.bulkDeletePromotions };
    }
    return res as unknown as ApiResponse<BulkDeletePromotionsOutput>;
  }

  async changePromotionStatus(
    input: ChangePromotionStatusInput
  ): Promise<ApiResponse<ChangePromotionStatusOutput>> {
    const res = await this.mutate<{
      changePromotionStatus: ChangePromotionStatusOutput;
    }>(CHANGE_PROMOTION_STATUS, { input });
    if (res.success && res.data?.changePromotionStatus) {
      return { success: true, data: res.data.changePromotionStatus };
    }
    return res as unknown as ApiResponse<ChangePromotionStatusOutput>;
  }
}
