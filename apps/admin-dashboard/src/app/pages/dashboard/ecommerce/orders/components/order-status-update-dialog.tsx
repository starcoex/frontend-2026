import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOrders } from '@starcoex-frontend/orders';
import type { Order } from '@starcoex-frontend/orders';
import {
  NEXT_STATUS_MAP,
  ORDER_STATUS_OPTIONS,
  OrderStatusValue,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';
import { ORDER_STATUS_MAP } from '@/app/pages/dashboard/ecommerce/orders/components/order-status-bage';

interface OrderStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onSuccess?: () => void; // ✅ 추가
}

export function OrderStatusUpdateDialog({
  open,
  onOpenChange,
  order,
  onSuccess, // ✅ 추가
}: OrderStatusUpdateDialogProps) {
  const { updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusValue | ''>(
    ''
  );
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableStatuses =
    NEXT_STATUS_MAP[order.status as OrderStatusValue] ?? [];

  const handleClose = () => {
    onOpenChange(false);
    setSelectedStatus('');
    setReason('');
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    setIsLoading(true);
    try {
      const res = await updateOrderStatus({
        orderId: order.id,
        status: selectedStatus,
        reason: reason || undefined,
      });
      if (res.success) {
        toast.success(
          res.data?.statusChangeMessage ?? '주문 상태가 변경되었습니다.'
        );
        onSuccess?.(); // ✅ 재조회 트리거
        handleClose();
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>주문 상태 변경</DialogTitle>
          <DialogDescription>
            주문번호:{' '}
            <span className="font-mono font-medium">{order.orderNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 현재 상태 */}
          <div className="space-y-1.5">
            <Label>현재 상태</Label>
            <p className="text-muted-foreground text-sm">
              {ORDER_STATUS_MAP[order.status as OrderStatusValue]?.label ??
                order.status}
            </p>
          </div>

          {/* 변경할 상태 */}
          <div className="space-y-1.5">
            <Label>변경할 상태 *</Label>
            {availableStatuses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                더 이상 변경 가능한 상태가 없습니다.
              </p>
            ) : (
              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as OrderStatusValue)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => {
                    const option = ORDER_STATUS_OPTIONS.find(
                      (o) => o.value === status
                    );
                    return (
                      <SelectItem key={status} value={status}>
                        {option?.label ?? status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* 변경 사유 */}
          <div className="space-y-1.5">
            <Label>변경 사유 (선택)</Label>
            <Textarea
              placeholder="상태 변경 사유를 입력하세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedStatus || isLoading || availableStatuses.length === 0
            }
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            변경하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
