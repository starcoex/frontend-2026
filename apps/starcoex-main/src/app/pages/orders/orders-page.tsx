import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useOrders } from '@starcoex-frontend/orders';

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

const CANCEL_STATUSES = ['CANCELLED', 'REFUNDED'];

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, isLoading } = useOrders();
  const [tab, setTab] = useState<'orders' | 'cancels'>('orders');

  useEffect(() => {
    fetchOrders(50, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeOrders = orders.filter(
    (o) => !CANCEL_STATUSES.includes(o.status)
  );
  const cancelOrders = orders.filter((o) => CANCEL_STATUSES.includes(o.status));

  const renderList = (list: typeof orders) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <ShoppingBag className="w-10 h-10 opacity-30" />
          <p className="text-sm">주문 내역이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="rounded-xl border bg-card overflow-hidden divide-y">
        {list.map((order) => {
          const statusConfig = ORDER_STATUS_LABEL[order.status] ?? {
            label: order.status,
            variant: 'outline',
          };
          return (
            <button
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-semibold truncate">
                  {order.storeName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(order.createdAt), 'yyyy.MM.dd HH:mm', {
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
                <p className="text-sm font-bold">
                  ₩{order.finalAmount.toLocaleString()}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">주문 내역</h1>
      </div>

      {/* 탭 */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="orders">
            주문 내역
            {activeOrders.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                {activeOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancels">취소 · 반품 · 교환</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          {renderList(activeOrders)}
        </TabsContent>

        <TabsContent value="cancels" className="mt-4">
          {renderList(cancelOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
