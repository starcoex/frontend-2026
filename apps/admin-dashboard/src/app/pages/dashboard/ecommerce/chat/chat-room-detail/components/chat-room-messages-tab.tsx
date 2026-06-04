import React, { useRef, useEffect, useMemo } from 'react';
import {
  Loader2,
  Search,
  XCircle,
  Paperclip,
  Images,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChatMessageBubble } from '@starcoex-frontend/common';
import type { ChatMessage, ChatParticipant } from '@starcoex-frontend/chats';

function TooltipBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children as React.ReactElement}
        </TooltipTrigger>
        <TooltipContent side="top">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function renderAdminFileAction(message: {
  fileUrl?: string | null;
  fileName?: string | null;
}) {
  if (!message.fileUrl) return null;
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-6 flex-shrink-0 text-xs"
      asChild
    >
      <a href={message.fileUrl} target="_blank" rel="noreferrer">
        다운로드
      </a>
    </Button>
  );
}

interface ChatRoomMessagesTabProps {
  messages: ChatMessage[];
  participants: ChatParticipant[];
  currentUserId?: number;
  currentUserName?: string;
  userNameMap: Record<number, string>;
  isParticipant: boolean;
  hasLeft: boolean; // ✅ 추가
  isJoining: boolean;
  isLeaving: boolean;
  participantCheckDone: boolean;
  isCreator: boolean;
  typingUsers: string[];
  // 검색
  searchQuery: string;
  isSearchOpen: boolean;
  onSearchQueryChange: (q: string) => void;
  onToggleSearch: () => void;
  // 입력
  messageInput: string;
  isSending: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onJoin: () => void;
  onUploadOpen: () => void;
  onLibraryOpen: () => void;
  hasMore: boolean; // ← 추가
  isFetchingMore: boolean; // ← 추가
  onLoadMore: () => void; // ← 추가
}

export function ChatRoomMessagesTab({
  messages,
  participants,
  currentUserId,
  currentUserName,
  userNameMap,
  isParticipant,
  hasLeft, // ✅ 추가
  isJoining,
  participantCheckDone,
  isCreator,
  typingUsers,
  searchQuery,
  isSearchOpen,
  onSearchQueryChange,
  onToggleSearch,
  messageInput,
  isSending,
  onInputChange,
  onKeyDown,
  onSend,
  onJoin,
  onUploadOpen,
  onLibraryOpen,
  hasMore,
  isFetchingMore,
  onLoadMore,
}: ChatRoomMessagesTabProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null); // ← 추가
  const matchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [searchMatchIndex, setSearchMatchIndex] = React.useState(0);
  const prevMessageCountRef = useRef(0); // ← 추가
  const isFetchingMoreRef = useRef(isFetchingMore); // ← 추가
  isFetchingMoreRef.current = isFetchingMore;
  const wasLoadingMoreRef = useRef(false); // ✅ 이전 메시지 로드 여부 추적

  // ── 상단 스크롤 감지 (무한 스크롤) ───────────────────────────────────────────
  useEffect(() => {
    const topEl = messagesTopRef.current;
    if (!topEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(topEl);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, onLoadMore]);

  // 검색 매칭
  const matchedIndices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messages.reduce<number[]>((acc, msg, i) => {
      if (
        msg.content?.toLowerCase().includes(q) ||
        msg.fileName?.toLowerCase().includes(q)
      )
        acc.push(i);
      return acc;
    }, []);
  }, [searchQuery, messages]);

  // 검색 결과 스크롤
  useEffect(() => {
    if (!matchedIndices.length) return;
    matchRefs.current[matchedIndices[searchMatchIndex]]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [searchMatchIndex, matchedIndices]);

  // 새 메시지 스크롤 — 이전 메시지 로드(무한 스크롤)일 때는 스크롤 유지
  useEffect(() => {
    if (isSearchOpen) return;
    const prevCount = prevMessageCountRef.current;
    const currCount = messages.length;
    prevMessageCountRef.current = currCount;

    // 메시지가 없다가 처음 로드될 때 → 맨 하단으로
    if (prevCount === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      return;
    }

    // ✅ 이전 메시지 추가 로드였으면 → 스크롤 유지
    if (wasLoadingMoreRef.current) {
      wasLoadingMoreRef.current = false;
      return;
    }

    // 새 메시지 수신 → 맨 하단으로
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearchOpen]);

  // ✅ isFetchingMore가 true로 바뀌는 순간 기록
  useEffect(() => {
    if (isFetchingMore) {
      wasLoadingMoreRef.current = true;
    }
  }, [isFetchingMore]);

  // 검색 쿼리 변경 시 인덱스 초기화
  useEffect(() => {
    setSearchMatchIndex(0);
  }, [searchQuery]);

  return (
    <TabsContent
      value="messages"
      className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
    >
      {/* 검색바 */}
      {isSearchOpen && (
        <div className="flex-shrink-0 border-b bg-background px-4 py-2">
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground size-4 flex-shrink-0" />
            <Input
              autoFocus
              aria-label="메시지 검색"
              placeholder="메시지 검색..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="h-8 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            {searchQuery && (
              <span className="text-muted-foreground flex-shrink-0 text-xs">
                {matchedIndices.length > 0
                  ? `${searchMatchIndex + 1} / ${matchedIndices.length}`
                  : '결과 없음'}
              </span>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() =>
                setSearchMatchIndex((p) =>
                  p === 0 ? matchedIndices.length - 1 : p - 1
                )
              }
              disabled={matchedIndices.length === 0}
            >
              <span className="text-xs">▲</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() =>
                setSearchMatchIndex((p) => (p + 1) % matchedIndices.length)
              }
              disabled={matchedIndices.length === 0}
            >
              <span className="text-xs">▼</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={onToggleSearch}
            >
              <XCircle className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 메시지 스크롤 영역 */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-2 px-4 py-3">
          {/* 상단 로딩 인디케이터 */}
          <div ref={messagesTopRef}>
            {isFetchingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </div>
            )}
          </div>
          {messages.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              메시지가 없습니다.
            </p>
          ) : (
            messages.map((message, index) => {
              const isMatch = matchedIndices.includes(index);
              const isCurrentMatch = matchedIndices[searchMatchIndex] === index;
              return (
                <div
                  key={message.id}
                  ref={(el) => {
                    matchRefs.current[index] = el;
                  }}
                  className={cn(
                    'rounded-lg px-1 transition-colors',
                    isMatch && 'bg-yellow-50 dark:bg-yellow-950/20',
                    isCurrentMatch && 'bg-yellow-100 dark:bg-yellow-900/40'
                  )}
                >
                  <ChatMessageBubble
                    message={message}
                    participants={participants}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                    userNameMap={userNameMap}
                    renderFileAction={renderAdminFileAction}
                  />
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 타이핑 인디케이터 */}
      {typingUsers.length > 0 && (
        <div className="flex-shrink-0 px-4 pb-1">
          <p className="text-muted-foreground animate-pulse text-xs">
            상대방이 입력 중...
          </p>
        </div>
      )}
      {/* ✅ 재참여 배너 — 나간 적 있는 경우 */}
      {!isParticipant && hasLeft && (
        <div className="flex-shrink-0 border-t bg-blue-50 px-4 py-3 dark:bg-blue-950/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              이전에 나간 채팅방입니다. 다시 참여할 수 있습니다.
            </p>
            <Button
              size="sm"
              onClick={onJoin}
              disabled={isJoining}
              className="flex-shrink-0"
            >
              {isJoining && <Loader2 className="mr-2 size-4 animate-spin" />}
              재참여
            </Button>
          </div>
        </div>
      )}

      {/* ✅ 최초 미참여 배너 */}
      {!isParticipant && !hasLeft && !isCreator && participantCheckDone && (
        <div className="flex-shrink-0 border-t bg-yellow-50 px-4 py-3 dark:bg-yellow-950/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              메시지를 보내려면 채팅방에 참여해야 합니다.
            </p>
            <Button
              size="sm"
              onClick={onJoin}
              disabled={isJoining}
              className="flex-shrink-0"
            >
              {isJoining && <Loader2 className="mr-2 size-4 animate-spin" />}
              참여하기
            </Button>
          </div>
        </div>
      )}

      {/* 입력창 */}
      <div className="flex-shrink-0 border-t bg-background p-3">
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border bg-muted px-3',
            !isParticipant && 'opacity-50'
          )}
        >
          <Input
            aria-label="메시지 입력"
            value={messageInput}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder={
              isParticipant
                ? '메시지 입력...'
                : '채팅방에 참여 후 입력할 수 있습니다.'
            }
            className="h-11 flex-1 border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0"
            disabled={isSending || !isParticipant}
          />
          <div className="flex items-center gap-0.5">
            <TooltipBtn label="메시지 검색">
              <Button
                aria-label="메시지 검색"
                size="icon"
                variant="ghost"
                className={cn(
                  'h-8 w-8 flex-shrink-0',
                  isSearchOpen && 'text-primary'
                )}
                onClick={onToggleSearch}
              >
                <Search className="size-4" />
              </Button>
            </TooltipBtn>
            <TooltipBtn label="파일 업로드">
              <Button
                aria-label="파일 업로드"
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={onUploadOpen}
                disabled={isSending || !isParticipant}
              >
                <Paperclip className="size-4" />
              </Button>
            </TooltipBtn>
            <TooltipBtn label="미디어 라이브러리">
              <Button
                aria-label="미디어 라이브러리"
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={onLibraryOpen}
                disabled={isSending || !isParticipant}
              >
                <Images className="size-4" />
              </Button>
            </TooltipBtn>
            <Button
              size="sm"
              onClick={onSend}
              disabled={!messageInput.trim() || isSending || !isParticipant}
              className="flex-shrink-0"
            >
              {isSending ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Send className="mr-1 size-3.5" />
              )}
              전송
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
