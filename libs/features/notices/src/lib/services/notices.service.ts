import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_NOTICES,
  GET_ADMIN_NOTICES,
  GET_NOTICE_BY_ID,
  GET_PUBLISHED_NOTICES,
  GET_NOTICE_STATS,
  CREATE_NOTICE,
  UPDATE_NOTICE,
  PUBLISH_NOTICE,
  ARCHIVE_NOTICE,
  DELETE_NOTICE,
  BULK_DELETE_NOTICES,
  CREATE_NOTICE_FROM_SUGGESTION,
  GET_MANUAL_CATEGORIES,
  GET_ADMIN_MANUAL_CATEGORIES,
  CREATE_MANUAL_CATEGORY,
  UPDATE_MANUAL_CATEGORY,
  DELETE_MANUAL_CATEGORY,
  GET_MANUALS,
  GET_ADMIN_MANUALS,
  GET_MANUAL_BY_ID,
  GET_PUBLISHED_MANUALS,
  GET_MANUAL_HISTORIES,
  GET_MANUAL_STATS,
  CREATE_MANUAL,
  UPDATE_MANUAL,
  PUBLISH_MANUAL,
  ARCHIVE_MANUAL,
  DELETE_MANUAL,
  BULK_DELETE_MANUALS,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  INoticesService,
  Notice,
  Manual,
  ManualCategory,
  ManualHistory,
  NoticeStats,
  ManualSummaryStats,
  BulkDeleteNoticesOutput,
  BulkDeleteManualsOutput,
  GetNoticesOutput,
  CreateNoticeOutput,
  UpdateNoticeOutput,
  GetManualsOutput,
  ManualCategoryCommandResult,
  CreateManualOutput,
  UpdateManualOutput,
  GetNoticesInput,
  CreateNoticeInput,
  UpdateNoticeInput,
  PublishNoticeInput,
  ArchiveNoticeInput,
  DeleteNoticeInput,
  BulkDeleteNoticesInput,
  GetManualsInput,
  CreateManualCategoryInput,
  UpdateManualCategoryInput,
  CreateManualInput,
  UpdateManualInput,
  PublishManualInput,
  ArchiveManualInput,
  DeleteManualInput,
  BulkDeleteManualsInput,
  NoticeBusinessType,
} from '../types';

export class NoticesService implements INoticesService {
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
  // Notice Queries
  // ============================================================================

  async getNotices(
    input: GetNoticesInput
  ): Promise<ApiResponse<GetNoticesOutput>> {
    const res = await this.query<{ notices: GetNoticesOutput }>(GET_NOTICES, {
      input,
    });
    if (res.success && res.data?.notices)
      return { success: true, data: res.data.notices };
    return res as unknown as ApiResponse<GetNoticesOutput>;
  }

  async getAdminNotices(
    input: GetNoticesInput
  ): Promise<ApiResponse<GetNoticesOutput>> {
    const res = await this.query<{ adminNotices: GetNoticesOutput }>(
      GET_ADMIN_NOTICES,
      { input }
    );
    if (res.success && res.data?.adminNotices)
      return { success: true, data: res.data.adminNotices };
    return res as unknown as ApiResponse<GetNoticesOutput>;
  }

  async getNoticeById(id: number): Promise<ApiResponse<Notice>> {
    const res = await this.query<{ notice: Notice }>(GET_NOTICE_BY_ID, { id });
    if (res.success && res.data?.notice)
      return { success: true, data: res.data.notice };
    return res as unknown as ApiResponse<Notice>;
  }

  async getPublishedNotices(
    targetApp?: string
  ): Promise<ApiResponse<Notice[]>> {
    const res = await this.query<{ publishedNotices: Notice[] }>(
      GET_PUBLISHED_NOTICES,
      { targetApp }
    );
    if (res.success && res.data?.publishedNotices)
      return { success: true, data: res.data.publishedNotices };
    return res as unknown as ApiResponse<Notice[]>;
  }

  async getNoticeStats(): Promise<ApiResponse<NoticeStats>> {
    const res = await this.query<{ noticeStats: NoticeStats }>(
      GET_NOTICE_STATS
    );
    if (res.success && res.data?.noticeStats)
      return { success: true, data: res.data.noticeStats };
    return res as unknown as ApiResponse<NoticeStats>;
  }

  // ============================================================================
  // Notice Mutations
  // ============================================================================

  async createNotice(
    input: CreateNoticeInput
  ): Promise<ApiResponse<CreateNoticeOutput>> {
    const res = await this.mutate<{ createNotice: CreateNoticeOutput }>(
      CREATE_NOTICE,
      { input }
    );
    if (res.success && res.data?.createNotice)
      return { success: true, data: res.data.createNotice };
    return res as unknown as ApiResponse<CreateNoticeOutput>;
  }

  async updateNotice(
    input: UpdateNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>> {
    const res = await this.mutate<{ updateNotice: UpdateNoticeOutput }>(
      UPDATE_NOTICE,
      { input }
    );
    if (res.success && res.data?.updateNotice)
      return { success: true, data: res.data.updateNotice };
    return res as unknown as ApiResponse<UpdateNoticeOutput>;
  }

  async publishNotice(
    input: PublishNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>> {
    const res = await this.mutate<{ publishNotice: UpdateNoticeOutput }>(
      PUBLISH_NOTICE,
      { input }
    );
    if (res.success && res.data?.publishNotice)
      return { success: true, data: res.data.publishNotice };
    return res as unknown as ApiResponse<UpdateNoticeOutput>;
  }

  async archiveNotice(
    input: ArchiveNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>> {
    const res = await this.mutate<{ archiveNotice: UpdateNoticeOutput }>(
      ARCHIVE_NOTICE,
      { input }
    );
    if (res.success && res.data?.archiveNotice)
      return { success: true, data: res.data.archiveNotice };
    return res as unknown as ApiResponse<UpdateNoticeOutput>;
  }

  async deleteNotice({
    id,
    hardDelete = false,
  }: DeleteNoticeInput): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteNotice: boolean }>(DELETE_NOTICE, {
      id,
      hardDelete,
    });
    if (res.success && res.data !== undefined)
      return { success: true, data: res.data.deleteNotice };
    return res as unknown as ApiResponse<boolean>;
  }

  async bulkDeleteNotices({
    ids,
    hardDelete = false,
  }: BulkDeleteNoticesInput): Promise<ApiResponse<BulkDeleteNoticesOutput>> {
    const res = await this.mutate<{
      bulkDeleteNotices: BulkDeleteNoticesOutput;
    }>(BULK_DELETE_NOTICES, { ids, hardDelete });
    if (res.success && res.data?.bulkDeleteNotices)
      return { success: true, data: res.data.bulkDeleteNotices };
    return res as unknown as ApiResponse<BulkDeleteNoticesOutput>;
  }

  async createNoticeFromSuggestion(
    suggestionId: number,
    suggestionTitle: string,
    suggestionContent: string
  ): Promise<ApiResponse<CreateNoticeOutput>> {
    const res = await this.mutate<{
      createNoticeFromSuggestion: CreateNoticeOutput;
    }>(CREATE_NOTICE_FROM_SUGGESTION, {
      suggestionId,
      suggestionTitle,
      suggestionContent,
    });
    if (res.success && res.data?.createNoticeFromSuggestion)
      return { success: true, data: res.data.createNoticeFromSuggestion };
    return res as unknown as ApiResponse<CreateNoticeOutput>;
  }

  // ============================================================================
  // Manual Category
  // ============================================================================

  async getManualCategories(
    targetBusiness?: NoticeBusinessType,
    targetApp?: string
  ): Promise<ApiResponse<ManualCategory[]>> {
    const res = await this.query<{ manualCategories: ManualCategory[] }>(
      GET_MANUAL_CATEGORIES,
      { targetBusiness, targetApp }
    );
    if (res.success && res.data?.manualCategories)
      return { success: true, data: res.data.manualCategories };
    return res as unknown as ApiResponse<ManualCategory[]>;
  }

  async getAdminManualCategories(
    targetBusiness?: NoticeBusinessType,
    targetApp?: string
  ): Promise<ApiResponse<ManualCategory[]>> {
    const res = await this.query<{ adminManualCategories: ManualCategory[] }>(
      GET_ADMIN_MANUAL_CATEGORIES,
      { targetBusiness, targetApp }
    );
    if (res.success && res.data?.adminManualCategories)
      return { success: true, data: res.data.adminManualCategories };
    return res as unknown as ApiResponse<ManualCategory[]>;
  }

  async createManualCategory(
    input: CreateManualCategoryInput
  ): Promise<ApiResponse<ManualCategoryCommandResult>> {
    const res = await this.mutate<{
      createManualCategory: ManualCategoryCommandResult;
    }>(CREATE_MANUAL_CATEGORY, { input });
    if (res.success && res.data?.createManualCategory)
      return { success: true, data: res.data.createManualCategory };
    return res as unknown as ApiResponse<ManualCategoryCommandResult>;
  }

  async updateManualCategory(
    input: UpdateManualCategoryInput
  ): Promise<ApiResponse<ManualCategoryCommandResult>> {
    const res = await this.mutate<{
      updateManualCategory: ManualCategoryCommandResult;
    }>(UPDATE_MANUAL_CATEGORY, { input });
    if (res.success && res.data?.updateManualCategory)
      return { success: true, data: res.data.updateManualCategory };
    return res as unknown as ApiResponse<ManualCategoryCommandResult>;
  }

  async deleteManualCategory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteManualCategory: boolean }>(
      DELETE_MANUAL_CATEGORY,
      { id }
    );
    if (res.success && res.data !== undefined)
      return { success: true, data: res.data.deleteManualCategory };
    return res as unknown as ApiResponse<boolean>;
  }

  // ============================================================================
  // Manual
  // ============================================================================

  async getManuals(
    input: GetManualsInput
  ): Promise<ApiResponse<GetManualsOutput>> {
    const res = await this.query<{ manuals: GetManualsOutput }>(GET_MANUALS, {
      input,
    });
    if (res.success && res.data?.manuals)
      return { success: true, data: res.data.manuals };
    return res as unknown as ApiResponse<GetManualsOutput>;
  }

  async getAdminManuals(
    input: GetManualsInput
  ): Promise<ApiResponse<GetManualsOutput>> {
    const res = await this.query<{ adminManuals: GetManualsOutput }>(
      GET_ADMIN_MANUALS,
      { input }
    );
    if (res.success && res.data?.adminManuals)
      return { success: true, data: res.data.adminManuals };
    return res as unknown as ApiResponse<GetManualsOutput>;
  }

  async getManualById(id: number): Promise<ApiResponse<Manual>> {
    const res = await this.query<{ manual: Manual }>(GET_MANUAL_BY_ID, { id });
    if (res.success && res.data?.manual)
      return { success: true, data: res.data.manual };
    return res as unknown as ApiResponse<Manual>;
  }

  async getPublishedManuals(
    targetBusiness: NoticeBusinessType,
    targetApp: string,
    categoryId?: number
  ): Promise<ApiResponse<Manual[]>> {
    const res = await this.query<{ publishedManuals: Manual[] }>(
      GET_PUBLISHED_MANUALS,
      { targetBusiness, targetApp, categoryId }
    );
    if (res.success && res.data?.publishedManuals)
      return { success: true, data: res.data.publishedManuals };
    return res as unknown as ApiResponse<Manual[]>;
  }

  async getManualHistories(
    manualId: number
  ): Promise<ApiResponse<ManualHistory[]>> {
    const res = await this.query<{ manualHistories: ManualHistory[] }>(
      GET_MANUAL_HISTORIES,
      { manualId }
    );
    if (res.success && res.data?.manualHistories)
      return { success: true, data: res.data.manualHistories };
    return res as unknown as ApiResponse<ManualHistory[]>;
  }

  async getManualStats(): Promise<ApiResponse<ManualSummaryStats>> {
    const res = await this.query<{ manualStats: ManualSummaryStats }>(
      GET_MANUAL_STATS
    );
    if (res.success && res.data?.manualStats)
      return { success: true, data: res.data.manualStats };
    return res as unknown as ApiResponse<ManualSummaryStats>;
  }

  async createManual(
    input: CreateManualInput
  ): Promise<ApiResponse<CreateManualOutput>> {
    const res = await this.mutate<{ createManual: CreateManualOutput }>(
      CREATE_MANUAL,
      { input }
    );
    if (res.success && res.data?.createManual)
      return { success: true, data: res.data.createManual };
    return res as unknown as ApiResponse<CreateManualOutput>;
  }

  async updateManual(
    input: UpdateManualInput
  ): Promise<ApiResponse<UpdateManualOutput>> {
    const res = await this.mutate<{ updateManual: UpdateManualOutput }>(
      UPDATE_MANUAL,
      { input }
    );
    if (res.success && res.data?.updateManual)
      return { success: true, data: res.data.updateManual };
    return res as unknown as ApiResponse<UpdateManualOutput>;
  }

  async publishManual(
    input: PublishManualInput
  ): Promise<ApiResponse<UpdateManualOutput>> {
    const res = await this.mutate<{ publishManual: UpdateManualOutput }>(
      PUBLISH_MANUAL,
      { input }
    );
    if (res.success && res.data?.publishManual)
      return { success: true, data: res.data.publishManual };
    return res as unknown as ApiResponse<UpdateManualOutput>;
  }

  async archiveManual(
    input: ArchiveManualInput
  ): Promise<ApiResponse<UpdateManualOutput>> {
    const res = await this.mutate<{ archiveManual: UpdateManualOutput }>(
      ARCHIVE_MANUAL,
      { input }
    );
    if (res.success && res.data?.archiveManual)
      return { success: true, data: res.data.archiveManual };
    return res as unknown as ApiResponse<UpdateManualOutput>;
  }

  async deleteManual({
    id,
    hardDelete = false,
  }: DeleteManualInput): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteManual: boolean }>(DELETE_MANUAL, {
      id,
      hardDelete,
    });
    if (res.success && res.data !== undefined)
      return { success: true, data: res.data.deleteManual };
    return res as unknown as ApiResponse<boolean>;
  }

  async bulkDeleteManuals({
    ids,
    hardDelete = false,
  }: BulkDeleteManualsInput): Promise<ApiResponse<BulkDeleteManualsOutput>> {
    const res = await this.mutate<{
      bulkDeleteManuals: BulkDeleteManualsOutput;
    }>(BULK_DELETE_MANUALS, { ids, hardDelete });
    if (res.success && res.data?.bulkDeleteManuals)
      return { success: true, data: res.data.bulkDeleteManuals };
    return res as unknown as ApiResponse<BulkDeleteManualsOutput>;
  }
}
