import { useState } from 'react';
import { MoreHorizontal, Eye, Pencil, Truck, Copy, Trash2 } from 'lucide-react';
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
import type { Delivery } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import { BulkDeleteDialog } from '@starcoex-frontend/common';

interface DeliveryRowActionsProps {
  delivery: Delivery;
  onStatusChange?: (deliveryId: number, status: Delivery['status']) => void;
  onDeleted?: (deliveryId: number) => void; // ✅ 삭제 콜백 추가
}

export function DeliveryRowActions({
  delivery,
  onStatusChange,
  onDeleted,
}: DeliveryRowActionsProps) {
  const navigate = useNavigate();
  const { updateDeliveryStatus, deleteDelivery } = useDelivery();
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(delivery.deliveryNumber);
    toast.success('배송번호가 복사되었습니다.');
  };

  const handlePickup = async () => {
    setIsUpdating(true);
    try {
      const res = await updateDeliveryStatus(delivery.id, 'PICKED_UP');
      if (res.success) {
        toast.success('픽업 완료로 변경되었습니다.');
        onStatusChange?.(delivery.id, 'PICKED_UP');
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ 실제 Soft Delete API 사용
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteDelivery(delivery.id);
      if (res.success) {
        toast.success('배송이 삭제되었습니다.');
        onDeleted?.(delivery.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeletable = !['IN_TRANSIT', 'PICKED_UP', 'ACCEPTED'].includes(
    delivery.status
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() =>
              navigate(
                DELIVERY_ROUTES.DETAIL.replace(':id', String(delivery.id))
              )
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              navigate(DELIVERY_ROUTES.EDIT.replace(':id', String(delivery.id)))
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyNumber}>
            <Copy className="mr-2 h-4 w-4" />
            배송번호 복사
          </DropdownMenuItem>
          {delivery.status === 'DRIVER_ASSIGNED' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handlePickup} disabled={isUpdating}>
                <Truck className="mr-2 h-4 w-4" />
                픽업 완료 처리
              </DropdownMenuItem>
            </>
          )}
          {isDeletable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <BulkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        count={1}
        itemLabel="배송"
        description={`배송번호 ${delivery.deliveryNumber}을(를) 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
      />
    </>
  );
}
