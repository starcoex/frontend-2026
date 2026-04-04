import { gql } from '@apollo/client';

// ============================================================
// Fragments
// ============================================================

export const ERROR_INFO_FRAGMENT = gql`
  fragment ErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const PAYMENT_CANCELLATION_FRAGMENT = gql`
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

export const PAYMENT_FRAGMENT = gql`
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
    portoneData
    customData
    paidAt
    cancellations {
      ...PaymentCancellationFields
    }
  }
  ${PAYMENT_CANCELLATION_FRAGMENT}
`;

// ============================================================
// Queries
// ============================================================

export const GET_PAYMENT = gql`
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
  ${PAYMENT_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;

export const GET_PAYMENTS = gql`
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
  ${PAYMENT_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;

export const GET_PAYMENT_CANCELLATION = gql`
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
  ${PAYMENT_CANCELLATION_FRAGMENT}
  ${PAYMENT_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;

// ============================================================
// Mutations
// ============================================================

export const CREATE_PAYMENT = gql`
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
  ${PAYMENT_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;

export const COMPLETE_PAYMENT = gql`
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
  ${PAYMENT_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;

export const CANCEL_PAYMENT = gql`
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
  ${PAYMENT_CANCELLATION_FRAGMENT}
  ${ERROR_INFO_FRAGMENT}
`;
