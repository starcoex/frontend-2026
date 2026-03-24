import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '@starcoex-frontend/reservations';
import { format, addDays } from 'date-fns';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number | null;
}

export function ServiceGenerateSlotsDialog({
  open,
  onOpenChange,
  serviceId,
}: Props) {
  const { generateSlots } = useReservations();
  const [isLoading, setIsLoading] = useState(false); // ← 전역 isLoading 대신 로컬 상태 사용
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(
    format(addDays(new Date(), 30), 'yyyy-MM-dd')
  );

  const handleGenerate = async () => {
    if (!serviceId) return;
    setIsLoading(true);

    try {
      const res = await generateSlots({ serviceId, fromDate, toDate });

      if (res.success) {
        toast.success(
          `슬롯 ${res.data?.generatedCount ?? 0}개가 생성되었습니다.`
        );
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '슬롯 생성에 실패했습니다.');
      }
    } catch {
      toast.error('슬롯 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // ← finally로 반드시 해제
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>슬롯 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>시작 날짜</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>종료 날짜</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            활성화된 운영 템플릿 기준으로 슬롯이 자동 생성됩니다.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button onClick={handleGenerate} disabled={isLoading || !serviceId}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isLoading ? '생성 중...' : '슬롯 생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
