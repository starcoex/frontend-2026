// libs/graphql/src/lib/queue/queue.queries.ts

import { gql } from '@apollo/client';

// ── Fragments ────────────────────────────────────────────────────────────────

export const QUEUE_ERROR_INFO_FIELDS = gql`
  fragment QueueErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const QUEUE_STATS_FIELDS = gql`
  fragment QueueStatsFields on QueueStats {
    storeId
    waitingCount
    avgDurationSec
    todayTotal
    isOpen
    estimatedWaitMin
  }
`;

// ✅ guestName, guestPhone, guestVehicleNumber 추가
export const QUEUE_SESSION_FIELDS = gql`
  fragment QueueSessionFields on QueueSession {
    id
    createdAt
    updatedAt
    deletedAt
    storeId
    serviceId
    walkInId
    userId
    guestName
    guestPhone
    guestVehicleNumber
    ticketNumber
    redisTicketId
    position
    estimatedEntryAt
    actualEntryAt
    completedAt
    status
    durationSec
  }
`;

// ── Queries ───────────────────────────────────────────────────────────────────

export const GET_QUEUE_STATS = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_STATS_FIELDS}
  query GetQueueStats($input: GetQueueStatsInput!) {
    getQueueStats(input: $input) {
      success
      error {
        ...QueueErrorInfoFields
      }
      stats {
        ...QueueStatsFields
      }
    }
  }
`;

export const GET_INTEGRATED_QUEUE_STATS = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_STATS_FIELDS}
  query GetIntegratedQueueStats($input: GetIntegratedStatsInput!) {
    getIntegratedQueueStats(input: $input) {
      success
      error {
        ...QueueErrorInfoFields
      }
      stats {
        ...QueueStatsFields
      }
    }
  }
`;

export const FIND_QUEUE_SESSIONS = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  query FindQueueSessions($input: FindQueueSessionsInput!) {
    findQueueSessions(input: $input) {
      success
      total
      error {
        ...QueueErrorInfoFields
      }
      sessions {
        ...QueueSessionFields
      }
    }
  }
`;

export const GET_QUEUE_SESSION = gql`
  ${QUEUE_SESSION_FIELDS}
  query GetQueueSession($id: Int!) {
    getQueueSession(id: $id) {
      ...QueueSessionFields
    }
  }
`;

// ── Mutations ─────────────────────────────────────────────────────────────────

// ✅ 회원 접수 (Guard 있음)
export const CREATE_QUEUE_SESSION = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  ${QUEUE_STATS_FIELDS}
  mutation CreateQueueSession($input: CreateQueueSessionInput!) {
    createQueueSession(input: $input) {
      success
      message
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
      stats {
        ...QueueStatsFields
      }
    }
  }
`;

// ✅ 비회원 접수 (Guard 없음 — 키오스크/고객 앱)
export const CREATE_GUEST_QUEUE_SESSION = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  ${QUEUE_STATS_FIELDS}
  mutation CreateGuestQueueSession($input: CreateQueueSessionInput!) {
    createGuestQueueSession(input: $input) {
      success
      message
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
      stats {
        ...QueueStatsFields
      }
    }
  }
`;

// ✅ 관리자 수기 등록 (Guard 있음 — admin-dashboard)
export const CREATE_QUEUE_SESSION_BY_ADMIN = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  ${QUEUE_STATS_FIELDS}
  mutation CreateQueueSessionByAdmin($input: CreateQueueSessionInput!) {
    createQueueSessionByAdmin(input: $input) {
      success
      message
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
      stats {
        ...QueueStatsFields
      }
    }
  }
`;

export const CALL_NEXT = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  mutation CallNext($input: CallNextInput!) {
    callNext(input: $input) {
      success
      message
      ticketId
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
    }
  }
`;

export const COMPLETE_QUEUE_SERVICE = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  mutation CompleteQueueService($input: CompleteServiceInput!) {
    completeQueueService(input: $input) {
      success
      message
      ticketId
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
    }
  }
`;

export const CANCEL_QUEUE_TICKET = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  mutation CancelQueueTicket($input: CancelTicketInput!) {
    cancelQueueTicket(input: $input) {
      success
      message
      ticketId
      error {
        ...QueueErrorInfoFields
      }
    }
  }
`;

// ✅ 실제 스키마 기준 — id + 비회원 3개 필드만
export const UPDATE_QUEUE_SESSION = gql`
  ${QUEUE_ERROR_INFO_FIELDS}
  ${QUEUE_SESSION_FIELDS}
  mutation UpdateQueueSession($input: UpdateQueueSessionInput!) {
    updateQueueSession(input: $input) {
      success
      message
      ticketId
      error {
        ...QueueErrorInfoFields
      }
      session {
        ...QueueSessionFields
      }
    }
  }
`;
