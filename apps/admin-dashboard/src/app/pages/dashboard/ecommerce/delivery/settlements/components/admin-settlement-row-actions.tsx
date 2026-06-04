import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCheck, IconCash } from '@tabler/icons-react';
import type {
  DriverSettlement,
  ApproveSettlementInput,
  ProcessPaymentInput,
} from '@starcoex-frontend/delivery';
import { toast } from 'sonner';

interface AdminSettlementRowActionsProps {
  settlement: DriverSettlement;
  onApprove: (input: ApproveSettlementInput) => Promise<any>;
  onPay: (input: ProcessPaymentInput) => Promise<any>;
  onUpdated: (updated: DriverSettlement) => void;
}

export function AdminSettlementRowActions({
  settlement,
  onApprove,
  onPay,
  onUpdated,
}: AdminSettlementRowActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await onApprove({ settlementId: settlement.id });
      if (res.success && res.data) {
        toast.success('승인 처리되었습니다.');
        onUpdated(res.data);
      } else {
        toast.error(res.error?.message ?? '승인에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const res = await onPay({
        settlementId: settlement.id,
        paymentMethod: '계좌이체',
      });
      if (res.success && res.data) {
        toast.success('지급 처리되었습니다.');
        onUpdated(res.data);
      } else {
        toast.error(res.error?.message ?? '지급 처리에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canApprove = settlement.status === 'CALCULATED';
  const canPay = settlement.status === 'APPROVED';

  if (!canApprove && !canPay) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only">메뉴 열기</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>액션</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canApprove && (
          <DropdownMenuItem onSelect={handleApprove} disabled={isLoading}>
            <IconCheck className="mr-2 h-4 w-4" />
            승인 처리
          </DropdownMenuItem>
        )}
        {canPay && (
          <DropdownMenuItem onSelect={handlePay} disabled={isLoading}>
            <IconCash className="mr-2 h-4 w-4" />
            지급 처리
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
