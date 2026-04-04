import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_MY_NOTIFICATIONS,
  GET_MY_NOTIFICATION_STATS,
  SEARCH_NOTIFICATIONS,
  GET_ADMIN_NOTIFICATION_STATS,
  GET_UNREAD_NOTIFICATIONS,
  SEND_EMAIL_NOTIFICATION,
  MARK_NOTIFICATION_AS_READ,
  DELETE_NOTIFICATION,
  MARK_ALL_AS_READ,
  MARK_AS_READ,
  DELETE_BY_ID,
  GET_EMAILS,
  GET_EMAIL_BY_ID,
  SEND_EMAIL,
  RETRY_EMAIL,
  ADMIN_GET_ALL_NOTIFICATIONS,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  INotificationsService,
  Email,
  CreateNotificationInput,
  CreateNotificationOutput,
  GetNotificationsInput,
  GetNotificationsOutput,
  NotificationStatsOutput,
  MarkNotificationAsReadInput,
  DeleteNotificationInput,
  GetEmailsInput,
  GetEmailsOutput,
  SendEmailInput,
  SendEmailOutput,
  GetAllNotificationsInput,
} from '../types';

export class NotificationsService implements INotificationsService {
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
  // Notification Queries
  // ============================================================================

  async getMyNotifications(
    input: GetNotificationsInput
  ): Promise<ApiResponse<GetNotificationsOutput>> {
    const res = await this.query<{
      getMyNotifications: GetNotificationsOutput;
    }>(GET_MY_NOTIFICATIONS, { input });
    if (res.success && res.data?.getMyNotifications) {
      return { success: true, data: res.data.getMyNotifications };
    }
    return res as unknown as ApiResponse<GetNotificationsOutput>;
  }

  async getMyNotificationStats(): Promise<
    ApiResponse<NotificationStatsOutput>
  > {
    const res = await this.query<{
      getMyNotificationStats: NotificationStatsOutput;
    }>(GET_MY_NOTIFICATION_STATS);
    if (res.success && res.data?.getMyNotificationStats) {
      return { success: true, data: res.data.getMyNotificationStats };
    }
    return res as unknown as ApiResponse<NotificationStatsOutput>;
  }

  async searchNotifications(
    query: string,
    limit = 20
  ): Promise<ApiResponse<GetNotificationsOutput>> {
    const res = await this.query<{
      searchNotifications: GetNotificationsOutput;
    }>(SEARCH_NOTIFICATIONS, { query, limit });
    if (res.success && res.data?.searchNotifications) {
      return { success: true, data: res.data.searchNotifications };
    }
    return res as unknown as ApiResponse<GetNotificationsOutput>;
  }

  async getAdminNotificationStats(): Promise<
    ApiResponse<NotificationStatsOutput>
  > {
    const res = await this.query<{
      getAdminNotificationStats: NotificationStatsOutput;
    }>(GET_ADMIN_NOTIFICATION_STATS);
    if (res.success && res.data?.getAdminNotificationStats) {
      return { success: true, data: res.data.getAdminNotificationStats };
    }
    return res as unknown as ApiResponse<NotificationStatsOutput>;
  }

  /** 관리자 전용: 전체 유저의 알림 목록 조회 */
  async adminGetAllNotifications(
    input?: GetAllNotificationsInput
  ): Promise<ApiResponse<GetNotificationsOutput>> {
    const res = await this.query<{
      adminGetAllNotifications: GetNotificationsOutput;
    }>(ADMIN_GET_ALL_NOTIFICATIONS, { input });
    if (res.success && res.data?.adminGetAllNotifications) {
      return { success: true, data: res.data.adminGetAllNotifications };
    }
    return res as unknown as ApiResponse<GetNotificationsOutput>;
  }

  async getUnreadNotifications(
    limit = 20
  ): Promise<ApiResponse<GetNotificationsOutput>> {
    const res = await this.query<{
      getUnreadNotifications: GetNotificationsOutput;
    }>(GET_UNREAD_NOTIFICATIONS, { limit });
    if (res.success && res.data?.getUnreadNotifications) {
      return { success: true, data: res.data.getUnreadNotifications };
    }
    return res as unknown as ApiResponse<GetNotificationsOutput>;
  }

  // ============================================================================
  // Notification Mutations
  // ============================================================================

  async sendEmailNotification(
    input: CreateNotificationInput
  ): Promise<ApiResponse<CreateNotificationOutput>> {
    const res = await this.mutate<{
      sendEmailNotification: CreateNotificationOutput;
    }>(SEND_EMAIL_NOTIFICATION, { input });
    if (res.success && res.data?.sendEmailNotification) {
      return { success: true, data: res.data.sendEmailNotification };
    }
    return res as unknown as ApiResponse<CreateNotificationOutput>;
  }

  async markNotificationAsRead(
    input: MarkNotificationAsReadInput
  ): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ markNotificationAsRead: boolean }>(
      MARK_NOTIFICATION_AS_READ,
      { input }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.markNotificationAsRead };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteNotification(
    input: DeleteNotificationInput
  ): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteNotification: boolean }>(
      DELETE_NOTIFICATION,
      { input }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteNotification };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async markAllAsRead(): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ markAllAsRead: boolean }>(
      MARK_ALL_AS_READ,
      {} as OperationVariables
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.markAllAsRead };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async markAsRead(notificationId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ markAsRead: boolean }>(MARK_AS_READ, {
      notificationId,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.markAsRead };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteById(notificationId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteById: boolean }>(DELETE_BY_ID, {
      notificationId,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteById };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  // ============================================================================
  // Email Queries
  // ============================================================================

  async getEmails(
    input: GetEmailsInput
  ): Promise<ApiResponse<GetEmailsOutput>> {
    const res = await this.query<{ getEmails: GetEmailsOutput }>(GET_EMAILS, {
      input,
    });
    if (res.success && res.data?.getEmails) {
      return { success: true, data: res.data.getEmails };
    }
    return res as unknown as ApiResponse<GetEmailsOutput>;
  }

  async getEmailById(id: number): Promise<ApiResponse<Email>> {
    const res = await this.query<{ getEmailById: Email }>(GET_EMAIL_BY_ID, {
      id,
    });
    if (res.success && res.data?.getEmailById) {
      return { success: true, data: res.data.getEmailById };
    }
    return res as unknown as ApiResponse<Email>;
  }

  // ============================================================================
  // Email Mutations
  // ============================================================================

  async sendEmail(
    input: SendEmailInput
  ): Promise<ApiResponse<SendEmailOutput>> {
    const res = await this.mutate<{ sendEmail: SendEmailOutput }>(SEND_EMAIL, {
      input,
    });
    if (res.success && res.data?.sendEmail) {
      return { success: true, data: res.data.sendEmail };
    }
    return res as unknown as ApiResponse<SendEmailOutput>;
  }

  async retryEmail(emailId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ retryEmail: boolean }>(RETRY_EMAIL, {
      emailId,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.retryEmail };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}
