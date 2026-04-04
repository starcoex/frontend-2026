import { useState } from 'react';
import { MoreHorizontal, Eye, Pencil, Truck, Copy } from 'lucide-react';
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

interface DeliveryRowActionsProps {
  delivery: Delivery;
}

export function DeliveryRowActions({ delivery }: DeliveryRowActionsProps) {
  const navigate = useNavigate();
  const { updateDeliveryStatus } = useDelivery();
  const [isUpdating, setIsUpdating] = useState(false);

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
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
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
          onSelect={() =>
            navigate(DELIVERY_ROUTES.DETAIL.replace(':id', String(delivery.id)))
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
