import { MoreHorizontal, Eye, Copy } from 'lucide-react';
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
import type { Payment } from '@starcoex-frontend/payments';

interface PaymentRowActionsProps {
  payment: Payment;
}

export function PaymentRowActions({ payment }: PaymentRowActionsProps) {
  const navigate = useNavigate();

  const handleCopyId = () => {
    navigator.clipboard.writeText(payment.portOneId);
    toast.success('결제 ID가 복사되었습니다.');
  };

  return (
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
          onSelect={() => navigate(`/admin/payments/${payment.portOneId}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          결제 ID 복사
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
