import { gql } from '@apollo/client';

// ============================================================================
// Fragments
// ============================================================================

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFields on Notification {
    id
    userId
    title
    message
    type
    status
    channel
    readAt
    relatedEntityType
    relatedEntityId
    actionUrl
    templateName
    templateData
    emailId
    retryCount
    maxRetries
    failReason
    metadata
    scheduledAt
    expiresAt
    createdAt
    updatedAt
    deletedAt
  }
`;

export const EMAIL_FRAGMENT = gql`
  fragment EmailFields on Email {
    id
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
    createdAt
    updatedAt
    deletedAt
  }
`;

// ============================================================================
// Notification Queries
// ============================================================================

export const GET_MY_NOTIFICATIONS = gql`
  ${NOTIFICATION_FRAGMENT}
  query GetMyNotifications($input: GetNotificationsInput!) {
    getMyNotifications(input: $input) {
      success
      error {
        code
        message
        details
      }
      notifications {
        ...NotificationFields
      }
      totalCount
      unreadCount
      hasNextPage
      currentPage
      message
    }
  }
`;

export const GET_MY_NOTIFICATION_STATS = gql`
  query GetMyNotificationStats {
    getMyNotificationStats {
      success
      error {
        code
        message
        details
      }
      total
      read
      unread
      archived
      deleted
      message
    }
  }
`;

export const SEARCH_NOTIFICATIONS = gql`
  ${NOTIFICATION_FRAGMENT}
  query SearchNotifications($query: String!, $limit: Int!) {
    searchNotifications(query: $query, limit: $limit) {
      success
      error {
        code
        message
        details
      }
      notifications {
        ...NotificationFields
      }
      totalCount
      unreadCount
      hasNextPage
      currentPage
      message
    }
  }
`;

export const GET_ADMIN_NOTIFICATION_STATS = gql`
  query GetAdminNotificationStats {
    getAdminNotificationStats {
      success
      error {
        code
        message
        details
      }
      total
      read
      unread
      archived
      deleted
      message
    }
  }
`;

export const ADMIN_GET_ALL_NOTIFICATIONS = gql`
  ${NOTIFICATION_FRAGMENT}
  query AdminGetAllNotifications($input: GetAllNotificationsInput) {
    adminGetAllNotifications(input: $input) {
      success
      error {
        code
        message
        details
      }
      notifications {
        ...NotificationFields
      }
      totalCount
      unreadCount
      hasNextPage
      currentPage
      message
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS = gql`
  ${NOTIFICATION_FRAGMENT}
  query GetUnreadNotifications($limit: Int!) {
    getUnreadNotifications(limit: $limit) {
      success
      error {
        code
        message
        details
      }
      notifications {
        ...NotificationFields
      }
      totalCount
      unreadCount
      hasNextPage
      currentPage
      message
    }
  }
`;

// ============================================================================
// Notification Mutations
// ============================================================================

export const SEND_EMAIL_NOTIFICATION = gql`
  ${NOTIFICATION_FRAGMENT}
  mutation SendEmailNotification($input: CreateNotificationInput!) {
    sendEmailNotification(input: $input) {
      success
      error {
        code
        message
        details
      }
      notification {
        ...NotificationFields
      }
      deliveryMessage
      emailSent
      message
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput!) {
    markNotificationAsRead(input: $input)
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($input: DeleteNotificationInput!) {
    deleteNotification(input: $input)
  }
`;

export const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllAsRead
  }
`;

export const MARK_AS_READ = gql`
  mutation MarkAsRead($notificationId: Int!) {
    markAsRead(notificationId: $notificationId)
  }
`;

export const DELETE_BY_ID = gql`
  mutation DeleteById($notificationId: Int!) {
    deleteById(notificationId: $notificationId)
  }
`;

// ============================================================================
// Email Queries
// ============================================================================

export const GET_EMAILS = gql`
  ${EMAIL_FRAGMENT}
  query GetEmails($input: GetEmailsInput!) {
    getEmails(input: $input) {
      success
      error {
        code
        message
        details
      }
      emails {
        ...EmailFields
      }
      totalCount
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
      message
    }
  }
`;

export const GET_EMAIL_BY_ID = gql`
  ${EMAIL_FRAGMENT}
  query GetEmailById($id: Int!) {
    getEmailById(id: $id) {
      ...EmailFields
    }
  }
`;

// ============================================================================
// Email Mutations
// ============================================================================

export const SEND_EMAIL = gql`
  ${EMAIL_FRAGMENT}
  mutation SendEmail($input: SendEmailInput!) {
    sendEmail(input: $input) {
      success
      error {
        code
        message
        details
      }
      email {
        ...EmailFields
      }
      message
      statusMessage
    }
  }
`;

export const RETRY_EMAIL = gql`
  mutation RetryEmail($emailId: Int!) {
    retryEmail(emailId: $emailId)
  }
`;
