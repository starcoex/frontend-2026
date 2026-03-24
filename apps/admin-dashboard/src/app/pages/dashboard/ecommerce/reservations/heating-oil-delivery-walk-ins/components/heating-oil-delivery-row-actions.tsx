import { useState } from 'react';
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
} from 'lucide-react';
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
import type { HeatingOilDelivery } from '@starcoex-frontend/reservations';
import { useHeatingOilDeliveries } from '@starcoex-frontend/reservations';

interface HeatingOilDeliveryRowActionsProps {
  delivery: HeatingOilDelivery;
}

export function HeatingOilDeliveryRowActions({
  delivery,
}: HeatingOilDeliveryRowActionsProps) {
  const { updateDeliveryStatus, deleteDelivery } = useHeatingOilDeliveries();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (
    status: 'CONFIRMED' | 'DISPATCHED' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED'
  ) => {
    const res = await updateDeliveryStatus({
      deliveryId: delivery.id,
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
      const res = await deleteDelivery(delivery.id);
      if (res.success) {
        toast.success('배달이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const canConfirm = delivery.status === 'PENDING';
  const canDispatch = delivery.status === 'DRIVER_ASSIGNED';
  const canArrive = delivery.status === 'DISPATCHED';
  const canComplete = delivery.status === 'ARRIVED';
  const canCancel = !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(
    delivery.status
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
          {canConfirm && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('CONFIRMED')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              확정
            </DropdownMenuItem>
          )}
          {canDispatch && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('DISPATCHED')}>
              <Truck className="mr-2 h-4 w-4" />
              출발 처리
            </DropdownMenuItem>
          )}
          {canArrive && (
            <DropdownMenuItem onSelect={() => handleStatusUpdate('ARRIVED')}>
              <MapPin className="mr-2 h-4 w-4" />
              도착 처리
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
        title="배달 삭제"
        description={
          <>
            배달 번호{' '}
            <span className="font-semibold">{delivery.deliveryNumber}</span>
            을(를) 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    </>
  );
}
