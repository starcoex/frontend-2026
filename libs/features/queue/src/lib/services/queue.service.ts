import type { ApolloClient, OperationVariables } from '@apollo/client';
import type {
  ApiResponse,
  IQueueService,
  QueueSession,
  GetQueueStatsInput,
  GetQueueStatsOutput,
  GetIntegratedStatsInput,
  GetIntegratedStatsOutput,
  FindQueueSessionsInput,
  FindQueueSessionsOutput,
  CreateQueueSessionInput,
  CreateQueueSessionOutput,
  CallNextInput,
  UpdateQueueSessionOutput,
  CompleteServiceInput,
  CancelTicketInput,
  DeleteQueueSessionOutput,
  UpdateQueueSessionInput,
} from '../types';
import {
  GET_QUEUE_STATS,
  GET_INTEGRATED_QUEUE_STATS,
  FIND_QUEUE_SESSIONS,
  GET_QUEUE_SESSION,
  CREATE_QUEUE_SESSION,
  CREATE_GUEST_QUEUE_SESSION,
  CREATE_QUEUE_SESSION_BY_ADMIN,
  CALL_NEXT,
  COMPLETE_QUEUE_SERVICE,
  CANCEL_QUEUE_TICKET,
  UPDATE_QUEUE_SESSION,
} from '@starcoex-frontend/graphql';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '@starcoex-frontend/stores';

export class QueueService implements IQueueService {
  constructor(private client: ApolloClient) {}

  // ── 공통 헬퍼 ────────────────────────────────────────────────────────────────

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
      return createErrorResponse<TData>(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

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
      return createErrorResponse<TData>(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

  // ── Query ─────────────────────────────────────────────────────────────────────

  async getQueueStats(
    input: GetQueueStatsInput
  ): Promise<ApiResponse<GetQueueStatsOutput>> {
    const res = await this.query<{ getQueueStats: GetQueueStatsOutput }>(
      GET_QUEUE_STATS,
      { input }
    );
    if (res.success && res.data?.getQueueStats)
      return { success: true, data: res.data.getQueueStats };
    return res as unknown as ApiResponse<GetQueueStatsOutput>;
  }

  async getIntegratedQueueStats(
    input: GetIntegratedStatsInput
  ): Promise<ApiResponse<GetIntegratedStatsOutput>> {
    const res = await this.query<{
      getIntegratedQueueStats: GetIntegratedStatsOutput;
    }>(GET_INTEGRATED_QUEUE_STATS, { input });
    if (res.success && res.data?.getIntegratedQueueStats)
      return { success: true, data: res.data.getIntegratedQueueStats };
    return res as unknown as ApiResponse<GetIntegratedStatsOutput>;
  }

  async findQueueSessions(
    input: FindQueueSessionsInput
  ): Promise<ApiResponse<FindQueueSessionsOutput>> {
    const res = await this.query<{
      findQueueSessions: FindQueueSessionsOutput;
    }>(FIND_QUEUE_SESSIONS, { input });
    if (res.success && res.data?.findQueueSessions)
      return { success: true, data: res.data.findQueueSessions };
    return res as unknown as ApiResponse<FindQueueSessionsOutput>;
  }

  async getQueueSession(id: number): Promise<ApiResponse<QueueSession>> {
    const res = await this.query<{ getQueueSession: QueueSession }>(
      GET_QUEUE_SESSION,
      { id }
    );
    if (res.success && res.data?.getQueueSession)
      return { success: true, data: res.data.getQueueSession };
    return res as unknown as ApiResponse<QueueSession>;
  }

  // ── Mutation — 3가지 접수 채널 ────────────────────────────────────────────────

  // ✅ 회원 접수
  async createQueueSession(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>> {
    const res = await this.mutate<{
      createQueueSession: CreateQueueSessionOutput;
    }>(CREATE_QUEUE_SESSION, { input });
    if (res.success && res.data?.createQueueSession)
      return { success: true, data: res.data.createQueueSession };
    return res as unknown as ApiResponse<CreateQueueSessionOutput>;
  }

  // ✅ 비회원 접수 (키오스크 / 고객 앱)
  async createGuestQueueSession(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>> {
    const res = await this.mutate<{
      createGuestQueueSession: CreateQueueSessionOutput;
    }>(CREATE_GUEST_QUEUE_SESSION, { input });
    if (res.success && res.data?.createGuestQueueSession)
      return { success: true, data: res.data.createGuestQueueSession };
    return res as unknown as ApiResponse<CreateQueueSessionOutput>;
  }

  // ✅ 관리자 수기 등록
  async createQueueSessionByAdmin(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>> {
    const res = await this.mutate<{
      createQueueSessionByAdmin: CreateQueueSessionOutput;
    }>(CREATE_QUEUE_SESSION_BY_ADMIN, { input });
    if (res.success && res.data?.createQueueSessionByAdmin)
      return { success: true, data: res.data.createQueueSessionByAdmin };
    return res as unknown as ApiResponse<CreateQueueSessionOutput>;
  }

  // ✅ 비회원 정보 수정 (스키마 기준 id + guest 3개 필드)
  async updateQueueSession(
    input: UpdateQueueSessionInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>> {
    const res = await this.mutate<{
      updateQueueSession: UpdateQueueSessionOutput;
    }>(UPDATE_QUEUE_SESSION, { input });
    if (res.success && res.data?.updateQueueSession)
      return { success: true, data: res.data.updateQueueSession };
    return res as unknown as ApiResponse<UpdateQueueSessionOutput>;
  }

  async callNext(
    input: CallNextInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>> {
    const res = await this.mutate<{ callNext: UpdateQueueSessionOutput }>(
      CALL_NEXT,
      { input }
    );
    if (res.success && res.data?.callNext)
      return { success: true, data: res.data.callNext };
    return res as unknown as ApiResponse<UpdateQueueSessionOutput>;
  }

  async completeQueueService(
    input: CompleteServiceInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>> {
    const res = await this.mutate<{
      completeQueueService: UpdateQueueSessionOutput;
    }>(COMPLETE_QUEUE_SERVICE, { input });
    if (res.success && res.data?.completeQueueService)
      return { success: true, data: res.data.completeQueueService };
    return res as unknown as ApiResponse<UpdateQueueSessionOutput>;
  }

  async cancelQueueTicket(
    input: CancelTicketInput
  ): Promise<ApiResponse<DeleteQueueSessionOutput>> {
    const res = await this.mutate<{
      cancelQueueTicket: DeleteQueueSessionOutput;
    }>(CANCEL_QUEUE_TICKET, { input });
    if (res.success && res.data?.cancelQueueTicket)
      return { success: true, data: res.data.cancelQueueTicket };
    return res as unknown as ApiResponse<DeleteQueueSessionOutput>;
  }
}
