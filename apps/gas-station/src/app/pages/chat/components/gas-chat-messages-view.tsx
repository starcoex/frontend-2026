import React, {
  useRef,
  useEffect,
  useMemo,
  ButtonHTMLAttributes,
  ComponentType,
} from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ChatMessageBubble,
  ChatMessageInput,
  ChatMessageSearchBar,
  ChatJoinBanner,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatMessage, ChatParticipant } from '@starcoex-frontend/chats';

// ← 타입 캐스팅용 헬퍼
const ButtonComponent = Button as ComponentType<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: string;
    variant?: string;
    asChild?: boolean;
  }
>;

interface GasChatMessagesViewProps {
  messages: ChatMessage[];
  participants: ChatParticipant[];
  currentUserId?: number;
  currentUserName?: string;
  userNameMap: Record<number, string>;
  isParticipant: boolean;
  hasLeft: boolean;
  isJoining: boolean;
  participantCheckDone: boolean;
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
  // 무한 스크롤
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}

export function GasChatMessagesView({
  messages,
  participants,
  currentUserId,
  currentUserName,
  userNameMap,
  isParticipant,
  hasLeft,
  isJoining,
  participantCheckDone,
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
  hasMore,
  isFetchingMore,
  onLoadMore,
}: GasChatMessagesViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const matchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [searchMatchIndex, setSearchMatchIndex] = React.useState(0);
  const prevMessageCountRef = useRef(0);
  const wasLoadingMoreRef = useRef(false);
  const isFetchingMoreRef = useRef(isFetchingMore);
  isFetchingMoreRef.current = isFetchingMore;

  // 무한 스크롤 감지
  useEffect(() => {
    const topEl = messagesTopRef.current;
    const container = scrollContainerRef.current;
    if (!topEl || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          onLoadMore();
        }
      },
      { root: container, threshold: 0.1 }
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

  // 새 메시지 스크롤
  useEffect(() => {
    if (isSearchOpen) return;
    const prevCount = prevMessageCountRef.current;
    const currCount = messages.length;
    prevMessageCountRef.current = currCount;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (prevCount === 0) {
      container.scrollTop = container.scrollHeight;
      return;
    }
    if (wasLoadingMoreRef.current) {
      wasLoadingMoreRef.current = false;
      return;
    }
    container.scrollTop = container.scrollHeight;
  }, [messages, isSearchOpen]);

  useEffect(() => {
    if (isFetchingMore) {
      wasLoadingMoreRef.current = true;
    }
  }, [isFetchingMore]);

  useEffect(() => {
    setSearchMatchIndex(0);
  }, [searchQuery]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* 검색바 */}
      {isSearchOpen && (
        <ChatMessageSearchBar
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          matchCount={matchedIndices.length}
          currentIndex={searchMatchIndex}
          onPrev={() =>
            setSearchMatchIndex((p) =>
              p === 0 ? matchedIndices.length - 1 : p - 1
            )
          }
          onNext={() =>
            setSearchMatchIndex((p) => (p + 1) % matchedIndices.length)
          }
          onClose={onToggleSearch}
          InputComponent={Input}
          ButtonComponent={ButtonComponent}
        />
      )}

      {/* 메시지 스크롤 영역 */}
      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 px-4 py-3">
          {/* 상단 무한 스크롤 감지 */}
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
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 타이핑 인디케이터 */}
      {typingUsers.length > 0 && (
        <div className="flex-shrink-0 px-4 pb-1">
          <p className="text-muted-foreground animate-pulse text-xs">
            상담원이 입력 중...
          </p>
        </div>
      )}

      {/* 재참여 배너 */}
      {!isParticipant && hasLeft && (
        <ChatJoinBanner
          type="rejoin"
          isLoading={isJoining}
          onJoin={onJoin}
          ButtonComponent={ButtonComponent}
        />
      )}

      {/* 최초 미참여 배너 */}
      {!isParticipant && !hasLeft && participantCheckDone && (
        <ChatJoinBanner
          type="join"
          isLoading={isJoining}
          onJoin={onJoin}
          ButtonComponent={ButtonComponent}
        />
      )}

      {/* 입력창 */}
      <ChatMessageInput
        value={messageInput}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
        onToggleSearch={onToggleSearch}
        isSearchOpen={isSearchOpen}
        isParticipant={isParticipant}
        isSending={isSending}
        InputComponent={Input}
        ButtonComponent={ButtonComponent}
      />
    </div>
  );
}
