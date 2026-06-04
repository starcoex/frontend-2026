import { ApiResponse } from './common.types';

export type ParticipantRole =
  | 'GUEST'
  | 'CUSTOMER'
  | 'SUPPORT_AGENT'
  | 'SUPERVISOR'
  | 'SYSTEM'
  | 'BOT';

export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'FILE'
  | 'LOCATION'
  | 'SYSTEM'
  | 'AUTO_REPLY'
  | 'QUICK_REPLY';

export type ChatRoomType =
  | 'CUSTOMER_SUPPORT'
  | 'ORDER_INQUIRY'
  | 'DELIVERY_SUPPORT'
  | 'TECHNICAL_SUPPORT'
  | 'GROUP_CHAT'
  | 'PRIVATE_CHAT'
  | 'GUEST_SUPPORT';

export type ChatRoomStatus =
  | 'ACTIVE'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type SupportCategory =
  | 'ORDER_INQUIRY'
  | 'DELIVERY_INQUIRY'
  | 'PAYMENT_INQUIRY'
  | 'PRODUCT_INQUIRY'
  | 'REFUND_REQUEST'
  | 'TECHNICAL_SUPPORT'
  | 'GENERAL_INQUIRY'
  | 'COMPLAINT';

export type ChatPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface ChatParticipant {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  roomId: number;
  userId?: number | null;
  guestId?: number | null;
  role: ParticipantRole;
  isOnline: boolean;
  lastSeenAt?: string | null;
  lastReadAt?: string | null;
  notificationEnabled: boolean;
  joinedAt: string;
  leftAt?: string | null;
  displayName?: string | null;
}

export interface ChatMessage {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  roomId: number;
  senderId: number;
  content: string;
  type: MessageType;
  replyToId?: number | null;
  imageUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  location?: Record<string, unknown> | null;
  readBy: number[];
  isEdited: boolean;
  isDeleted: boolean;
  editedAt?: string | null;
  deletedBy?: number | null;
}

export interface ChatRoom {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string | null;
  type: ChatRoomType;
  status: ChatRoomStatus;
  category?: SupportCategory | null;
  chatPriority?: ChatPriority | null;
  tags: string[];
  orderId?: number | null;
  deliveryId?: number | null;
  storeId?: number | null;
  vehicleId?: number | null;
  createdByUserId?: number | null;
  createdByGuestId?: number | null;
  participants?: ChatParticipant[] | null;
  messages?: ChatMessage[] | null;
  statusDisplayName?: string | null;
  typeDisplayName?: string | null;
  isAutoAssign: boolean;
  allowGuest: boolean;
  maxParticipants: number;
  deletedBy?: number | null;
}

// ============================================================================
// ErrorInfo
// ============================================================================

export interface ChatErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// OverviewOrderStatus 타입
// ============================================================================

export interface ChatRoomSummaryStats {
  total: number;
  active: number;
  waiting: number;
  inProgress: number;
  resolved: number;
  closed: number;
  archived: number;
  deleted: number;
  byType: Record<string, unknown>;
}

export interface ChatMessageSummaryStats {
  total: number;
  active: number;
  deleted: number;
  byType: Record<string, unknown>;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetChatRoomsInput {
  status?: ChatRoomStatus;
  type?: ChatRoomType;
  category?: SupportCategory;
  chatPriority?: ChatPriority;
  orderId?: number;
  storeId?: number;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  onlyMyRooms?: boolean;
  hasUnreadMessages?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  includeDeleted?: boolean;
}

export interface GetMessagesInput {
  roomId: number;
  cursor?: string; // ✅ 백엔드 지원 커서 (afterId 제거)
  limit?: number;
  messageType?: MessageType;
  senderId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  hasMedia?: boolean;
  hasFiles?: boolean;
  hasLocation?: boolean;
  includeDeleted?: boolean;
  onlyEdited?: boolean;
  sortOrder?: string;
  onlyReplies?: boolean;
  replyToMessageId?: number;
}

export interface GetParticipantsInput {
  roomId: number;
  includeLeft?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateChatRoomInput {
  title: string;
  description?: string;
  type: ChatRoomType;
  category?: SupportCategory;
  chatPriority?: ChatPriority;
  tags?: string[];
  orderId?: number;
  deliveryId?: number;
  storeId?: number;
  vehicleId?: number;
  isAutoAssign?: boolean;
  allowGuest?: boolean;
  maxParticipants?: number;
  participantUserIds?: number[];
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  pageUrl?: string;
  userAgent?: string;
  keywords?: string[];
}

// ── UpdateChatRoomInput 신규 추가 ────────────────────────────────────────────
export interface UpdateChatRoomInput {
  roomId: number;
  title?: string;
  description?: string;
  category?: SupportCategory;
  chatPriority?: ChatPriority;
  tags?: string[];
  orderId?: number;
  deliveryId?: number;
  storeId?: number;
  vehicleId?: number;
  isAutoAssign?: boolean;
  allowGuest?: boolean;
  maxParticipants?: number;
  participantUserIds?: number[];
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  pageUrl?: string;
  userAgent?: string;
  keywords?: string[];
}

export interface SendMessageInput {
  content: string;
  type?: MessageType;
  roomId: number;
  replyToId?: number;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  location?: Record<string, unknown>;
  quickReplies?: string[];
  metadata?: Record<string, unknown>;
  deviceInfo?: string;
  isTemporary?: boolean;
  autoDeleteAfter?: number;
}

export interface JoinChatRoomInput {
  roomId: number;
  role?: ParticipantRole;
  additionalUserIds?: number[];
  joinMessage?: string;
  notificationEnabled?: boolean;
  displayName?: string; // ✅ 신규 추가 — 채팅방에서 표시될 실명
  guestName?: string;
  guestEmail?: string;
  joinContext?: string;
  invitationCode?: string;
  invitedBy?: number;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface GetChatRoomsOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  chatRooms: ChatRoom[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  unreadRoomsCount?: number | null;
}

export interface CreateChatRoomOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  chatRoom?: ChatRoom | null;
  message?: string | null;
  autoAssignmentStarted?: boolean | null;
  estimatedWaitTime?: number | null;
}

export interface BulkDeleteChatRoomsOutput {
  success: boolean;
  message: string;
  successCount: number;
  failCount: number;
  failedIds: number[];
}

export interface SendMessageOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  chatMessage?: ChatMessage | null;
  deliveredAt?: string | null;
  autoReplyTriggered?: boolean | null;
  suggestedReplies?: string[] | null;
  statusMessage?: string | null;
}

export interface GetMessagesOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  chatMessages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string | null;
  messageCount?: number | null;
  unreadCount?: number | null;
  lastReadAt?: string | null;
}

export interface BulkDeleteMessagesOutput {
  success: boolean;
  message: string;
  successCount: number;
  failCount: number;
  failedIds: number[];
}

export interface JoinChatRoomOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  participant?: ChatParticipant | null;
  message?: string | null;
  isRejoin?: boolean | null;
  currentParticipantCount?: number | null;
  welcomeMessages?: string[] | null;
}

export interface GetParticipantsOutput {
  error?: ChatErrorInfo | null;
  success?: boolean | null;
  participants?: ChatParticipant[] | null;
  totalCount?: number | null;
  currentPage?: number | null;
  totalPages?: number | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IChatService {
  // Queries
  adminChatRooms(
    input?: GetChatRoomsInput
  ): Promise<ApiResponse<GetChatRoomsOutput>>;
  getMyChatRooms(
    input?: GetChatRoomsInput
  ): Promise<ApiResponse<GetChatRoomsOutput>>;
  getChatRoom(roomId: number): Promise<ApiResponse<ChatRoom>>;
  chatRoomStats(): Promise<ApiResponse<ChatRoomSummaryStats>>;
  adminChatMessages(
    input: GetMessagesInput
  ): Promise<ApiResponse<GetMessagesOutput>>;
  getChatMessages(
    input: GetMessagesInput
  ): Promise<ApiResponse<GetMessagesOutput>>;
  chatMessageStats(): Promise<ApiResponse<ChatMessageSummaryStats>>;
  getChatParticipants(
    roomId: number,
    input?: Omit<GetParticipantsInput, 'roomId'>
  ): Promise<ApiResponse<GetParticipantsOutput>>;
  // Mutations
  createChatRoom(
    input: CreateChatRoomInput
  ): Promise<ApiResponse<CreateChatRoomOutput>>;
  updateChatRoom(input: UpdateChatRoomInput): Promise<ApiResponse<ChatRoom>>;
  updateChatRoomStatus(
    roomId: number,
    status: string
  ): Promise<ApiResponse<ChatRoom>>;
  deleteChatRoom(
    roomId: number,
    hardDelete?: boolean
  ): Promise<ApiResponse<string>>;
  bulkDeleteChatRooms(
    ids: number[],
    hardDelete?: boolean
  ): Promise<ApiResponse<BulkDeleteChatRoomsOutput>>;
  sendMessage(input: SendMessageInput): Promise<ApiResponse<SendMessageOutput>>;
  markMessagesAsRead(
    roomId: number,
    messageIds: number[]
  ): Promise<ApiResponse<number>>;
  deleteMessage(
    messageId: number,
    hardDelete?: boolean
  ): Promise<ApiResponse<string>>;
  bulkDeleteMessages(
    messageIds: number[],
    hardDelete?: boolean
  ): Promise<ApiResponse<BulkDeleteMessagesOutput>>;
  joinChatRoom(
    input: JoinChatRoomInput
  ): Promise<ApiResponse<JoinChatRoomOutput>>;
  leaveChatRoom(participantId: number): Promise<ApiResponse<string>>;
  updateOnlineStatus(
    participantId: number,
    isOnline: boolean
  ): Promise<ApiResponse<ChatParticipant>>;
  kickParticipant(
    participantId: number,
    reason?: string
  ): Promise<ApiResponse<string>>;
  updateParticipantRole(
    participantId: number,
    newRole: string
  ): Promise<ApiResponse<ChatParticipant>>;
  updateNotificationSettings(
    participantId: number,
    notificationEnabled: boolean
  ): Promise<ApiResponse<ChatParticipant>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export type ChatFilters = GetChatRoomsInput;

export interface ChatState {
  chatRooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messagesByRoom: Record<number, ChatMessage[]>; // ✅ currentMessages 대체 (클라이언트 캐시)
  currentParticipants: ChatParticipant[];
  roomStats: ChatRoomSummaryStats | null;
  messageStats: ChatMessageSummaryStats | null;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    unreadRoomsCount?: number | null;
  };
  messagePagination: {
    hasMore: boolean;
    nextCursor: string | null;
    unreadCount: number | null;
  };
  filters: ChatFilters;
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextActions {
  setChatRooms: (rooms: ChatRoom[]) => void;
  addChatRoom: (room: ChatRoom) => void;
  updateChatRoomInContext: (id: number, updates: Partial<ChatRoom>) => void;
  removeChatRoom: (id: number) => void;
  setCurrentRoom: (room: ChatRoom | null) => void;
  // ✅ setCurrentMessages 제거, 캐시 기반 액션으로 교체
  setMessagesByRoom: (roomId: number, messages: ChatMessage[]) => void;
  appendMessagesByRoom: (roomId: number, messages: ChatMessage[]) => void;
  clearMessagesByRoom: (roomId: number) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessageInContext: (id: number, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: number) => void;
  setCurrentParticipants: (participants: ChatParticipant[]) => void;
  updateParticipantInContext: (
    id: number,
    updates: Partial<ChatParticipant>
  ) => void;
  setRoomStats: (stats: ChatRoomSummaryStats | null) => void;
  setMessageStats: (stats: ChatMessageSummaryStats | null) => void;
  setPagination: (pagination: ChatState['pagination']) => void;
  setMessagePagination: (pagination: ChatState['messagePagination']) => void;
  setFilters: (filters: Partial<ChatFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ChatContextValue = ChatState & ChatContextActions;
