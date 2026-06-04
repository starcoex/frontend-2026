import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const CHAT_ERROR_INFO_FIELDS = gql`
  fragment ChatErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const CHAT_PARTICIPANT_FIELDS = gql`
  fragment ChatParticipantFields on ChatParticipant {
    id
    deletedAt
    createdAt
    updatedAt
    roomId
    userId
    guestId
    role
    isOnline
    lastSeenAt
    lastReadAt
    notificationEnabled
    joinedAt
    leftAt
    displayName
  }
`;

export const CHAT_MESSAGE_FIELDS = gql`
  fragment ChatMessageFields on ChatMessage {
    id
    deletedAt
    createdAt
    updatedAt
    roomId
    senderId
    content
    type
    replyToId
    imageUrl
    fileUrl
    fileName
    fileSize
    location
    readBy
    isEdited
    isDeleted
    editedAt
    deletedBy
  }
`;

/**
 * ChatRoom Fragment
 * - participants, messages 관계는 목록 조회 시 성능을 위해 최소화
 */
export const CHAT_ROOM_FIELDS = gql`
  ${CHAT_PARTICIPANT_FIELDS}
  fragment ChatRoomFields on ChatRoom {
    id
    deletedAt
    createdAt
    updatedAt
    title
    description
    type
    status
    category
    chatPriority
    tags
    orderId
    deliveryId
    storeId
    vehicleId
    createdByUserId
    createdByGuestId
    statusDisplayName
    typeDisplayName
    isAutoAssign
    allowGuest
    maxParticipants
    deletedBy
    participants {
      ...ChatParticipantFields
    }
  }
`;

/**
 * ChatRoom with Messages Fragment
 * - 상세 조회 시 messages 포함
 */
export const CHAT_ROOM_DETAIL_FIELDS = gql`
  ${CHAT_PARTICIPANT_FIELDS}
  ${CHAT_MESSAGE_FIELDS}
  fragment ChatRoomDetailFields on ChatRoom {
    id
    deletedAt
    createdAt
    updatedAt
    title
    description
    type
    status
    category
    chatPriority
    tags
    orderId
    deliveryId
    storeId
    vehicleId
    createdByUserId
    createdByGuestId
    statusDisplayName
    typeDisplayName
    isAutoAssign
    allowGuest
    maxParticipants
    deletedBy
    participants {
      ...ChatParticipantFields
    }
    messages {
      ...ChatMessageFields
    }
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const ADMIN_CHAT_ROOMS = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_ROOM_FIELDS}
  query AdminChatRooms($input: GetChatRoomsInput) {
    adminChatRooms(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatRooms {
        ...ChatRoomFields
      }
      totalCount
      currentPage
      totalPages
      hasNext
      hasPrev
      unreadRoomsCount
    }
  }
`;

export const GET_MY_CHAT_ROOMS = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_ROOM_FIELDS}
  query GetMyChatRooms($input: GetChatRoomsInput) {
    getMyChatRooms(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatRooms {
        ...ChatRoomFields
      }
      totalCount
      currentPage
      totalPages
      hasNext
      hasPrev
      unreadRoomsCount
    }
  }
`;

export const GET_CHAT_ROOM = gql`
  ${CHAT_ROOM_DETAIL_FIELDS}
  query GetChatRoom($roomId: Int!) {
    getChatRoom(roomId: $roomId) {
      ...ChatRoomDetailFields
    }
  }
`;

export const CHAT_ROOM_STATS = gql`
  query ChatRoomStats {
    chatRoomStats {
      total
      active
      waiting
      inProgress
      resolved
      closed
      archived
      deleted
      byType
    }
  }
`;

export const ADMIN_CHAT_MESSAGES = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_MESSAGE_FIELDS}
  query AdminChatMessages($input: GetMessagesInput!) {
    adminChatMessages(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatMessages {
        ...ChatMessageFields
      }
      hasMore
      nextCursor
      messageCount
      unreadCount
      lastReadAt
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_MESSAGE_FIELDS}
  query GetChatMessages($input: GetMessagesInput!) {
    getChatMessages(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatMessages {
        ...ChatMessageFields
      }
      hasMore
      nextCursor
      messageCount
      unreadCount
      lastReadAt
    }
  }
`;

export const CHAT_MESSAGE_STATS = gql`
  query ChatMessageStats {
    chatMessageStats {
      total
      active
      deleted
      byType
    }
  }
`;

export const GET_CHAT_PARTICIPANTS = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_PARTICIPANT_FIELDS}
  query GetChatParticipants($roomId: Int!, $input: GetParticipantsInput) {
    getChatParticipants(roomId: $roomId, input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      participants {
        ...ChatParticipantFields
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_CHAT_ROOM = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_ROOM_FIELDS}
  mutation CreateChatRoom($input: CreateChatRoomInput!) {
    createChatRoom(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatRoom {
        ...ChatRoomFields
      }
      message
      autoAssignmentStarted
      estimatedWaitTime
    }
  }
`;

export const UPDATE_CHAT_ROOM_STATUS = gql`
  ${CHAT_ROOM_FIELDS}
  mutation UpdateChatRoomStatus($roomId: Int!, $status: String!) {
    updateChatRoomStatus(roomId: $roomId, status: $status) {
      ...ChatRoomFields
    }
  }
`;

export const DELETE_CHAT_ROOM = gql`
  mutation DeleteChatRoom($roomId: Int!, $hardDelete: Boolean!) {
    deleteChatRoom(roomId: $roomId, hardDelete: $hardDelete)
  }
`;

export const BULK_DELETE_CHAT_ROOMS = gql`
  mutation BulkDeleteChatRooms($ids: [Int!]!, $hardDelete: Boolean!) {
    bulkDeleteChatRooms(ids: $ids, hardDelete: $hardDelete) {
      success
      message
      successCount
      failCount
      failedIds
    }
  }
`;

export const SEND_MESSAGE = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_MESSAGE_FIELDS}
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      chatMessage {
        ...ChatMessageFields
      }
      deliveredAt
      autoReplyTriggered
      suggestedReplies
      statusMessage
    }
  }
`;

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessagesAsRead($roomId: Int!, $messageIds: [Int!]!) {
    markMessagesAsRead(roomId: $roomId, messageIds: $messageIds)
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: Int!, $hardDelete: Boolean!) {
    deleteMessage(messageId: $messageId, hardDelete: $hardDelete)
  }
`;

export const BULK_DELETE_MESSAGES = gql`
  mutation BulkDeleteMessages($messageIds: [Int!]!, $hardDelete: Boolean!) {
    bulkDeleteMessages(messageIds: $messageIds, hardDelete: $hardDelete) {
      success
      message
      successCount
      failCount
      failedIds
    }
  }
`;

export const JOIN_CHAT_ROOM = gql`
  ${CHAT_ERROR_INFO_FIELDS}
  ${CHAT_PARTICIPANT_FIELDS}
  mutation JoinChatRoom($input: JoinChatRoomInput!) {
    joinChatRoom(input: $input) {
      error {
        ...ChatErrorInfoFields
      }
      success
      participant {
        ...ChatParticipantFields
      }
      message
      isRejoin
      currentParticipantCount
      welcomeMessages
    }
  }
`;

export const LEAVE_CHAT_ROOM = gql`
  mutation LeaveChatRoom($participantId: Int!) {
    leaveChatRoom(participantId: $participantId)
  }
`;

export const UPDATE_ONLINE_STATUS = gql`
  ${CHAT_PARTICIPANT_FIELDS}
  mutation UpdateOnlineStatus($participantId: Int!, $isOnline: Boolean!) {
    updateOnlineStatus(participantId: $participantId, isOnline: $isOnline) {
      ...ChatParticipantFields
    }
  }
`;

export const KICK_PARTICIPANT = gql`
  mutation KickParticipant($participantId: Int!, $reason: String) {
    kickParticipant(participantId: $participantId, reason: $reason)
  }
`;

export const UPDATE_PARTICIPANT_ROLE = gql`
  ${CHAT_PARTICIPANT_FIELDS}
  mutation UpdateParticipantRole($participantId: Int!, $newRole: String!) {
    updateParticipantRole(participantId: $participantId, newRole: $newRole) {
      ...ChatParticipantFields
    }
  }
`;

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  ${CHAT_PARTICIPANT_FIELDS}
  mutation UpdateNotificationSettings(
    $participantId: Int!
    $notificationEnabled: Boolean!
  ) {
    updateNotificationSettings(
      participantId: $participantId
      notificationEnabled: $notificationEnabled
    ) {
      ...ChatParticipantFields
    }
  }
`;

// ── 신규: updateChatRoom Mutation ─────────────────────────────────────────────
export const UPDATE_CHAT_ROOM = gql`
  ${CHAT_ROOM_FIELDS}
  mutation UpdateChatRoom($input: UpdateChatRoomInput!) {
    updateChatRoom(input: $input) {
      ...ChatRoomFields
    }
  }
`;

// ── 신규: GraphQL Subscriptions ───────────────────────────────────────────────
export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  ${CHAT_MESSAGE_FIELDS}
  subscription MessageAdded($roomId: Int!) {
    messageAdded(roomId: $roomId) {
      ...ChatMessageFields
    }
  }
`;

export const MESSAGE_DELETED_SUBSCRIPTION = gql`
  subscription MessageDeleted($roomId: Int!) {
    messageDeleted(roomId: $roomId)
  }
`;
