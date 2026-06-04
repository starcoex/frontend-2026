import { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Send,
  Archive,
  Trash2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useNotices } from '@starcoex-frontend/notices';
import type { Notice } from '@starcoex-frontend/notices';

interface NoticeRowActionsProps {
  notice: Notice;
  onRefresh?: () => void;
}

export function NoticeRowActions({ notice, onRefresh }: NoticeRowActionsProps) {
  const navigate = useNavigate();
  const { publishNotice, archiveNotice, deleteNotice } = useNotices();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canPublish = notice.status === 'DRAFT' || notice.status === 'SCHEDULED';
  const canArchive = notice.status === 'PUBLISHED';

  const handlePublish = async () => {
    const res = await publishNotice({ id: notice.id });
    if (res.success) {
      toast.success('공지가 발행되었습니다.');
      onRefresh?.();
    } else {
      toast.error(res.error?.message ?? '발행에 실패했습니다.');
    }
  };

  const handleArchive = async () => {
    const res = await archiveNotice({ id: notice.id });
    if (res.success) {
      toast.success('공지가 종료되었습니다.');
      onRefresh?.();
    } else {
      toast.error(res.error?.message ?? '종료에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    const res = await deleteNotice({ id: notice.id });
    if (res.success) {
      toast.success('공지가 삭제되었습니다.');
      onRefresh?.();
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(notice.title);
    toast.success('제목이 복사되었습니다.');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/notices/${notice.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/notices/${notice.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          {canPublish && (
            <DropdownMenuItem onSelect={handlePublish}>
              <Send className="mr-2 h-4 w-4" />
              발행
            </DropdownMenuItem>
          )}
          {canArchive && (
            <DropdownMenuItem onSelect={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              종료
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={handleCopyTitle}>
            <Copy className="mr-2 h-4 w-4" />
            제목 복사
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">"{notice.title}"</span> 공지를
              삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
