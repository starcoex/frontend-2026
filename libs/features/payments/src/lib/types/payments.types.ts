import type { ApiResponse } from '../types';

// ============================================================================
// Federation stub 타입
// ============================================================================

export interface OrderRef {
  id: number;
}

export interface ReservationRef {
  id: number;
}

export interface UserRef {
  id: number;
}

// ============================================================================
// Enum 타입
// ============================================================================

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  PARTIAL_CANCELLED = 'PARTIAL_CANCELLED',
}

export enum CancellationStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

// ============================================================================
// 공통 스칼라 타입
// ============================================================================

export type JsonValue = Record<string, unknown> | null;

// ============================================================================
// 에러 타입
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface RefundAccount {
  bank: string;
  number: string;
  holderName: string;
  holderPhoneNumber?: string | null;
}

export interface PaymentCancellation {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  cancellationId: string;
  paymentId: number;
  cancelledAmount: number;
  reason?: string | null;
  status: CancellationStatus;
  refundAccount?: JsonValue;
  portoneData?: JsonValue;
  requestedAt: string;
  completedAt?: string | null;
  payment?: Payment;
}

export interface Payment {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  portOneId: string;
  amount: number;
  currency: string;
  orderName: string;
  status: PaymentStatus;
  userId?: number | null;
  orderId: number;
  reservationId: number;
  guestEmail?: string | null;
  portoneData?: JsonValue;
  customData?: JsonValue;
  paidAt?: string | null;
  cancellations: PaymentCancellation[];
  order?: OrderRef | null;
  user?: UserRef | null;
  reservation?: ReservationRef | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface PaymentListData {
  payments: Payment[];
  total: number;
  hasMore: boolean;
  currentPageCount: number;
  totalPaidAmount: number;
  totalCancelledAmount: number;
}

export interface GetPaymentOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  payment?: Payment | null;
}

export interface GetPaymentsOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  data?: PaymentListData | null;
}

export interface GetCancellationOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  cancellation?: PaymentCancellation | null;
}

export interface CreatePaymentOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  payment?: Payment | null;
  creationMessage?: string | null;
  paymentPageUrl?: string | null;
}

export interface CompletePaymentOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  payment?: Payment | null;
  completionMessage?: string | null;
}

export interface CancelPaymentOutput {
  error?: ErrorInfo | null;
  success?: boolean | null;
  cancellation?: PaymentCancellation | null;
  cancellationMessage?: string | null;
  refundStatusMessage?: string | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetPaymentInput {
  portOneId: string;
}

export interface GetPaymentsInput {
  userId?: number;
  orderId?: number;
  reservationId?: number;
  guestEmail?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  orderNameSearch?: string;
}

export interface GetCancellationInput {
  cancellationId: string;
}

export interface RefundAccountInput {
  bank: string;
  number: string;
  holderName: string;
  holderPhoneNumber?: string;
}

export interface CreatePaymentInput {
  portOneId: string;
  amount: number;
  currency?: string;
  orderName: string;
  userId?: number;
  orderId?: number;
  reservationId?: number;
  guestEmail?: string;
  customData?: JsonValue;
  successUrl?: string;
  failUrl?: string;
}

export interface CompletePaymentInput {
  portOneId: string;
}

export interface CancelPaymentInput {
  cancellationId: string;
  reason?: string;
  paymentPortOneId: string;
  cancelledAmount?: number;
  refundAccount?: RefundAccountInput;
  userAgent?: string;
  requestIp?: string;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IPaymentsService {
  // ── Queries ──
  getPayment(input: GetPaymentInput): Promise<ApiResponse<GetPaymentOutput>>;
  getPayments(
    input?: GetPaymentsInput
  ): Promise<ApiResponse<GetPaymentsOutput>>;
  getPaymentCancellation(
    input: GetCancellationInput
  ): Promise<ApiResponse<GetCancellationOutput>>;
  // ── Mutations ──
  createPayment(
    input: CreatePaymentInput
  ): Promise<ApiResponse<CreatePaymentOutput>>;
  completePayment(
    input: CompletePaymentInput
  ): Promise<ApiResponse<CompletePaymentOutput>>;
  cancelPayment(
    input: CancelPaymentInput
  ): Promise<ApiResponse<CancelPaymentOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export type PaymentsFilter = GetPaymentsInput;

export interface PaymentsState {
  payments: Payment[];
  selectedPayment: Payment | null;
  selectedCancellation: PaymentCancellation | null;
  listData: PaymentListData | null;
  filter: PaymentsFilter;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface PaymentsContextActions {
  // ── 상태 직접 변경 (Context 내부용) ──
  setPayments(payments: Payment[], listData: PaymentListData): void;
  setSelectedPayment(payment: Payment | null): void;
  setSelectedCancellation(cancellation: PaymentCancellation | null): void;
  setFilter(filter: Partial<PaymentsFilter>): void;
  resetFilter(): void;
  setLoading(isLoading: boolean): void;
  setSubmitting(isSubmitting: boolean): void;
  setError(error: string | null): void;
  clearError(): void;
  reset(): void;
}

export type PaymentsContextValue = PaymentsState & PaymentsContextActions;
