import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useChats } from '@starcoex-frontend/chats';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ChatRoom } from '@starcoex-frontend/chats';

interface ChatRoomDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: ChatRoom;
  onSuccess?: () => void;
}

export function ChatRoomDeleteDialog({
  open,
  onOpenChange,
  room,
  onSuccess,
}: ChatRoomDeleteDialogProps) {
  const { deleteChatRoom, fetchAdminChatRooms } = useChats();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteChatRoom(room.id, false);
      if (res.success) {
        toast.success('채팅방이 삭제되었습니다.');
        await fetchAdminChatRooms();
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '채팅방 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>채팅방 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{room.title}</span> 채팅방을
            삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
