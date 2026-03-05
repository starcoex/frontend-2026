import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_SUGGESTION,
  GET_SUGGESTIONS,
  GET_MY_SUGGESTIONS,
  GET_SUGGESTION_STATS,
  CREATE_SUGGESTION,
  UPDATE_SUGGESTION,
  UPDATE_SUGGESTION_STATUS,
  DELETE_SUGGESTION,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  ISuggestionsService,
  Suggestion,
  GetSuggestionsOutput,
  CreateSuggestionOutput,
  UpdateSuggestionOutput,
  GetSuggestionsInput,
  CreateSuggestionInput,
  UpdateSuggestionInput,
  UpdateSuggestionStatusInput,
} from '../types';

export class SuggestionsService implements ISuggestionsService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

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

  // ============================================================================
  // Queries
  // ============================================================================

  async getSuggestion(id: number): Promise<ApiResponse<Suggestion>> {
    const res = await this.query<{ suggestion: Suggestion }>(GET_SUGGESTION, {
      id,
    });
    if (res.success && res.data?.suggestion) {
      return { success: true, data: res.data.suggestion };
    }
    return res as unknown as ApiResponse<Suggestion>;
  }

  async getSuggestions(
    input?: GetSuggestionsInput
  ): Promise<ApiResponse<GetSuggestionsOutput>> {
    const res = await this.query<{ suggestions: GetSuggestionsOutput }>(
      GET_SUGGESTIONS,
      { input }
    );
    if (res.success && res.data?.suggestions) {
      return { success: true, data: res.data.suggestions };
    }
    return res as unknown as ApiResponse<GetSuggestionsOutput>;
  }

  async getMySuggestions(
    input?: GetSuggestionsInput
  ): Promise<ApiResponse<GetSuggestionsOutput>> {
    const res = await this.query<{ mySuggestions: GetSuggestionsOutput }>(
      GET_MY_SUGGESTIONS,
      { input }
    );
    if (res.success && res.data?.mySuggestions) {
      return { success: true, data: res.data.mySuggestions };
    }
    return res as unknown as ApiResponse<GetSuggestionsOutput>;
  }

  async getSuggestionStats(): Promise<ApiResponse<string>> {
    const res = await this.query<{ suggestionStats: string }>(
      GET_SUGGESTION_STATS
    );
    if (res.success && res.data?.suggestionStats) {
      return { success: true, data: res.data.suggestionStats };
    }
    return res as unknown as ApiResponse<string>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createSuggestion(
    input: CreateSuggestionInput
  ): Promise<ApiResponse<CreateSuggestionOutput>> {
    const res = await this.mutate<{ createSuggestion: CreateSuggestionOutput }>(
      CREATE_SUGGESTION,
      { input }
    );
    if (res.success && res.data?.createSuggestion) {
      return { success: true, data: res.data.createSuggestion };
    }
    return res as unknown as ApiResponse<CreateSuggestionOutput>;
  }

  async updateSuggestion(
    input: UpdateSuggestionInput
  ): Promise<ApiResponse<UpdateSuggestionOutput>> {
    const res = await this.mutate<{ updateSuggestion: UpdateSuggestionOutput }>(
      UPDATE_SUGGESTION,
      { input }
    );
    if (res.success && res.data?.updateSuggestion) {
      return { success: true, data: res.data.updateSuggestion };
    }
    return res as unknown as ApiResponse<UpdateSuggestionOutput>;
  }

  async updateSuggestionStatus(
    input: UpdateSuggestionStatusInput
  ): Promise<ApiResponse<UpdateSuggestionOutput>> {
    const res = await this.mutate<{
      updateSuggestionStatus: UpdateSuggestionOutput;
    }>(UPDATE_SUGGESTION_STATUS, { input });
    if (res.success && res.data?.updateSuggestionStatus) {
      return { success: true, data: res.data.updateSuggestionStatus };
    }
    return res as unknown as ApiResponse<UpdateSuggestionOutput>;
  }

  async deleteSuggestion(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteSuggestion: boolean }>(
      DELETE_SUGGESTION,
      { id }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteSuggestion };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}
