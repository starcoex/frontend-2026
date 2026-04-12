import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { Delivery } from '@starcoex-frontend/delivery';
import { BulkDeleteDialog } from '@starcoex-frontend/common';
import { DRIVER_STATUS_ACTIONS } from '@/app/pages/teams/delivery/driver/data/driver-data';

interface DriverDeliveryRowActionsProps {
  delivery: Delivery;
  onUpdated?: (delivery: Delivery) => void;
}

export function DriverDeliveryRowActions({
  delivery,
  onUpdated,
}: DriverDeliveryRowActionsProps) {
  const { updateDeliveryStatus } = useDelivery();
  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const actionConfig = DRIVER_STATUS_ACTIONS[delivery.status];

  // 수락 or 다음 상태로 전환
  const handleAccept = async () => {
    if (!actionConfig) return;
    setIsUpdating(true);
    try {
      const res = await updateDeliveryStatus(
        delivery.id,
        actionConfig.nextStatus
      );
      if (res.success && res.data) {
        toast.success(`${actionConfig.label} 처리되었습니다.`);
        onUpdated?.(res.data);
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 거절 — DRIVER_ASSIGNED 상태에서만 가능, PENDING으로 복귀
  const handleReject = async () => {
    setIsUpdating(true);
    try {
      const res = await updateDeliveryStatus(delivery.id, 'PENDING');
      if (res.success && res.data) {
        toast.success('배송을 거절했습니다.');
        onUpdated?.(res.data);
        setRejectDialogOpen(false);
      } else {
        toast.error(res.error?.message ?? '거절 처리에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!actionConfig) return null;

  const isAcceptStep = delivery.status === 'DRIVER_ASSIGNED';

  return (
    <>
      <div className="flex gap-2">
        {/* 수락 / 다음 단계 버튼 */}
        <Button
          size="sm"
          variant={actionConfig.variant}
          onClick={handleAccept}
          disabled={isUpdating}
          className="flex-1"
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="mr-1 h-4 w-4" />
              {actionConfig.label}
            </>
          )}
        </Button>

        {/* 거절 버튼 — DRIVER_ASSIGNED 단계에서만 표시 */}
        {isAcceptStep && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRejectDialogOpen(true)}
            disabled={isUpdating}
            className="text-destructive hover:text-destructive"
          >
            <XCircle className="mr-1 h-4 w-4" />
            거절
          </Button>
        )}
      </div>

      <BulkDeleteDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleReject}
        isDeleting={isUpdating}
        count={1}
        itemLabel="배송"
        description={`배송번호 ${delivery.deliveryNumber} 배송을 거절합니다. 배송이 대기 상태로 돌아갑니다.`}
      />
    </>
  );
}
