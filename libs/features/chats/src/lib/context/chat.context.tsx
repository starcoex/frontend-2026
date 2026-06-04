import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
  useLayoutEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  ChatState,
  ChatContextValue,
  ChatFilters,
  ChatRoom,
  ChatMessage,
  ChatParticipant,
  ChatRoomSummaryStats,
  ChatMessageSummaryStats,
} from '../types';
import { serviceRegistry, initChatService } from '../services';

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const initialPagination = {
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  unreadRoomsCount: null,
};

const initialMessagePagination = {
  hasMore: false,
  nextCursor: null,
  unreadCount: null,
};

const initialState: ChatState = {
  chatRooms: [],
  currentRoom: null,
  messagesByRoom: {}, // ✅ 빈 Record로 초기화
  currentParticipants: [],
  roomStats: null,
  messageStats: null,
  pagination: initialPagination,
  messagePagination: initialMessagePagination,
  filters: { page: 1, limit: 20 },
  isLoading: false,
  error: null,
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ChatState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('chat')) {
      try {
        initChatService(apolloClient);
      } catch (error) {
        console.error('❌ ChatService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // ── ChatRoom 액션 ─────────────────────────────────────────────────────────────

  const setChatRooms = useCallback((chatRooms: ChatRoom[]) => {
    setState((prev) => ({ ...prev, chatRooms }));
  }, []);

  const addChatRoom = useCallback((room: ChatRoom) => {
    setState((prev) => ({
      ...prev,
      chatRooms: [room, ...prev.chatRooms],
    }));
  }, []);

  const updateChatRoomInContext = useCallback(
    (id: number, updates: Partial<ChatRoom>) => {
      setState((prev) => ({
        ...prev,
        chatRooms: prev.chatRooms.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
        currentRoom:
          prev.currentRoom?.id === id
            ? { ...prev.currentRoom, ...updates }
            : prev.currentRoom,
      }));
    },
    []
  );

  const removeChatRoom = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      chatRooms: prev.chatRooms.filter((r) => r.id !== id),
    }));
  }, []);

  const setCurrentRoom = useCallback((room: ChatRoom | null) => {
    setState((prev) => ({ ...prev, currentRoom: room }));
  }, []);

  // ── Message 캐시 액션 ─────────────────────────────────────────────────────────

  /** 최초 로드: roomId 캐시를 통째로 교체 */
  const setMessagesByRoom = useCallback(
    (roomId: number, messages: ChatMessage[]) => {
      setState((prev) => ({
        ...prev,
        messagesByRoom: {
          ...prev.messagesByRoom,
          [roomId]: messages,
        },
      }));
    },
    []
  );

  /** 증분 로드: 기존 캐시 뒤에 새 메시지 추가 (중복 제거) */
  const appendMessagesByRoom = useCallback(
    (roomId: number, messages: ChatMessage[]) => {
      setState((prev) => {
        const existing = prev.messagesByRoom[roomId] ?? [];
        const existingIds = new Set(existing.map((m) => m.id));
        const deduped = messages.filter((m) => !existingIds.has(m.id));
        if (deduped.length === 0) return prev;
        return {
          ...prev,
          messagesByRoom: {
            ...prev.messagesByRoom,
            [roomId]: [...existing, ...deduped],
          },
        };
      });
    },
    []
  );

  /** 나가기/삭제 시 해당 룸 캐시 제거 */
  const clearMessagesByRoom = useCallback((roomId: number) => {
    setState((prev) => {
      const next = { ...prev.messagesByRoom };
      delete next[roomId];
      return { ...prev, messagesByRoom: next };
    });
  }, []);

  /** 실시간 수신 / 전송 완료 시 해당 roomId 캐시에 단건 추가 (중복 방지) */
  const addMessage = useCallback((message: ChatMessage) => {
    setState((prev) => {
      const existing = prev.messagesByRoom[message.roomId] ?? [];
      if (existing.some((m) => m.id === message.id)) return prev;
      return {
        ...prev,
        messagesByRoom: {
          ...prev.messagesByRoom,
          [message.roomId]: [...existing, message],
        },
      };
    });
  }, []);

  const updateMessageInContext = useCallback(
    (id: number, updates: Partial<ChatMessage>) => {
      setState((prev) => {
        const next = { ...prev.messagesByRoom };
        for (const roomId of Object.keys(next)) {
          const rid = Number(roomId);
          if (next[rid].some((m) => m.id === id)) {
            next[rid] = next[rid].map((m) =>
              m.id === id ? { ...m, ...updates } : m
            );
            break;
          }
        }
        return { ...prev, messagesByRoom: next };
      });
    },
    []
  );

  /** 삭제 시 모든 룸 캐시에서 해당 id 제거 */
  const removeMessage = useCallback((id: number) => {
    setState((prev) => {
      const next = { ...prev.messagesByRoom };
      for (const roomId of Object.keys(next)) {
        const rid = Number(roomId);
        if (next[rid].some((m) => m.id === id)) {
          next[rid] = next[rid].filter((m) => m.id !== id);
          break;
        }
      }
      return { ...prev, messagesByRoom: next };
    });
  }, []);

  // ── Participant 액션 ──────────────────────────────────────────────────────────

  const setCurrentParticipants = useCallback(
    (participants: ChatParticipant[]) => {
      setState((prev) => ({ ...prev, currentParticipants: participants }));
    },
    []
  );

  const updateParticipantInContext = useCallback(
    (id: number, updates: Partial<ChatParticipant>) => {
      setState((prev) => ({
        ...prev,
        currentParticipants: prev.currentParticipants.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  // ── OverviewOrderStatus 액션 ────────────────────────────────────────────────────────────────

  const setRoomStats = useCallback((stats: ChatRoomSummaryStats | null) => {
    setState((prev) => ({ ...prev, roomStats: stats }));
  }, []);

  const setMessageStats = useCallback(
    (stats: ChatMessageSummaryStats | null) => {
      setState((prev) => ({ ...prev, messageStats: stats }));
    },
    []
  );

  // ── Pagination / Filter 액션 ──────────────────────────────────────────────────

  const setPagination = useCallback((pagination: ChatState['pagination']) => {
    setState((prev) => ({ ...prev, pagination }));
  }, []);

  const setMessagePagination = useCallback(
    (messagePagination: ChatState['messagePagination']) => {
      setState((prev) => ({ ...prev, messagePagination }));
    },
    []
  );

  const setFilters = useCallback((filters: Partial<ChatFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: { page: 1, limit: 20 } }));
  }, []);

  // ── 공통 액션 ─────────────────────────────────────────────────────────────────

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      ...state,
      setChatRooms,
      addChatRoom,
      updateChatRoomInContext,
      removeChatRoom,
      setCurrentRoom,
      setMessagesByRoom,
      appendMessagesByRoom,
      clearMessagesByRoom,
      addMessage,
      updateMessageInContext,
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
      reset,
    }),
    [
      state,
      setChatRooms,
      addChatRoom,
      updateChatRoomInContext,
      removeChatRoom,
      setCurrentRoom,
      setMessagesByRoom,
      appendMessagesByRoom,
      clearMessagesByRoom,
      addMessage,
      updateMessageInContext,
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
      reset,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return ctx;
};
