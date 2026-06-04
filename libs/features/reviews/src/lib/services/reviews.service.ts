import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  GeneralScopeListResult,
  GetGeneralScopesInput,
} from '../types';
import type {
  IReviewsService,
  Review,
  ReviewListResult,
  ReviewSummaryStats,
  GeneralReviewScope,
  ReviewTargetType,
  GetReviewsInput,
  CreateReviewInput,
  CreateReviewOutput,
  VoteReviewInput,
  VoteReviewOutput,
  CreateCommentInput,
  CreateCommentOutput,
  ChangeReviewStatusInput,
  ChangeReviewStatusOutput,
  DeleteReviewInput,
  DeleteReviewOutput,
  BulkDeleteReviewsInput,
  BulkDeleteReviewsOutput,
  ChangeCommentStatusInput,
  ChangeCommentStatusOutput,
  CreateGeneralReviewScopeInput,
  UpdateGeneralReviewScopeInput,
} from '../types';
import {
  GET_REVIEW_BY_ID,
  GET_REVIEWS,
  GET_REVIEW_SUMMARY_STATS,
  REVIEWS_BY_TARGET,
  MY_REVIEWS,
  GET_GENERAL_REVIEW_SCOPE_BY_ID,
  GET_GENERAL_REVIEW_SCOPES,
  CREATE_REVIEW,
  VOTE_REVIEW,
  CREATE_REVIEW_COMMENT,
  CHANGE_REVIEW_STATUS,
  DELETE_REVIEW,
  BULK_DELETE_REVIEWS,
  CHANGE_COMMENT_STATUS,
  CREATE_GENERAL_REVIEW_SCOPE,
  UPDATE_GENERAL_REVIEW_SCOPE,
  DELETE_GENERAL_REVIEW_SCOPE,
  GET_GENERAL_SCOPES,
  GET_GENERAL_SCOPE,
} from '@starcoex-frontend/graphql';

export class ReviewsService implements IReviewsService {
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

  async getReviewById(id: number): Promise<ApiResponse<Review>> {
    const res = await this.query<{ getReviewById: Review }>(GET_REVIEW_BY_ID, {
      id,
    });
    if (res.success && res.data?.getReviewById) {
      return { success: true, data: res.data.getReviewById };
    }
    return res as unknown as ApiResponse<Review>;
  }

  async getReviews(
    input: GetReviewsInput
  ): Promise<ApiResponse<ReviewListResult>> {
    const res = await this.query<{ getReviews: ReviewListResult }>(
      GET_REVIEWS,
      { input }
    );
    if (res.success && res.data?.getReviews) {
      return { success: true, data: res.data.getReviews };
    }
    return res as unknown as ApiResponse<ReviewListResult>;
  }

  async getReviewSummaryStats(): Promise<ApiResponse<ReviewSummaryStats>> {
    const res = await this.query<{
      getReviewSummaryStats: ReviewSummaryStats;
    }>(GET_REVIEW_SUMMARY_STATS);
    if (res.success && res.data?.getReviewSummaryStats) {
      return { success: true, data: res.data.getReviewSummaryStats };
    }
    return res as unknown as ApiResponse<ReviewSummaryStats>;
  }

  async reviewsByTarget(
    targetType: ReviewTargetType,
    targetId: number
  ): Promise<ApiResponse<Review[]>> {
    const res = await this.query<{ reviewsByTarget: Review[] }>(
      REVIEWS_BY_TARGET,
      { targetType, targetId }
    );
    if (res.success && res.data?.reviewsByTarget) {
      return { success: true, data: res.data.reviewsByTarget };
    }
    return res as unknown as ApiResponse<Review[]>;
  }

  async myReviews(limit?: number): Promise<ApiResponse<Review[]>> {
    const res = await this.query<{ myReviewsNew: Review[] }>(MY_REVIEWS, {
      limit,
    });
    if (res.success && res.data?.myReviewsNew) {
      return { success: true, data: res.data.myReviewsNew };
    }
    return res as unknown as ApiResponse<Review[]>;
  }

  async getGeneralReviewScopeById(
    id: number
  ): Promise<ApiResponse<GeneralReviewScope>> {
    const res = await this.query<{
      getGeneralReviewScopeById: GeneralReviewScope;
    }>(GET_GENERAL_REVIEW_SCOPE_BY_ID, { id });
    if (res.success && res.data?.getGeneralReviewScopeById) {
      return { success: true, data: res.data.getGeneralReviewScopeById };
    }
    return res as unknown as ApiResponse<GeneralReviewScope>;
  }

  async getGeneralReviewScopes(
    isActive?: boolean
  ): Promise<ApiResponse<GeneralReviewScope[]>> {
    const res = await this.query<{
      generalReviewScopes: GeneralReviewScope[];
    }>(GET_GENERAL_REVIEW_SCOPES, { isActive });
    if (res.success && res.data?.generalReviewScopes) {
      return { success: true, data: res.data.generalReviewScopes };
    }
    return res as unknown as ApiResponse<GeneralReviewScope[]>;
  }

  // ✅ 신규: generalScopes (페이지네이션 포함 목록)
  async getGeneralScopes(
    input?: GetGeneralScopesInput
  ): Promise<ApiResponse<GeneralScopeListResult>> {
    const res = await this.query<{
      generalScopes: GeneralScopeListResult;
    }>(GET_GENERAL_SCOPES, { input });
    if (res.success && res.data?.generalScopes) {
      return { success: true, data: res.data.generalScopes };
    }
    return res as unknown as ApiResponse<GeneralScopeListResult>;
  }

  // ✅ 신규: generalScope (단건 조회 — 별칭)
  async getGeneralScope(id: number): Promise<ApiResponse<GeneralReviewScope>> {
    const res = await this.query<{
      generalScope: GeneralReviewScope;
    }>(GET_GENERAL_SCOPE, { id });
    if (res.success && res.data?.generalScope) {
      return { success: true, data: res.data.generalScope };
    }
    return res as unknown as ApiResponse<GeneralReviewScope>;
  }

  // ===== Mutations =====

  async createReview(
    input: CreateReviewInput
  ): Promise<ApiResponse<CreateReviewOutput>> {
    const res = await this.mutate<{ createReviewNew: CreateReviewOutput }>(
      CREATE_REVIEW,
      { input }
    );
    if (res.success && res.data?.createReviewNew) {
      return { success: true, data: res.data.createReviewNew };
    }
    return res as unknown as ApiResponse<CreateReviewOutput>;
  }

  async voteReview(
    input: VoteReviewInput
  ): Promise<ApiResponse<VoteReviewOutput>> {
    const res = await this.mutate<{ voteReview: VoteReviewOutput }>(
      VOTE_REVIEW,
      { input }
    );
    if (res.success && res.data?.voteReview) {
      return { success: true, data: res.data.voteReview };
    }
    return res as unknown as ApiResponse<VoteReviewOutput>;
  }

  async createReviewComment(
    input: CreateCommentInput
  ): Promise<ApiResponse<CreateCommentOutput>> {
    const res = await this.mutate<{
      createReviewComment: CreateCommentOutput;
    }>(CREATE_REVIEW_COMMENT, { input });
    if (res.success && res.data?.createReviewComment) {
      return { success: true, data: res.data.createReviewComment };
    }
    return res as unknown as ApiResponse<CreateCommentOutput>;
  }

  async changeReviewStatus(
    input: ChangeReviewStatusInput
  ): Promise<ApiResponse<ChangeReviewStatusOutput>> {
    const res = await this.mutate<{
      changeReviewStatus: ChangeReviewStatusOutput;
    }>(CHANGE_REVIEW_STATUS, { input });
    if (res.success && res.data?.changeReviewStatus) {
      return { success: true, data: res.data.changeReviewStatus };
    }
    return res as unknown as ApiResponse<ChangeReviewStatusOutput>;
  }

  async deleteReview(
    input: DeleteReviewInput
  ): Promise<ApiResponse<DeleteReviewOutput>> {
    const res = await this.mutate<{ deleteReview: DeleteReviewOutput }>(
      DELETE_REVIEW,
      { input }
    );
    if (res.success && res.data?.deleteReview) {
      return { success: true, data: res.data.deleteReview };
    }
    return res as unknown as ApiResponse<DeleteReviewOutput>;
  }

  async bulkDeleteReviews(
    input: BulkDeleteReviewsInput
  ): Promise<ApiResponse<BulkDeleteReviewsOutput>> {
    const res = await this.mutate<{
      bulkDeleteReviews: BulkDeleteReviewsOutput;
    }>(BULK_DELETE_REVIEWS, { input });
    if (res.success && res.data?.bulkDeleteReviews) {
      return { success: true, data: res.data.bulkDeleteReviews };
    }
    return res as unknown as ApiResponse<BulkDeleteReviewsOutput>;
  }

  async changeCommentStatus(
    input: ChangeCommentStatusInput
  ): Promise<ApiResponse<ChangeCommentStatusOutput>> {
    const res = await this.mutate<{
      changeCommentStatus: ChangeCommentStatusOutput;
    }>(CHANGE_COMMENT_STATUS, { input });
    if (res.success && res.data?.changeCommentStatus) {
      return { success: true, data: res.data.changeCommentStatus };
    }
    return res as unknown as ApiResponse<ChangeCommentStatusOutput>;
  }

  async createGeneralReviewScope(
    input: CreateGeneralReviewScopeInput
  ): Promise<ApiResponse<GeneralReviewScope>> {
    const res = await this.mutate<{
      createGeneralReviewScope: GeneralReviewScope;
    }>(CREATE_GENERAL_REVIEW_SCOPE, { input });
    if (res.success && res.data?.createGeneralReviewScope) {
      return { success: true, data: res.data.createGeneralReviewScope };
    }
    return res as unknown as ApiResponse<GeneralReviewScope>;
  }

  async updateGeneralReviewScope(
    input: UpdateGeneralReviewScopeInput
  ): Promise<ApiResponse<GeneralReviewScope>> {
    const res = await this.mutate<{
      updateGeneralReviewScope: GeneralReviewScope;
    }>(UPDATE_GENERAL_REVIEW_SCOPE, { input });
    if (res.success && res.data?.updateGeneralReviewScope) {
      return { success: true, data: res.data.updateGeneralReviewScope };
    }
    return res as unknown as ApiResponse<GeneralReviewScope>;
  }

  async deleteGeneralReviewScope(
    id: number
  ): Promise<ApiResponse<GeneralReviewScope>> {
    const res = await this.mutate<{
      deleteGeneralReviewScope: GeneralReviewScope;
    }>(DELETE_GENERAL_REVIEW_SCOPE, { id });
    if (res.success && res.data?.deleteGeneralReviewScope) {
      return { success: true, data: res.data.deleteGeneralReviewScope };
    }
    return res as unknown as ApiResponse<GeneralReviewScope>;
  }
}
