// libs/features/queue/src/lib/types/queue.types.ts

import type { ApiResponse } from '../types';

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum QueueSessionStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// ── Core Types ────────────────────────────────────────────────────────────────

export interface QueueSession {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  storeId: number;
  serviceId: number;
  walkInId: number;
  // 회원
  userId?: number | null;
  // ✅ 비회원 필드 추가
  guestName?: string | null;
  guestPhone?: string | null;
  guestVehicleNumber?: string | null;
  ticketNumber: string;
  redisTicketId: string;
  position: number;
  estimatedEntryAt: string;
  actualEntryAt?: string | null;
  completedAt?: string | null;
  status: QueueSessionStatus;
  durationSec?: number | null;
}

export interface QueueStats {
  storeId: number;
  waitingCount: number;
  avgDurationSec: number;
  todayTotal: number;
  isOpen: boolean;
  estimatedWaitMin: number;
}

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ── Input Types ───────────────────────────────────────────────────────────────

export interface GetQueueStatsInput {
  storeId: number;
}

export interface GetIntegratedStatsInput {
  storeIds: number[];
}

export interface FindQueueSessionsInput {
  storeId?: number;
  userId?: number;
  status?: QueueSessionStatus;
  limit?: number;
  offset?: number;
}

export interface CreateQueueSessionInput {
  walkInId: number;
  storeId: number;
  serviceId: number;
  // 회원
  userId?: number;
  // ✅ 비회원 필드 추가
  guestName?: string;
  guestPhone?: string;
  guestVehicleNumber?: string;
}

// ✅ 추가
export interface UpdateQueueSessionInput {
  id: number;
  guestName?: string;
  guestPhone?: string;
  guestVehicleNumber?: string;
}

export interface CallNextInput {
  storeId: number;
}

export interface CompleteServiceInput {
  storeId: number;
  ticketId: string;
  durationSec: number;
}

export interface CancelTicketInput {
  ticketId: string;
  storeId: number;
}

// ── Output Types ──────────────────────────────────────────────────────────────

export interface CreateQueueSessionOutput {
  success?: boolean | null;
  message?: string | null;
  error?: ErrorInfo | null;
  session?: QueueSession | null;
  stats?: QueueStats | null;
}

export interface UpdateQueueSessionOutput {
  success?: boolean | null;
  message?: string | null;
  ticketId?: string | null;
  error?: ErrorInfo | null;
  session?: QueueSession | null;
}

export interface FindQueueSessionsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  sessions?: QueueSession[] | null;
  total?: number | null;
}

export interface GetQueueStatsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  stats?: QueueStats | null;
}

export interface GetIntegratedStatsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  stats?: QueueStats[] | null;
}

export interface DeleteQueueSessionOutput {
  success?: boolean | null;
  message?: string | null;
  ticketId?: string | null;
  error?: ErrorInfo | null;
}

// ── Service Interface ─────────────────────────────────────────────────────────

export interface IQueueService {
  getQueueStats(
    input: GetQueueStatsInput
  ): Promise<ApiResponse<GetQueueStatsOutput>>;
  getIntegratedQueueStats(
    input: GetIntegratedStatsInput
  ): Promise<ApiResponse<GetIntegratedStatsOutput>>;
  findQueueSessions(
    input: FindQueueSessionsInput
  ): Promise<ApiResponse<FindQueueSessionsOutput>>;
  getQueueSession(id: number): Promise<ApiResponse<QueueSession>>;
  // ✅ 3가지 접수 채널
  createQueueSession(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>>;
  createGuestQueueSession(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>>;
  createQueueSessionByAdmin(
    input: CreateQueueSessionInput
  ): Promise<ApiResponse<CreateQueueSessionOutput>>;
  // ✅ 비회원 정보만 수정
  updateQueueSession(
    input: UpdateQueueSessionInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>>;
  // ✅ 상태 변경은 전용 Mutation
  callNext(
    input: CallNextInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>>;
  completeQueueService(
    input: CompleteServiceInput
  ): Promise<ApiResponse<UpdateQueueSessionOutput>>;
  cancelQueueTicket(
    input: CancelTicketInput
  ): Promise<ApiResponse<DeleteQueueSessionOutput>>;
}

// ── Context State ─────────────────────────────────────────────────────────────

export interface QueueState {
  integratedStats: QueueStats[];
  currentStats: QueueStats | null;
  currentSession: QueueSession | null;
  sessions: QueueSession[];
  isLoading: boolean;
  error: string | null;
}

export interface QueueContextActions {
  setIntegratedStats: (stats: QueueStats[]) => void;
  setCurrentStats: (stats: QueueStats | null) => void;
  setCurrentSession: (session: QueueSession | null) => void;
  setSessions: (sessions: QueueSession[]) => void;
  loadIntegratedStats: (storeIds: number[]) => Promise<void>;
  loadQueueStats: (storeId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type QueueContextValue = QueueState & QueueContextActions;
