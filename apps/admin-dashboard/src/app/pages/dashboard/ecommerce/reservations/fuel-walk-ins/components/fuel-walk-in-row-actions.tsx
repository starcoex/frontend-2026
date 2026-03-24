import { useState } from 'react';
import { MoreHorizontal, Play, CheckCircle, XCircle } from 'lucide-react';
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
import type { FuelWalkIn } from '@starcoex-frontend/reservations';
import { useFuelWalkIns } from '@starcoex-frontend/reservations';

interface FuelWalkInRowActionsProps {
  fuelWalkIn: FuelWalkIn;
}

export function FuelWalkInRowActions({
  fuelWalkIn,
}: FuelWalkInRowActionsProps) {
  const { updateFuelWalkInStatus, deleteFuelWalkIn } = useFuelWalkIns();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (
    status:
      | 'READY'
      | 'IN_SERVICE'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'PAYMENT_PENDING'
  ) => {
    const res = await updateFuelWalkInStatus({
      fuelWalkInId: fuelWalkIn.id,
      status,
    });
    if (res.success) {
      toast.success('상태가 변경되었습니다.');
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteFuelWalkIn(fuelWalkIn.id);
      if (res.success) {
        toast.success('주유 워크인이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const canReady = fuelWalkIn.status === 'WAITING';
  const canStart = fuelWalkIn.status === 'READY';
  const canComplete = fuelWalkIn.status === 'IN_SERVICE';
  const canCancel = !['COMPLETED', 'CANCELLED', 'REFUND_PENDING'].includes(
    fuelWalkIn.status
  );

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
          {canReady && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('READY')}>
              <Play className="mr-2 h-4 w-4" />
              준비 완료
            </DropdownMenuItem>
          )}
          {canStart && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('IN_SERVICE')}>
              <Play className="mr-2 h-4 w-4" />
              주유 시작
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
        title="주유 워크인 삭제"
        description={
          <>
            <span className="font-semibold">
              {fuelWalkIn.customerName ?? `#${fuelWalkIn.id}`}
            </span>
            의 주유 워크인을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    </>
  );
}
