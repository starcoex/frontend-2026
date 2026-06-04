import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: any; output: any; }
};

export type CancelPaymentInput = {
  /** 취소 ID (고유값) */
  cancellationId: Scalars['String']['input'];
  /** 취소 금액 (미입력시 전액 취소) */
  cancelledAmount?: InputMaybe<Scalars['Int']['input']>;
  /** 취소할 결제의 포트원 ID */
  paymentPortOneId: Scalars['String']['input'];
  /** 취소 사유 */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** 환불 계좌 정보 (가상계좌 취소시 필수) */
  refundAccount?: InputMaybe<RefundAccountInput>;
  /** 취소 요청 IP 주소 */
  requestIp?: InputMaybe<Scalars['String']['input']>;
  /** 취소 요청한 디바이스/브라우저 정보 */
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type CancelPaymentOutput = {
  __typename?: 'CancelPaymentOutput';
  cancellation?: Maybe<PaymentCancellation>;
  /** 취소 처리 완료 메시지 */
  cancellationMessage?: Maybe<Scalars['String']['output']>;
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  /** 환불 처리 상태 메시지 */
  refundStatusMessage?: Maybe<Scalars['String']['output']>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** 취소 상태 */
export type CancellationStatus =
  /** 취소 실패 */
  | 'FAILED'
  /** 취소 요청 중 */
  | 'PENDING'
  /** 취소 완료 */
  | 'SUCCEEDED';

export type CompletePaymentInput = {
  /** 포트원 결제 ID (고유값) */
  portOneId: Scalars['String']['input'];
};

export type CompletePaymentOutput = {
  __typename?: 'CompletePaymentOutput';
  /** 결제 완료 처리 메시지 */
  completionMessage?: Maybe<Scalars['String']['output']>;
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  payment?: Maybe<Payment>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreatePaymentInput = {
  /** 결제 금액 (원 단위) */
  amount: Scalars['Int']['input'];
  /** 통화 코드 */
  currency?: Scalars['String']['input'];
  /** 커스텀 데이터 (주문 메타데이터 등) */
  customData?: InputMaybe<Scalars['JSON']['input']>;
  /** 결제 실패시 리다이렉트 URL */
  failUrl?: InputMaybe<Scalars['String']['input']>;
  /** 비회원 이메일 (비회원 결제시 필수) */
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  /** 주문 ID (주문 결제인 경우) */
  orderId?: InputMaybe<Scalars['Int']['input']>;
  /** 주문명 */
  orderName: Scalars['String']['input'];
  /** 포트원 결제 ID (고유값) */
  portOneId: Scalars['String']['input'];
  /** 예약 ID (예약 결제인 경우) */
  reservationId?: InputMaybe<Scalars['Int']['input']>;
  /** 결제 성공시 리다이렉트 URL */
  successUrl?: InputMaybe<Scalars['String']['input']>;
  /** 사용자 ID (회원 결제시) */
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePaymentOutput = {
  __typename?: 'CreatePaymentOutput';
  /** 결제 생성 완료 메시지 */
  creationMessage?: Maybe<Scalars['String']['output']>;
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  payment?: Maybe<Payment>;
  /** 결제 페이지 URL */
  paymentPageUrl?: Maybe<Scalars['String']['output']>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ErrorInfo = {
  __typename?: 'ErrorInfo';
  /** 에러 코드 */
  code?: Maybe<Scalars['String']['output']>;
  /** 에러 세부사항 */
  details?: Maybe<Scalars['String']['output']>;
  /** 에러 메시지 */
  message: Scalars['String']['output'];
};

export type GetCancellationInput = {
  /** 취소 ID (고유값) */
  cancellationId: Scalars['String']['input'];
};

export type GetCancellationOutput = {
  __typename?: 'GetCancellationOutput';
  cancellation?: Maybe<PaymentCancellation>;
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type GetPaymentInput = {
  /** 포트원 결제 ID (고유값) */
  portOneId: Scalars['String']['input'];
};

export type GetPaymentOutput = {
  __typename?: 'GetPaymentOutput';
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  payment?: Maybe<Payment>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type GetPaymentsInput = {
  /** 종료 날짜 */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  fuelWalkInId?: InputMaybe<Scalars['Int']['input']>;
  /** 비회원 이메일로 필터링 */
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  /** 페이지 크기 (최대 100) */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** 건너뛸 개수 */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** 주문 ID로 필터링 */
  orderId?: InputMaybe<Scalars['Int']['input']>;
  /** 주문명으로 검색 */
  orderNameSearch?: InputMaybe<Scalars['String']['input']>;
  packageId?: InputMaybe<Scalars['Int']['input']>;
  /** 예약 ID (예약 결제인 경우) */
  reservationId?: InputMaybe<Scalars['Int']['input']>;
  /** 시작 날짜 */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** 결제 상태로 필터링 */
  status?: InputMaybe<PaymentStatus>;
  /** 사용자 ID로 필터링 */
  userId?: InputMaybe<Scalars['Int']['input']>;
  walkInId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetPaymentsOutput = {
  __typename?: 'GetPaymentsOutput';
  data?: Maybe<PaymentListData>;
  /** 에러 정보 */
  error?: Maybe<ErrorInfo>;
  /** 성공 여부 */
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** 결제 취소 (전액 또는 부분) */
  cancelPayment: CancelPaymentOutput;
  /** 포트원 결제 완료 처리 */
  completePayment: CompletePaymentOutput;
  /** 새 결제 생성 */
  createPayment: CreatePaymentOutput;
};


export type MutationCancelPaymentArgs = {
  input: CancelPaymentInput;
};


export type MutationCompletePaymentArgs = {
  input: CompletePaymentInput;
};


export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['Int']['output'];
};

/** 결제 엔티티 */
export type Payment = {
  __typename?: 'Payment';
  /** 결제 금액 (원 단위) */
  amount: Scalars['Int']['output'];
  /** 결제 취소 내역 목록 */
  cancellations: Array<PaymentCancellation>;
  createdAt: Scalars['DateTime']['output'];
  /** 통화 코드 */
  currency: Scalars['String']['output'];
  /** 커스텀 데이터 */
  customData?: Maybe<Scalars['JSON']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  fuelWalkInId?: Maybe<Scalars['Int']['output']>;
  /** 비회원 이메일 (userId가 null일 때 필수) */
  guestEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  order?: Maybe<Order>;
  /** 주문 ID (apps/orders Order 참조) - 항상 필수 */
  orderId?: Maybe<Scalars['Int']['output']>;
  /** 주문명 */
  orderName: Scalars['String']['output'];
  packageId?: Maybe<Scalars['Int']['output']>;
  /** 결제 완료 시각 */
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  /** 포트원 결제 ID (고유값) */
  portOneId: Scalars['String']['output'];
  /** 포트원 응답 원본 */
  portoneData?: Maybe<Scalars['JSON']['output']>;
  reservation?: Maybe<Reservation>;
  /** 주문 ID (apps/orders Order 참조) - 항상 필수 */
  reservationId?: Maybe<Scalars['Int']['output']>;
  /** 결제 상태 */
  status: PaymentStatus;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  /** 사용자 ID (apps/auth User 참조) - 비회원일 경우 null */
  userId?: Maybe<Scalars['Int']['output']>;
  walkInId?: Maybe<Scalars['Int']['output']>;
};

/** 결제 취소 엔티티 */
export type PaymentCancellation = {
  __typename?: 'PaymentCancellation';
  /** 취소 ID (고유값) */
  cancellationId: Scalars['String']['output'];
  /** 취소 금액 (원 단위) */
  cancelledAmount: Scalars['Int']['output'];
  /** 취소 완료 시간 */
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  /** 원본 결제 정보 */
  payment: Payment;
  /** 원본 결제 ID (FK) */
  paymentId: Scalars['Int']['output'];
  /** 포트원 취소 응답 데이터 */
  portoneData?: Maybe<Scalars['JSON']['output']>;
  /** 취소 사유 */
  reason?: Maybe<Scalars['String']['output']>;
  /** 환불 계좌 정보 (선택적) */
  refundAccount?: Maybe<Scalars['JSON']['output']>;
  /** 취소 요청 시간 */
  requestedAt: Scalars['DateTime']['output'];
  /** 취소 상태 */
  status: CancellationStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type PaymentListData = {
  __typename?: 'PaymentListData';
  /** 현재 페이지 결제 건수 */
  currentPageCount: Scalars['Int']['output'];
  /** 다음 페이지 존재 여부 */
  hasMore: Scalars['Boolean']['output'];
  /** 결제 목록 */
  payments: Array<Payment>;
  /** 총 결제 건수 */
  total: Scalars['Int']['output'];
  /** 취소된 결제 총액 */
  totalCancelledAmount: Scalars['Int']['output'];
  /** 완료된 결제 총액 */
  totalPaidAmount: Scalars['Int']['output'];
};

/** 결제 상태 */
export type PaymentStatus =
  /** 전액 취소 */
  | 'CANCELLED'
  /** 결제 실패 */
  | 'FAILED'
  /** 결제 완료 */
  | 'PAID'
  /** 부분 취소 */
  | 'PARTIAL_CANCELLED'
  /** 결제 대기 */
  | 'PENDING';

export type Query = {
  __typename?: 'Query';
  /** 결제 정보 조회 */
  payment: GetPaymentOutput;
  /** 결제 취소 내역 조회 */
  paymentCancellation: GetCancellationOutput;
  /** 결제 목록 조회 (필터링 및 페이지네이션 지원) */
  payments: GetPaymentsOutput;
};


export type QueryPaymentArgs = {
  input: GetPaymentInput;
};


export type QueryPaymentCancellationArgs = {
  input: GetCancellationInput;
};


export type QueryPaymentsArgs = {
  input?: InputMaybe<GetPaymentsInput>;
};

export type RefundAccountInput = {
  /** 은행 코드 */
  bank: Scalars['String']['input'];
  /** 예금주명 */
  holderName: Scalars['String']['input'];
  /** 예금주 연락처 (일부 결제사 필수) */
  holderPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** 계좌번호 */
  number: Scalars['String']['input'];
};

export type Reservation = {
  __typename?: 'Reservation';
  id: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int']['output'];
};

export type ErrorInfoFieldsFragment = { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null };

export type PaymentCancellationFieldsFragment = { __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null };

export type PaymentFieldsFragment = { __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> };

export type GetPaymentQueryVariables = Exact<{
  input: GetPaymentInput;
}>;


export type GetPaymentQuery = { __typename?: 'Query', payment: { __typename?: 'GetPaymentOutput', success?: boolean | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, payment?: { __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> } | null } };

export type GetPaymentsQueryVariables = Exact<{
  input?: InputMaybe<GetPaymentsInput>;
}>;


export type GetPaymentsQuery = { __typename?: 'Query', payments: { __typename?: 'GetPaymentsOutput', success?: boolean | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, data?: { __typename?: 'PaymentListData', total: number, hasMore: boolean, currentPageCount: number, totalPaidAmount: number, totalCancelledAmount: number, payments: Array<{ __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> }> } | null } };

export type GetPaymentCancellationQueryVariables = Exact<{
  input: GetCancellationInput;
}>;


export type GetPaymentCancellationQuery = { __typename?: 'Query', paymentCancellation: { __typename?: 'GetCancellationOutput', success?: boolean | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, cancellation?: { __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null, payment: { __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> } } | null } };

export type CreatePaymentMutationVariables = Exact<{
  input: CreatePaymentInput;
}>;


export type CreatePaymentMutation = { __typename?: 'Mutation', createPayment: { __typename?: 'CreatePaymentOutput', success?: boolean | null, creationMessage?: string | null, paymentPageUrl?: string | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, payment?: { __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> } | null } };

export type CompletePaymentMutationVariables = Exact<{
  input: CompletePaymentInput;
}>;


export type CompletePaymentMutation = { __typename?: 'Mutation', completePayment: { __typename?: 'CompletePaymentOutput', success?: boolean | null, completionMessage?: string | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, payment?: { __typename?: 'Payment', id: number, createdAt: string, updatedAt: string, portOneId: string, amount: number, currency: string, orderName: string, status: PaymentStatus, userId?: number | null, orderId?: number | null, reservationId?: number | null, guestEmail?: string | null, walkInId?: number | null, fuelWalkInId?: number | null, packageId?: number | null, portoneData?: any | null, customData?: any | null, paidAt?: string | null, cancellations: Array<{ __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null }> } | null } };

export type CancelPaymentMutationVariables = Exact<{
  input: CancelPaymentInput;
}>;


export type CancelPaymentMutation = { __typename?: 'Mutation', cancelPayment: { __typename?: 'CancelPaymentOutput', success?: boolean | null, cancellationMessage?: string | null, refundStatusMessage?: string | null, error?: { __typename?: 'ErrorInfo', code?: string | null, message: string, details?: string | null } | null, cancellation?: { __typename?: 'PaymentCancellation', id: number, createdAt: string, updatedAt: string, cancellationId: string, paymentId: number, cancelledAmount: number, reason?: string | null, status: CancellationStatus, refundAccount?: any | null, portoneData?: any | null, requestedAt: string, completedAt?: string | null } | null } };

export const ErrorInfoFieldsFragmentDoc = gql`
    fragment ErrorInfoFields on ErrorInfo {
  code
  message
  details
}
    `;
export const PaymentCancellationFieldsFragmentDoc = gql`
    fragment PaymentCancellationFields on PaymentCancellation {
  id
  createdAt
  updatedAt
  cancellationId
  paymentId
  cancelledAmount
  reason
  status
  refundAccount
  portoneData
  requestedAt
  completedAt
}
    `;
export const PaymentFieldsFragmentDoc = gql`
    fragment PaymentFields on Payment {
  id
  createdAt
  updatedAt
  portOneId
  amount
  currency
  orderName
  status
  userId
  orderId
  reservationId
  guestEmail
  walkInId
  fuelWalkInId
  packageId
  portoneData
  customData
  paidAt
  cancellations {
    ...PaymentCancellationFields
  }
}
    `;
export const GetPaymentDocument = gql`
    query GetPayment($input: GetPaymentInput!) {
  payment(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    payment {
      ...PaymentFields
    }
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}`;

/**
 * __useGetPaymentQuery__
 *
 * To run a query within a React component, call `useGetPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPaymentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables> & ({ variables: GetPaymentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
      }
export function useGetPaymentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
        }
export function useGetPaymentSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
        }
export type GetPaymentQueryHookResult = ReturnType<typeof useGetPaymentQuery>;
export type GetPaymentLazyQueryHookResult = ReturnType<typeof useGetPaymentLazyQuery>;
export type GetPaymentSuspenseQueryHookResult = ReturnType<typeof useGetPaymentSuspenseQuery>;
export type GetPaymentQueryResult = ApolloReactCommon.QueryResult<GetPaymentQuery, GetPaymentQueryVariables>;
export const GetPaymentsDocument = gql`
    query GetPayments($input: GetPaymentsInput) {
  payments(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    data {
      payments {
        ...PaymentFields
      }
      total
      hasMore
      currentPageCount
      totalPaidAmount
      totalCancelledAmount
    }
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}`;

/**
 * __useGetPaymentsQuery__
 *
 * To run a query within a React component, call `useGetPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPaymentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, options);
      }
export function useGetPaymentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, options);
        }
export function useGetPaymentsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, options);
        }
export type GetPaymentsQueryHookResult = ReturnType<typeof useGetPaymentsQuery>;
export type GetPaymentsLazyQueryHookResult = ReturnType<typeof useGetPaymentsLazyQuery>;
export type GetPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetPaymentsSuspenseQuery>;
export type GetPaymentsQueryResult = ApolloReactCommon.QueryResult<GetPaymentsQuery, GetPaymentsQueryVariables>;
export const GetPaymentCancellationDocument = gql`
    query GetPaymentCancellation($input: GetCancellationInput!) {
  paymentCancellation(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    cancellation {
      ...PaymentCancellationFields
      payment {
        ...PaymentFields
      }
    }
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}`;

/**
 * __useGetPaymentCancellationQuery__
 *
 * To run a query within a React component, call `useGetPaymentCancellationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentCancellationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentCancellationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPaymentCancellationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables> & ({ variables: GetPaymentCancellationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>(GetPaymentCancellationDocument, options);
      }
export function useGetPaymentCancellationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>(GetPaymentCancellationDocument, options);
        }
export function useGetPaymentCancellationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>(GetPaymentCancellationDocument, options);
        }
export type GetPaymentCancellationQueryHookResult = ReturnType<typeof useGetPaymentCancellationQuery>;
export type GetPaymentCancellationLazyQueryHookResult = ReturnType<typeof useGetPaymentCancellationLazyQuery>;
export type GetPaymentCancellationSuspenseQueryHookResult = ReturnType<typeof useGetPaymentCancellationSuspenseQuery>;
export type GetPaymentCancellationQueryResult = ApolloReactCommon.QueryResult<GetPaymentCancellationQuery, GetPaymentCancellationQueryVariables>;
export const CreatePaymentDocument = gql`
    mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    payment {
      ...PaymentFields
    }
    creationMessage
    paymentPageUrl
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}`;
export type CreatePaymentMutationFn = ApolloReactCommon.MutationFunction<CreatePaymentMutation, CreatePaymentMutationVariables>;

/**
 * __useCreatePaymentMutation__
 *
 * To run a mutation, you first call `useCreatePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentMutation, { data, loading, error }] = useCreatePaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePaymentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePaymentMutation, CreatePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePaymentDocument, options);
      }
export type CreatePaymentMutationHookResult = ReturnType<typeof useCreatePaymentMutation>;
export type CreatePaymentMutationResult = ApolloReactCommon.MutationResult<CreatePaymentMutation>;
export type CreatePaymentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePaymentMutation, CreatePaymentMutationVariables>;
export const CompletePaymentDocument = gql`
    mutation CompletePayment($input: CompletePaymentInput!) {
  completePayment(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    payment {
      ...PaymentFields
    }
    completionMessage
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}`;
export type CompletePaymentMutationFn = ApolloReactCommon.MutationFunction<CompletePaymentMutation, CompletePaymentMutationVariables>;

/**
 * __useCompletePaymentMutation__
 *
 * To run a mutation, you first call `useCompletePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompletePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completePaymentMutation, { data, loading, error }] = useCompletePaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompletePaymentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CompletePaymentMutation, CompletePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CompletePaymentMutation, CompletePaymentMutationVariables>(CompletePaymentDocument, options);
      }
export type CompletePaymentMutationHookResult = ReturnType<typeof useCompletePaymentMutation>;
export type CompletePaymentMutationResult = ApolloReactCommon.MutationResult<CompletePaymentMutation>;
export type CompletePaymentMutationOptions = ApolloReactCommon.BaseMutationOptions<CompletePaymentMutation, CompletePaymentMutationVariables>;
export const CancelPaymentDocument = gql`
    mutation CancelPayment($input: CancelPaymentInput!) {
  cancelPayment(input: $input) {
    error {
      ...ErrorInfoFields
    }
    success
    cancellation {
      ...PaymentCancellationFields
    }
    cancellationMessage
    refundStatusMessage
  }
}
    ${ErrorInfoFieldsFragmentDoc}
${PaymentCancellationFieldsFragmentDoc}`;
export type CancelPaymentMutationFn = ApolloReactCommon.MutationFunction<CancelPaymentMutation, CancelPaymentMutationVariables>;

/**
 * __useCancelPaymentMutation__
 *
 * To run a mutation, you first call `useCancelPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelPaymentMutation, { data, loading, error }] = useCancelPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelPaymentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelPaymentMutation, CancelPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelPaymentMutation, CancelPaymentMutationVariables>(CancelPaymentDocument, options);
      }
export type CancelPaymentMutationHookResult = ReturnType<typeof useCancelPaymentMutation>;
export type CancelPaymentMutationResult = ApolloReactCommon.MutationResult<CancelPaymentMutation>;
export type CancelPaymentMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelPaymentMutation, CancelPaymentMutationVariables>;