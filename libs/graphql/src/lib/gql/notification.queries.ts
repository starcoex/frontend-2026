import { gql } from '@apollo/client';

// ===== Fragments =====

export const NOTIFICATION_ERROR_INFO_FIELDS = gql`
  fragment NotificationErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    id
    deletedAt
    createdAt
    updatedAt
    userId
    title
    message
    type
    status
    readAt
    relatedEntityType
    relatedEntityId
    actionUrl
    templateName
    templateData
    emailId
    metadata
    scheduledAt
    expiresAt
  }
`;

export const EMAIL_FIELDS = gql`
  fragment EmailFields on Email {
    id
    deletedAt
    createdAt
    updatedAt
    fromEmail
    fromName
    toEmail
    toName
    subject
    content
    templateName
    templateData
    status
    priority
    scheduledAt
    sentAt
    failedAt
    provider
    externalMessageId
    errorMessage
    retryCount
    source
    metadata
    userId
  }
`;

// ===== Queries =====

// 내 알림 목록 조회
export const GET_MY_NOTIFICATIONS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${NOTIFICATION_FIELDS}
  query GetMyNotifications($input: GetNotificationsInput!) {
    getMyNotifications(input: $input) {
      success
      message
      totalCount
      unreadCount
      hasNextPage
      currentPage
      error {
        ...NotificationErrorInfoFields
      }
      notifications {
        ...NotificationFields
      }
    }
  }
`;

// 내 알림 통계 조회
export const GET_MY_NOTIFICATION_STATS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  query GetMyNotificationStats {
    getMyNotificationStats {
      success
      message
      total
      read
      unread
      archived
      deleted
      error {
        ...NotificationErrorInfoFields
      }
    }
  }
`;

// 알림 검색
export const SEARCH_NOTIFICATIONS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${NOTIFICATION_FIELDS}
  query SearchNotifications($query: String!, $limit: Int! = 20) {
    searchNotifications(query: $query, limit: $limit) {
      success
      message
      totalCount
      unreadCount
      hasNextPage
      currentPage
      error {
        ...NotificationErrorInfoFields
      }
      notifications {
        ...NotificationFields
      }
    }
  }
`;

// 관리자용 전체 알림 통계
export const GET_ADMIN_NOTIFICATION_STATS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  query GetAdminNotificationStats {
    getAdminNotificationStats {
      success
      message
      total
      read
      unread
      archived
      deleted
      error {
        ...NotificationErrorInfoFields
      }
    }
  }
`;

// 읽지 않은 알림 목록
export const GET_UNREAD_NOTIFICATIONS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${NOTIFICATION_FIELDS}
  query GetUnreadNotifications($limit: Int! = 20) {
    getUnreadNotifications(limit: $limit) {
      success
      message
      totalCount
      unreadCount
      hasNextPage
      currentPage
      error {
        ...NotificationErrorInfoFields
      }
      notifications {
        ...NotificationFields
      }
    }
  }
`;

// 이메일 목록 조회
export const GET_EMAILS = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${EMAIL_FIELDS}
  query GetEmails($input: GetEmailsInput!) {
    getEmails(input: $input) {
      success
      message
      totalCount
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
      error {
        ...NotificationErrorInfoFields
      }
      emails {
        ...EmailFields
      }
    }
  }
`;

// 이메일 단건 조회
export const GET_EMAIL_BY_ID = gql`
  ${EMAIL_FIELDS}
  query GetEmailById($id: Int!) {
    getEmailById(id: $id) {
      ...EmailFields
    }
  }
`;

// 이메일 검색 (서버에서 JSON/string 반환)
export const SEARCH_EMAILS = gql`
  query SearchEmails(
    $toEmail: String
    $subject: String
    $templateName: String
    $status: String
    $limit: Float
    $offset: Float
  ) {
    searchEmails(
      toEmail: $toEmail
      subject: $subject
      templateName: $templateName
      status: $status
      limit: $limit
      offset: $offset
    )
  }
`;

// 이메일 발송 통계
export const GET_EMAIL_STATS = gql`
  query GetEmailStats {
    getEmailStats
  }
`;

// 이메일 서비스 상태 체크
export const EMAIL_HEALTH_CHECK = gql`
  query EmailHealthCheck {
    emailHealthCheck
  }
`;

// ===== Mutations =====

// 알림 + 이메일(선택) 발송
export const SEND_EMAIL_NOTIFICATION = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${NOTIFICATION_FIELDS}
  mutation SendEmailNotification($input: CreateNotificationInput!) {
    sendEmailNotification(input: $input) {
      success
      message
      deliveryMessage
      emailSent
      error {
        ...NotificationErrorInfoFields
      }
      notification {
        ...NotificationFields
      }
    }
  }
`;

// 알림 읽음 처리 (Input 사용)
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput!) {
    markNotificationAsRead(input: $input)
  }
`;

// 알림 삭제 (Input 사용)
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($input: DeleteNotificationInput!) {
    deleteNotification(input: $input)
  }
`;

// 모든 읽지 않은 알림 읽음 처리
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllAsRead
  }
`;

// 간편 읽음 처리 (ID만)
export const MARK_AS_READ = gql`
  mutation MarkAsRead($notificationId: Int!) {
    markAsRead(notificationId: $notificationId)
  }
`;

// 간편 삭제 (ID만)
export const DELETE_NOTIFICATION_BY_ID = gql`
  mutation DeleteNotificationById($notificationId: Int!) {
    deleteById(notificationId: $notificationId)
  }
`;

// 이메일 발송
export const SEND_EMAIL = gql`
  ${NOTIFICATION_ERROR_INFO_FIELDS}
  ${EMAIL_FIELDS}
  mutation SendEmail($input: SendEmailInput!) {
    sendEmail(input: $input) {
      success
      message
      statusMessage
      error {
        ...NotificationErrorInfoFields
      }
      email {
        ...EmailFields
      }
    }
  }
`;

// 실패한 이메일 재발송
export const RETRY_EMAIL = gql`
  mutation RetryEmail($emailId: Int!) {
    retryEmail(emailId: $emailId)
  }
`;
