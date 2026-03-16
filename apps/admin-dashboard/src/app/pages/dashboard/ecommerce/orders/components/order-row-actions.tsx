import { useState } from 'react';
import { MoreHorizontal, Eye, Pencil, RefreshCw, Copy } from 'lucide-react';
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
import type { Order } from '@starcoex-frontend/orders';
import { OrderStatusUpdateDialog } from './order-status-update-dialog';
import {
  NEXT_STATUS_MAP,
  type OrderStatusValue,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';

export function OrderRowActions({ order }: { order: Order }) {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState(false);

  const canChangeStatus =
    (NEXT_STATUS_MAP[order.status as OrderStatusValue] ?? []).length > 0;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success('주문번호가 복사되었습니다.');
  };

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
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/orders/${order.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/orders/${order.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          {canChangeStatus && (
            <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              상태 변경
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={handleCopyOrderNumber}>
            <Copy className="mr-2 h-4 w-4" />
            주문번호 복사
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderStatusUpdateDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        order={order}
      />
    </>
  );
}
