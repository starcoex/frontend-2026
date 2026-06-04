import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import {
  useChats,
  useChatSubscription,
  useChatSocket,
  useChatRoomParticipation,
} from '@starcoex-frontend/chats';
import type { ChatRoom } from '@starcoex-frontend/chats';
import { useAuth } from '@starcoex-frontend/auth';
import { GasChatRoomHeader } from './components/gas-chat-room-header';
import { GasChatMessagesView } from './components/gas-chat-messages-view';

interface GasChatRoomDetailProps {
  room: ChatRoom;
  /** 게스트 세션 ID (비로그인 사용자) */
  guestId?: number;
  /** 게스트 이름 */
  guestName?: string;
  onClose: () => void;
}

export function GasChatRoomDetail({
  room,
  guestId,
  guestName,
  onClose,
}: GasChatRoomDetailProps) {
  const { currentUser } = useAuth();

  // 로그인 유저 또는 게스트 정보 통합
  const currentUserId = currentUser?.id;
  const currentUserName =
    currentUser?.name ?? currentUser?.email ?? guestName ?? undefined;

  const {
    getMessagesForRoom,
    currentParticipants,
    fetchChatParticipants,
    fetchChatMessages,
    sendMessage,
    markMessagesAsRead,
    clearMessagesByRoom,
    messagePagination,
  } = useChats();

  const currentMessages = getMessagesForRoom(room.id);

  // ── 상태 ────────────────────────────────────────────────────────────────────
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const markedAsReadRef = useRef<Set<number>>(new Set());
  const sessionBaseMessageIdRef = useRef<number | null>(null);

  // ── 참여 로직 ────────────────────────────────────────────────────────────────
  const {
    isParticipant,
    hasLeft,
    isJoining,
    isLeaving,
    participantCheckDone,
    handleJoinRoom,
    handleLeaveRoom,
    reset: resetParticipation,
  } = useChatRoomParticipation({
    roomId: room.id,
    createdByUserId: room.createdByUserId,
    currentUserId,
    currentUserName,
    currentUserEmail: currentUser?.email,
    onLeaveSuccess: onClose,
  });

  // ── 초기화 (방 전환 시) ──────────────────────────────────────────────────────
  useEffect(() => {
    resetParticipation();
    markedAsReadRef.current = new Set();
    sessionBaseMessageIdRef.current = null;
    clearMessagesByRoom(room.id);
    fetchChatParticipants(room.id, { includeLeft: true });
    fetchChatMessages({ roomId: room.id });
  }, [room.id]);

  // ── Subscription / Socket ────────────────────────────────────────────────────
  useChatSubscription({ roomId: room.id, enabled: true });

  const { socketStatus, onlineCount, sendTyping, sendMarkAsRead } =
    useChatSocket({
      roomId: room.id,
      enabled: isParticipant,
      onUserTyping: ({ userId, isTyping }) => {
        setTypingUsers((prev) =>
          isTyping
            ? prev.includes(userId)
              ? prev
              : [...prev, userId]
            : prev.filter((id) => id !== userId)
        );
      },
      onMessageRead: ({ messageIds }) => {
        console.info('[GasChat] 읽음 처리:', messageIds);
      },
    });

  // ── userNameMap ──────────────────────────────────────────────────────────────
  const userNameMap = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    currentParticipants.forEach((p) => {
      if (p.userId != null && p.displayName) {
        map[p.userId] = p.displayName;
      }
    });
    if (currentUserId && currentUserName) {
      map[Number(currentUserId)] = currentUserName;
    }
    return map;
  }, [currentParticipants, currentUserId, currentUserName]);

  // ── 읽음 처리 ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentMessages.length || !isParticipant) return;

    if (sessionBaseMessageIdRef.current === null) {
      const lastMsg = currentMessages[currentMessages.length - 1];
      sessionBaseMessageIdRef.current = lastMsg?.id ?? 0;
    }

    const baseId = sessionBaseMessageIdRef.current;
    const unreadIds = currentMessages
      .filter(
        (m) =>
          !m.isDeleted && m.id >= baseId && !markedAsReadRef.current.has(m.id)
      )
      .map((m) => m.id);

    if (!unreadIds.length) return;
    unreadIds.forEach((id) => markedAsReadRef.current.add(id));
    markMessagesAsRead(room.id, unreadIds);
    sendMarkAsRead(unreadIds);
  }, [room.id, currentMessages, isParticipant]);

  // ── 메시지 핸들러 ────────────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessageInput(e.target.value);
      if (!isParticipant) return;
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        sendTyping(true);
      }
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        sendTyping(false);
      }, 1500);
    },
    [isParticipant, sendTyping]
  );

  const handleSendMessage = useCallback(async () => {
    const content = messageInput.trim();
    if (!content || !isParticipant) return;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTyping(false);
    }
    setIsSending(true);
    try {
      const res = await sendMessage({ roomId: room.id, content, type: 'TEXT' });
      if (res.success) setMessageInput('');
      else toast.error(res.error?.message ?? '메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  }, [messageInput, room.id, isParticipant, sendMessage, sendTyping]);

  // ── 참여 (일반 유저: CUSTOMER / 게스트: GUEST) ────────────────────────────────
  const handleJoinWithRefresh = useCallback(async () => {
    clearMessagesByRoom(room.id);
    // 게스트면 GUEST 역할로 참여
    await handleJoinRoom(room.status);
  }, [clearMessagesByRoom, room.id, room.status, handleJoinRoom]);

  // ── 무한 스크롤 ──────────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || !messagePagination?.hasMore) return;
    if (!messagePagination?.nextCursor) return;
    setIsFetchingMore(true);
    try {
      await fetchChatMessages({
        roomId: room.id,
        cursor: messagePagination.nextCursor,
      });
    } finally {
      setIsFetchingMore(false);
    }
  }, [
    isFetchingMore,
    messagePagination?.hasMore,
    messagePagination?.nextCursor,
    room.id,
    fetchChatMessages,
  ]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      {/* 헤더 */}
      <GasChatRoomHeader
        room={room}
        isParticipant={isParticipant}
        isLeaving={isLeaving}
        socketStatus={socketStatus}
        onlineCount={onlineCount}
        onLeave={handleLeaveRoom}
        onClose={onClose}
      />

      {/* 메시지 영역 */}
      <GasChatMessagesView
        messages={currentMessages}
        participants={currentParticipants}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        userNameMap={userNameMap}
        isParticipant={isParticipant}
        hasLeft={hasLeft}
        isJoining={isJoining}
        participantCheckDone={participantCheckDone}
        typingUsers={typingUsers}
        searchQuery={searchQuery}
        isSearchOpen={isSearchOpen}
        onSearchQueryChange={setSearchQuery}
        onToggleSearch={() => {
          setIsSearchOpen((v) => !v);
          if (isSearchOpen) setSearchQuery('');
        }}
        messageInput={messageInput}
        isSending={isSending}
        onInputChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        onSend={handleSendMessage}
        onJoin={handleJoinWithRefresh}
        hasMore={messagePagination?.hasMore ?? false}
        isFetchingMore={isFetchingMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
