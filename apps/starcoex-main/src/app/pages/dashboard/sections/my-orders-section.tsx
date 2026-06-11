import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Order } from '@starcoex-frontend/orders';

const ORDER_STATUS_LABEL: Record<string, { label: string; variant: string }> = {
  PENDING: { label: '주문 접수', variant: 'secondary' },
  CONFIRMED: { label: '확인됨', variant: 'default' },
  PREPARING: { label: '준비중', variant: 'warning' },
  IN_SERVICE: { label: '서비스중', variant: 'warning' },
  COMPLETED: { label: '완료', variant: 'success' },
  SHIPPED: { label: '배송중', variant: 'default' },
  DELIVERED: { label: '배송완료', variant: 'success' },
  CANCELLED: { label: '취소', variant: 'destructive' },
  REFUNDED: { label: '환불', variant: 'outline' },
};

interface MyOrdersSectionProps {
  orders: Order[];
}

export const MyOrdersSection: React.FC<MyOrdersSectionProps> = ({ orders }) => {
  const navigate = useNavigate();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">최근 주문 내역</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground h-8"
          onClick={() => navigate('/orders')}
        >
          전체 보기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <ShoppingBag className="w-8 h-8 opacity-30" />
            <p className="text-sm">주문 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => {
              const statusConfig = ORDER_STATUS_LABEL[order.status] ?? {
                label: order.status,
                variant: 'outline',
              };
              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {order.storeName}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MM월 dd일 HH:mm', {
                        locale: ko,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge
                      variant={statusConfig.variant as any}
                      className="text-xs"
                    >
                      {statusConfig.label}
                    </Badge>
                    <p className="text-sm font-semibold">
                      ₩{order.finalAmount.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
