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
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { ChatRoom } from '@starcoex-frontend/chats';
import { useAuth } from '@starcoex-frontend/auth';
import { ChatRoomHeader } from './components/chat-room-header';
import { ChatRoomMessagesTab } from './components/chat-room-messages-tab';
import { ChatMediaUploadDialog } from '@/app/pages/dashboard/ecommerce/chat/components/chat-media-upload-dialog';
import { ChatParticipantList } from '@/app/pages/dashboard/ecommerce/chat/components/chat-participant-list';
import { ChatMediaLibraryDialog } from '@/app/pages/dashboard/ecommerce/chat/components/chat-media-library-dialog';
import { ChatRoomFormDialog } from '@/app/pages/dashboard/ecommerce/chat/components/chat-room-form-dialog';
import { ChatRoomDeleteDialog } from '@/app/pages/dashboard/ecommerce/chat/components/chat-room-delete-dialog';
import { ChatRoomInfoTab } from '@/app/pages/dashboard/ecommerce/chat/chat-room-detail/components/chat-room-info-tab';

interface ChatRoomDetailProps {
  room: ChatRoom;
  onClose: () => void;
}

export function ChatRoomDetail({ room, onClose }: ChatRoomDetailProps) {
  const { currentUser } = useAuth();
  const {
    getMessagesForRoom,
    currentParticipants,
    fetchChatParticipants,
    fetchAdminChatMessages,
    fetchChatMessages,
    sendMessage,
    markMessagesAsRead,
    clearMessagesByRoom, // ← 추가
    messagePagination, // ← 추가
  } = useChats();

  const currentMessages = getMessagesForRoom(room.id);
  const currentUserName = currentUser?.name ?? currentUser?.email ?? undefined;

  // ── 다이얼로그 상태 ──────────────────────────────────────────────────────────
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ── 메시지 입력 상태 ─────────────────────────────────────────────────────────
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const markedAsReadRef = useRef<Set<number>>(new Set());
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sessionBaseMessageIdRef = useRef<number | null>(null); // ✅ 추가

  // ── 참여 로직 훅 ─────────────────────────────────────────────────────────────
  const {
    isParticipant,
    hasLeft, // ✅ 재참여 배너용
    isJoining,
    isLeaving,
    participantCheckDone,
    handleJoinRoom,
    handleLeaveRoom,
    reset: resetParticipation,
  } = useChatRoomParticipation({
    roomId: room.id,
    createdByUserId: room.createdByUserId,
    currentUserId: currentUser?.id,
    currentUserName,
    currentUserEmail: currentUser?.email,
    onLeaveSuccess: onClose,
  });

  // ── 초기화 (방 전환 시) ───────────────────────────────────────────────────────
  useEffect(() => {
    resetParticipation();
    markedAsReadRef.current = new Set();
    sessionBaseMessageIdRef.current = null; // ✅ 초기화
    clearMessagesByRoom(room.id);
    fetchChatParticipants(room.id, { includeLeft: true });
    fetchChatMessages({ roomId: room.id });
  }, [room.id]);

  // ── Subscription / Socket ─────────────────────────────────────────────────────
  // 구독은 항상 활성화 (참여 전 시스템 메시지도 수신하기 위함)
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
        console.info('[Socket] 읽음 처리:', messageIds);
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
    if (currentUser?.id && currentUserName) {
      map[Number(currentUser.id)] = currentUserName;
    }
    return map;
  }, [currentParticipants, currentUser?.id, currentUserName]);

  // ── 읽음 처리 ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentMessages.length || !isParticipant) return;

    // ✅ 최초 로드 시 기준선 설정 (가장 마지막 메시지 ID)
    if (sessionBaseMessageIdRef.current === null) {
      const lastMsg = currentMessages[currentMessages.length - 1];
      sessionBaseMessageIdRef.current = lastMsg?.id ?? 0;
    }

    const baseId = sessionBaseMessageIdRef.current;

    // ✅ 기준선 이후 메시지만 읽음 처리 (무한 스크롤로 로드된 과거 메시지 제외)
    const unreadIds = currentMessages
      .filter(
        (m) =>
          !m.isDeleted &&
          m.id >= baseId && // ✅ 기준선 이후만
          !markedAsReadRef.current.has(m.id)
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

  const handleMediaUploaded = useCallback(
    async (urls: string[]) => {
      if (!isParticipant || !urls.length) return;
      for (const url of urls) {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        await sendMessage({
          roomId: room.id,
          content: isImage ? '이미지를 전송했습니다.' : '파일을 전송했습니다.',
          type: isImage ? 'IMAGE' : 'FILE',
          imageUrl: isImage ? url : undefined,
          fileUrl: !isImage ? url : undefined,
        });
      }
    },
    [room.id, isParticipant, sendMessage]
  );

  const handleLibrarySelect = useCallback(
    async (url: string, fileName: string) => {
      if (!isParticipant) return;
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      await sendMessage({
        roomId: room.id,
        content: isImage ? '이미지를 전송했습니다.' : `파일: ${fileName}`,
        type: isImage ? 'IMAGE' : 'FILE',
        imageUrl: isImage ? url : undefined,
        fileUrl: !isImage ? url : undefined,
        fileName: !isImage ? fileName : undefined,
      });
    },
    [room.id, isParticipant, sendMessage]
  );

  // ── 추가 메시지 로드 (무한 스크롤) ─────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || !messagePagination?.hasMore) return;
    if (!messagePagination?.nextCursor) return;
    setIsFetchingMore(true);
    try {
      await fetchAdminChatMessages({
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
    fetchAdminChatMessages,
  ]);

  // ← 여기에 추가
  const handleJoinWithRefresh = useCallback(async () => {
    clearMessagesByRoom(room.id);
    await handleJoinRoom(room.status);
  }, [clearMessagesByRoom, room.id, room.status, handleJoinRoom]);

  const isCreator =
    currentUser?.id != null && room.createdByUserId === currentUser.id;

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden">
        <ChatRoomHeader
          room={room}
          isParticipant={isParticipant}
          isLeaving={isLeaving}
          socketStatus={socketStatus}
          onlineCount={onlineCount}
          onLeave={handleLeaveRoom}
          onClose={onClose}
          onEditOpen={() => setEditDialogOpen(true)}
          onDeleteOpen={() => setDeleteDialogOpen(true)}
        />

        <Tabs
          defaultValue="messages"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-2 flex-shrink-0">
            <TabsTrigger value="messages" className="flex-1 text-xs">
              메시지
              {currentMessages.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                  {currentMessages.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex-1 text-xs">
              참여자
              {currentParticipants.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                  {currentParticipants.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1 text-xs">
              정보
            </TabsTrigger>
          </TabsList>

          {/* 메시지 탭 */}
          <ChatRoomMessagesTab
            messages={currentMessages}
            participants={currentParticipants}
            currentUserId={currentUser?.id}
            currentUserName={currentUserName}
            userNameMap={userNameMap}
            isParticipant={isParticipant}
            hasLeft={hasLeft}
            isJoining={isJoining}
            isLeaving={isLeaving}
            participantCheckDone={participantCheckDone}
            isCreator={isCreator}
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
            onJoin={() => handleJoinWithRefresh()}
            onUploadOpen={() => setUploadDialogOpen(true)}
            onLibraryOpen={() => setLibraryDialogOpen(true)}
            hasMore={messagePagination?.hasMore ?? false} // ← 추가
            isFetchingMore={isFetchingMore} // ← 추가
            onLoadMore={handleLoadMore} // ← 추가
          />

          {/* 참여자 탭 */}
          <TabsContent
            value="participants"
            className="mt-0 min-h-0 flex-1 overflow-auto px-4 data-[state=inactive]:hidden"
          >
            <ChatParticipantList participants={currentParticipants} />
          </TabsContent>

          {/* 정보 탭 */}
          <ChatRoomInfoTab room={room} />
        </Tabs>
      </Card>

      <ChatMediaUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploaded={handleMediaUploaded}
      />
      <ChatMediaLibraryDialog
        open={libraryDialogOpen}
        onOpenChange={setLibraryDialogOpen}
        onSelect={handleLibrarySelect}
      />
      <ChatRoomFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editTarget={room}
        onSuccess={() => setEditDialogOpen(false)}
      />
      <ChatRoomDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        room={room}
        onSuccess={onClose}
      />
    </>
  );
}
