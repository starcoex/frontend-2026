import { useState } from 'react';
import { MoreHorizontal, PhoneCall, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@starcoex-frontend/common';
import type { WalkIn } from '@starcoex-frontend/reservations';
import { useReservations } from '@starcoex-frontend/reservations';

interface WalkInRowActionsProps {
  walkIn: WalkIn;
}

export function WalkInRowActions({ walkIn }: WalkInRowActionsProps) {
  const { updateWalkInStatus, deleteWalkIn } = useReservations();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (
    status: 'CALLED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  ) => {
    const res = await updateWalkInStatus({ walkInId: walkIn.id, status });
    if (res.success) {
      toast.success('상태가 변경되었습니다.');
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteWalkIn(walkIn.id);
      if (res.success) {
        toast.success('워크인이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const canCall = walkIn.status === 'WAITING';
  const canStart = walkIn.status === 'CALLED';
  const canComplete = walkIn.status === 'IN_SERVICE';
  const canCancel = !['COMPLETED', 'CANCELLED'].includes(walkIn.status);

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
          {canCall && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('CALLED')}>
              <PhoneCall className="mr-2 h-4 w-4" />
              호출
            </DropdownMenuItem>
          )}
          {canStart && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('IN_SERVICE')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              서비스 시작
            </DropdownMenuItem>
          )}
          {canComplete && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('COMPLETED')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              완료
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleStatusUpdate('NO_SHOW')}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                노쇼
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleStatusUpdate('CANCELLED')}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                취소
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="워크인 삭제"
        description={
          <>
            <span className="font-semibold">
              {walkIn.customerName ?? `#${walkIn.id}`}
            </span>
            의 워크인을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    </>
  );
}
