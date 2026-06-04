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
import { Button } from '@/components/ui/button';
import { useQueue } from '@starcoex-frontend/queue';
import type { QueueSession } from '@starcoex-frontend/queue';
import { QueueSessionStatus } from '@starcoex-frontend/queue';
import { QUEUE_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';

// ── 스키마 기준 상태 전이 맵 ──────────────────────────────────────────────────
// callNext: WAITING → CALLED
// completeQueueService: IN_SERVICE → COMPLETED
// cancelQueueTicket: WAITING/CALLED → CANCELLED
// 그 외 직접 전이 없음

type ActionType = 'callNext' | 'complete' | 'cancel';

interface StatusAction {
  type: ActionType;
  label: string;
  description: string;
  variant: 'default' | 'destructive';
}

const getAvailableActions = (status: QueueSessionStatus): StatusAction[] => {
  switch (status) {
    case QueueSessionStatus.WAITING:
      return [
        {
          type: 'callNext',
          label: '호출 (CALLED)',
          description: '다음 고객을 호출합니다.',
          variant: 'default',
        },
        {
          type: 'cancel',
          label: '취소 (CANCELLED)',
          description: '대기를 취소 처리합니다.',
          variant: 'destructive',
        },
      ];
    case QueueSessionStatus.CALLED:
      return [
        {
          type: 'cancel',
          label: '취소 (CANCELLED)',
          description: '호출된 고객을 취소 처리합니다.',
          variant: 'destructive',
        },
      ];
    case QueueSessionStatus.IN_SERVICE:
      return [
        {
          type: 'complete',
          label: '완료 (COMPLETED)',
          description: '서비스 완료 처리합니다.',
          variant: 'default',
        },
      ];
    default:
      return [];
  }
};

interface QueueStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: QueueSession;
  onSuccess?: () => void;
}

export function QueueStatusUpdateDialog({
  open,
  onOpenChange,
  session,
  onSuccess,
}: QueueStatusUpdateDialogProps) {
  const { callNext, completeQueueService, cancelQueueTicket } = useQueue();
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [durationSec, setDurationSec] = useState(300); // 완료 시 기본 5분
  const [isLoading, setIsLoading] = useState(false);

  const availableActions = getAvailableActions(session.status);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedAction(null);
  };

  const handleSubmit = async () => {
    if (!selectedAction) return;
    setIsLoading(true);

    try {
      let res;

      if (selectedAction === 'callNext') {
        res = await callNext({ storeId: session.storeId });
      } else if (selectedAction === 'complete') {
        res = await completeQueueService({
          storeId: session.storeId,
          ticketId: session.redisTicketId,
          durationSec,
        });
      } else if (selectedAction === 'cancel') {
        res = await cancelQueueTicket({
          ticketId: session.redisTicketId,
          storeId: session.storeId,
        });
      }

      if (res?.success) {
        toast.success('상태가 변경되었습니다.');
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res?.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>대기 상태 변경</DialogTitle>
          <DialogDescription>
            티켓:{' '}
            <span className="font-mono font-medium">
              {session.ticketNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 현재 상태 */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium">현재 상태</p>
            <p className="text-sm text-muted-foreground">
              {QUEUE_STATUS_OPTIONS.find((o) => o.value === session.status)
                ?.label ?? session.status}
            </p>
          </div>

          {/* 가능한 액션 */}
          {availableActions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              현재 상태에서 변경 가능한 액션이 없습니다.
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">액션 선택 *</p>
              {availableActions.map((action) => (
                <button
                  key={action.type}
                  type="button"
                  onClick={() => setSelectedAction(action.type)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedAction === action.type
                      ? 'border-primary bg-primary/5 font-medium text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <p className="font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* 완료 처리 시 소요 시간 입력 */}
          {selectedAction === 'complete' && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">소요 시간 (초)</p>
              <input
                type="number"
                min={0}
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="300"
              />
              <p className="text-xs text-muted-foreground">
                약 {Math.round(durationSec / 60)}분
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedAction || isLoading || availableActions.length === 0
            }
            variant={
              availableActions.find((a) => a.type === selectedAction)
                ?.variant === 'destructive'
                ? 'destructive'
                : 'default'
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
