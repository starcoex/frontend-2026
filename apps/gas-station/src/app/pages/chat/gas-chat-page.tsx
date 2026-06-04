import { useState } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { useChats } from '@starcoex-frontend/chats';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GasChatRoomDetail } from './gas-chat-room-detail';
import type { ChatRoom } from '@starcoex-frontend/chats';

export function GasChatPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const { chatRooms, fetchMyChatRooms, createChatRoom, isLoading } = useChats();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyChatRooms();
    }
  }, [isAuthenticated]);

  const handleStartChat = async () => {
    const res = await createChatRoom({
      title: `${currentUser?.name ?? '고객'} 문의`,
      type: 'CUSTOMER_SUPPORT',
    });
    if (res.success && res.data?.chatRoom) {
      setSelectedRoom(res.data.chatRoom);
    }
  };

  if (selectedRoom) {
    return (
      <div className="h-[calc(100vh-4rem)]">
        <GasChatRoomDetail
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">고객 지원 채팅</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          궁금한 점이 있으시면 채팅으로 문의해 주세요.
        </p>
      </div>

      {/* 진행 중인 채팅방 목록 */}
      {chatRooms.length > 0 && (
        <div className="mb-6 space-y-2">
          <h2 className="text-sm font-medium">이전 대화</h2>
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="bg-card hover:bg-accent w-full rounded-lg border p-4 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{room.title}</span>
                <span className="text-muted-foreground text-xs">
                  {room.statusDisplayName ?? room.status}
                </span>
              </div>
              {room.messages && (
                <p className="text-muted-foreground mt-1 truncate text-sm">
                  {room.messages[room.messages.length - 1].content}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 새 채팅 시작 */}
      <Button
        onClick={handleStartChat}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        <MessageCircle className="mr-2 size-5" />새 문의 시작하기
      </Button>
    </div>
  );
}
