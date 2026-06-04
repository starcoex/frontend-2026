import { useCallback, useRef } from 'react';
import type { ApiResponse, UpdateChatRoomInput } from '../types';
import { useChatContext } from '../context';
import { getChatService } from '../services';
import type {
  ChatFilters,
  GetChatRoomsInput,
  GetMessagesInput,
  GetParticipantsInput,
  CreateChatRoomInput,
  SendMessageInput,
  JoinChatRoomInput,
} from '../types';

export const useChats = () => {
  const context = useChatContext();

  const {
    setChatRooms,
    addChatRoom,
    updateChatRoomInContext,
    removeChatRoom,
    setCurrentRoom,
    // ✅ 단일 배열 → 캐시 기반으로 교체
    setMessagesByRoom,
    appendMessagesByRoom,
    clearMessagesByRoom,
    addMessage,
    removeMessage,
    setCurrentParticipants,
    updateParticipantInContext,
    setRoomStats,
    setMessageStats,
    setPagination,
    setMessagePagination,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    filters,
    messagesByRoom, // ✅ Record<number, ChatMessage[]>
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  const messagesByRoomRef = useRef(messagesByRoom); // ✅ 추가
  messagesByRoomRef.current = messagesByRoom; // ✅ 항상 최신값 유지

  // ============================================================================
  // 공통 로딩 래퍼
  // ============================================================================

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ============================================================================
  // Queries — 채팅방
  // ============================================================================

  const fetchAdminChatRooms = useCallback(
    async (input: GetChatRoomsInput = filters) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.adminChatRooms(input);
        if (res.success && res.data) {
          setChatRooms(res.data.chatRooms);
          setPagination({
            totalCount: res.data.totalCount,
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            hasNext: res.data.hasNext,
            hasPrev: res.data.hasPrev,
            unreadRoomsCount: res.data.unreadRoomsCount,
          });
        }
        return res;
      }, '채팅방 목록을 불러오는데 실패했습니다.'),
    [withLoading, filters, setChatRooms, setPagination]
  );

  const fetchMyChatRooms = useCallback(
    async (input: GetChatRoomsInput = filters) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.getMyChatRooms(input);
        if (res.success && res.data) {
          setChatRooms(res.data.chatRooms);
          setPagination({
            totalCount: res.data.totalCount,
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            hasNext: res.data.hasNext,
            hasPrev: res.data.hasPrev,
            unreadRoomsCount: res.data.unreadRoomsCount,
          });
        }
        return res;
      }, '내 채팅방 목록을 불러오는데 실패했습니다.'),
    [withLoading, filters, setChatRooms, setPagination]
  );

  const fetchChatRoomById = useCallback(
    async (roomId: number) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.getChatRoom(roomId);
        if (res.success && res.data) {
          setCurrentRoom(res.data);
          updateChatRoomInContext(roomId, res.data);
        }
        return res;
      }, '채팅방 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentRoom, updateChatRoomInContext]
  );

  const fetchChatRoomStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.chatRoomStats();
        if (res.success && res.data) {
          setRoomStats(res.data);
        }
        return res;
      }, '채팅방 통계를 불러오는데 실패했습니다.'),
    [withLoading, setRoomStats]
  );

  // ============================================================================
  // Queries — 메시지 (캐시 기반 증분 로드)
  // ============================================================================

  const fetchAdminChatMessages = useCallback(
    async (input: GetMessagesInput) =>
      withLoading(async () => {
        const service = getChatService();
        const roomId = input.roomId;
        const cached = messagesByRoomRef.current[roomId]; // ✅ ref로 참조

        const queryInput: GetMessagesInput = input.cursor
          ? input
          : { ...input, limit: input.limit ?? 50 };

        const res = await service.adminChatMessages(queryInput);
        if (res.success && res.data) {
          const newMessages = [...res.data.chatMessages];
          if (input.cursor && cached?.length && newMessages.length > 0) {
            setMessagesByRoom(roomId, [...newMessages, ...cached]);
          } else {
            setMessagesByRoom(roomId, newMessages);
          }
          setMessagePagination({
            hasMore: res.data.hasMore,
            nextCursor: res.data.nextCursor ?? null,
            unreadCount: res.data.unreadCount ?? null,
          });
        }
        return res;
      }, '메시지 목록을 불러오는데 실패했습니다.'),
    [withLoading, setMessagesByRoom, setMessagePagination] // ✅ messagesByRoom 제거
  );

  const fetchChatMessages = useCallback(
    async (input: GetMessagesInput) =>
      withLoading(async () => {
        const service = getChatService();
        const roomId = input.roomId;
        const cached = messagesByRoomRef.current[roomId]; // ✅ ref로 참조

        const lastMessage = cached?.length ? cached[cached.length - 1] : null;
        const queryInput: GetMessagesInput = lastMessage
          ? { ...input, cursor: String(lastMessage.id) }
          : input;

        const res = await service.getChatMessages(queryInput);
        if (res.success && res.data) {
          const sorted = [...res.data.chatMessages];
          if (lastMessage && res.data.chatMessages.length > 0) {
            appendMessagesByRoom(roomId, sorted);
          } else if (!lastMessage) {
            appendMessagesByRoom(roomId, sorted);
          }
          setMessagePagination({
            hasMore: res.data.hasMore,
            nextCursor: res.data.nextCursor ?? null,
            unreadCount: res.data.unreadCount ?? null,
          });
        }
        return res;
      }, '메시지 목록을 불러오는데 실패했습니다.'),
    [withLoading, setMessagesByRoom, appendMessagesByRoom, setMessagePagination] // ✅ messagesByRoom 제거
  );

  const fetchChatMessageStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.chatMessageStats();
        if (res.success && res.data) {
          setMessageStats(res.data);
        }
        return res;
      }, '메시지 통계를 불러오는데 실패했습니다.'),
    [withLoading, setMessageStats]
  );

  // ============================================================================
  // Queries — 참여자
  // ============================================================================

  const fetchChatParticipants = useCallback(
    async (roomId: number, input?: Omit<GetParticipantsInput, 'roomId'>) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.getChatParticipants(roomId, input);
        if (res.success && res.data?.participants) {
          setCurrentParticipants(res.data.participants);
        }
        return res;
      }, '참여자 목록을 불러오는데 실패했습니다.'),
    [withLoading, setCurrentParticipants]
  );

  // ============================================================================
  // Mutations — 채팅방
  // ============================================================================

  const createChatRoom = useCallback(
    async (input: CreateChatRoomInput) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.createChatRoom(input);
        if (res.success && res.data?.chatRoom) {
          addChatRoom(res.data.chatRoom);
        }
        return res;
      }, '채팅방 생성에 실패했습니다.'),
    [withLoading, addChatRoom]
  );

  const updateChatRoom = useCallback(
    async (input: UpdateChatRoomInput) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.updateChatRoom(input);
        if (res.success && res.data) {
          updateChatRoomInContext(input.roomId, res.data);
        }
        return res;
      }, '채팅방 수정에 실패했습니다.'),
    [withLoading, updateChatRoomInContext]
  );

  const updateChatRoomStatus = useCallback(
    async (roomId: number, status: string) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.updateChatRoomStatus(roomId, status);
        if (res.success && res.data) {
          updateChatRoomInContext(roomId, res.data);
        }
        return res;
      }, '채팅방 상태 변경에 실패했습니다.'),
    [withLoading, updateChatRoomInContext]
  );

  const deleteChatRoom = useCallback(
    async (roomId: number, hardDelete = false) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.deleteChatRoom(roomId, hardDelete);
        if (res.success) {
          removeChatRoom(roomId);
          clearMessagesByRoom(roomId); // ✅ 채팅방 삭제 시 캐시도 제거
        }
        return res;
      }, '채팅방 삭제에 실패했습니다.'),
    [withLoading, removeChatRoom, clearMessagesByRoom]
  );

  const bulkDeleteChatRooms = useCallback(
    async (ids: number[], hardDelete = false) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.bulkDeleteChatRooms(ids, hardDelete);
        if (res.success && res.data?.successCount) {
          ids.forEach((id) => {
            removeChatRoom(id);
            clearMessagesByRoom(id); // ✅ 각 채팅방 캐시 제거
          });
        }
        return res;
      }, '채팅방 다건 삭제에 실패했습니다.'),
    [withLoading, removeChatRoom, clearMessagesByRoom]
  );

  // ============================================================================
  // Mutations — 메시지
  // ============================================================================

  const sendMessage = useCallback(
    async (input: SendMessageInput) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.sendMessage(input);
        if (res.success && res.data?.chatMessage) {
          // ✅ roomId별 캐시에 추가
          addMessage(res.data.chatMessage);
        }
        return res;
      }, '메시지 전송에 실패했습니다.'),
    [withLoading, addMessage]
  );

  const markMessagesAsRead = useCallback(
    async (roomId: number, messageIds: number[]) =>
      withLoading(async () => {
        const service = getChatService();
        return service.markMessagesAsRead(roomId, messageIds);
      }, '메시지 읽음 처리에 실패했습니다.'),
    [withLoading]
  );

  const deleteMessage = useCallback(
    async (messageId: number, hardDelete = false) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.deleteMessage(messageId, hardDelete);
        if (res.success) {
          removeMessage(messageId);
        }
        return res;
      }, '메시지 삭제에 실패했습니다.'),
    [withLoading, removeMessage]
  );

  const bulkDeleteMessages = useCallback(
    async (messageIds: number[], hardDelete = false) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.bulkDeleteMessages(messageIds, hardDelete);
        if (res.success && res.data?.successCount) {
          messageIds.forEach((id) => removeMessage(id));
        }
        return res;
      }, '메시지 다건 삭제에 실패했습니다.'),
    [withLoading, removeMessage]
  );

  // ============================================================================
  // Mutations — 참여자
  // ============================================================================

  const joinChatRoom = useCallback(
    async (input: JoinChatRoomInput) =>
      withLoading(async () => {
        const service = getChatService();
        return service.joinChatRoom(input);
      }, '채팅방 참여에 실패했습니다.'),
    [withLoading]
  );

  const leaveChatRoom = useCallback(
    async (
      participantId: number,
      roomId: number // ✅ roomId 추가
    ) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.leaveChatRoom(participantId);
        if (res.success) {
          clearMessagesByRoom(roomId); // ✅ 나가기 시 해당 룸 캐시 삭제
        }
        return res;
      }, '채팅방 나가기에 실패했습니다.'),
    [withLoading, clearMessagesByRoom]
  );

  const updateOnlineStatus = useCallback(
    async (participantId: number, isOnline: boolean) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.updateOnlineStatus(participantId, isOnline);
        if (res.success && res.data) {
          updateParticipantInContext(participantId, res.data);
        }
        return res;
      }, '온라인 상태 변경에 실패했습니다.'),
    [withLoading, updateParticipantInContext]
  );

  const kickParticipant = useCallback(
    async (participantId: number, reason?: string) =>
      withLoading(async () => {
        const service = getChatService();
        return service.kickParticipant(participantId, reason);
      }, '참여자 강제 퇴장에 실패했습니다.'),
    [withLoading]
  );

  const updateParticipantRole = useCallback(
    async (participantId: number, newRole: string) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.updateParticipantRole(participantId, newRole);
        if (res.success && res.data) {
          updateParticipantInContext(participantId, res.data);
        }
        return res;
      }, '참여자 역할 변경에 실패했습니다.'),
    [withLoading, updateParticipantInContext]
  );

  const updateNotificationSettings = useCallback(
    async (participantId: number, notificationEnabled: boolean) =>
      withLoading(async () => {
        const service = getChatService();
        const res = await service.updateNotificationSettings(
          participantId,
          notificationEnabled
        );
        if (res.success && res.data) {
          updateParticipantInContext(participantId, res.data);
        }
        return res;
      }, '알림 설정 변경에 실패했습니다.'),
    [withLoading, updateParticipantInContext]
  );

  // ============================================================================
  // 필터 헬퍼
  // ============================================================================

  const applyFilters = useCallback(
    (newFilters: Partial<ChatFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 };
      setFilters(updated);
      return fetchAdminChatRooms(updated);
    },
    [filters, setFilters, fetchAdminChatRooms]
  );

  const goToPage = useCallback(
    (page: number) => {
      const updated = { ...filters, page };
      setFilters(updated);
      return fetchAdminChatRooms(updated);
    },
    [filters, setFilters, fetchAdminChatRooms]
  );

  // ✅ 현재 roomId 기준 메시지 셀렉터 (편의 헬퍼)
  const getMessagesForRoom = useCallback(
    (roomId: number) => messagesByRoom[roomId] ?? [],
    [messagesByRoom]
  );

  return {
    // 상태
    ...context,
    messagesByRoom,
    getMessagesForRoom,
    // Queries — 채팅방
    fetchAdminChatRooms,
    fetchMyChatRooms,
    fetchChatRoomById,
    fetchChatRoomStats,
    // Queries — 메시지
    fetchAdminChatMessages,
    fetchChatMessages,
    fetchChatMessageStats,
    // Queries — 참여자
    fetchChatParticipants,
    // Mutations — 채팅방
    createChatRoom,
    updateChatRoom,
    updateChatRoomStatus,
    deleteChatRoom,
    bulkDeleteChatRooms,
    // Mutations — 메시지
    sendMessage,
    markMessagesAsRead,
    deleteMessage,
    bulkDeleteMessages,
    // Mutations — 참여자
    joinChatRoom,
    leaveChatRoom,
    updateOnlineStatus,
    kickParticipant,
    updateParticipantRole,
    updateNotificationSettings,
    // 필터 헬퍼
    applyFilters,
    goToPage,
    clearFilters,
  };
};
