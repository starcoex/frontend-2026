import { useEffect, useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { useChats } from '@starcoex-frontend/chats';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatRoomList } from './components/chat-room-list';
import { ChatRoomStatusFilter } from './components/chat-room-status-filter';
import { ChatRoomFormDialog } from './components/chat-room-form-dialog';
import type { ChatRoom } from '@starcoex-frontend/chats';
import { ChatRoomDetail } from '@/app/pages/dashboard/ecommerce/chat/chat-room-detail/chat-room-detail-page';

export default function ChatsPage() {
  const {
    chatRooms,
    isLoading,
    error,
    fetchAdminChatRooms,
    fetchChatRoomStats,
  } = useChats();

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdminChatRooms();
    fetchChatRoomStats();
  }, [fetchAdminChatRooms, fetchChatRoomStats]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      fetchAdminChatRooms({ search: value || undefined, page: 1, limit: 20 });
    },
    [fetchAdminChatRooms]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      setStatusFilter(status);
      setSelectedRoom(null);
      fetchAdminChatRooms({
        status: status === 'all' ? undefined : (status as any),
        page: 1,
        limit: 20,
      });
    },
    [fetchAdminChatRooms]
  );

  if (isLoading && chatRooms.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            채팅 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`채팅 관리 - ${COMPANY_INFO.name}`}
        description="고객 채팅방을 관리하세요."
        keywords={['채팅 관리', '고객 지원', COMPANY_INFO.name]}
        og={{
          title: `채팅 관리 - ${COMPANY_INFO.name}`,
          description: '채팅 관리 시스템',
          image: '/images/og-chats.jpg',
          type: 'website',
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdminChatRooms()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex h-[calc(100vh-var(--header-height)-12rem)] gap-4">
        {/* 좌측 채팅방 목록 */}
        <Card className="flex w-80 flex-shrink-0 flex-col pb-0">
          <CardHeader>
            <CardTitle className="text-lg">채팅방 목록</CardTitle>
            <CardAction>
              {/* ✅ 채팅방 생성 버튼 추가 */}
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="size-3.5" />
                생성
              </Button>
            </CardAction>
            <CardDescription className="relative mt-2 flex items-center">
              <Search className="text-muted-foreground absolute start-3 size-4" />
              <Input
                aria-label="채팅방 검색"
                type="text"
                className="ps-9"
                placeholder="채팅방 검색..."
                value={search}
                onChange={handleSearchChange}
              />
            </CardDescription>
          </CardHeader>

          <div className="px-4 pb-2">
            <ChatRoomStatusFilter
              value={statusFilter}
              onChange={handleStatusFilter}
            />
          </div>

          <CardContent className="flex-1 overflow-auto p-0">
            <ChatRoomList
              rooms={chatRooms}
              selectedRoomId={selectedRoom?.id ?? null}
              onSelect={setSelectedRoom}
            />
          </CardContent>
        </Card>

        {/* 우측 상세 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedRoom ? (
            <ChatRoomDetail
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-muted-foreground text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto mb-4 size-16 opacity-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-sm">채팅방을 선택하세요</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 size-4" />새 채팅방 생성
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ 채팅방 생성 다이얼로그 */}
      <ChatRoomFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          setCreateDialogOpen(false);
          fetchAdminChatRooms();
        }}
      />
    </>
  );
}
