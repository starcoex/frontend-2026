import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { useOrders } from '@starcoex-frontend/orders';
import { useAuth } from '@starcoex-frontend/auth';
import { APP_CONFIG } from '@/app/config/app.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Fuel,
  ChevronRight,
  ShoppingBag,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ── 주문 상태 UI 설정 ──────────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: { label: '대기중', variant: 'secondary', icon: Clock },
  CONFIRMED: { label: '확정', variant: 'default', icon: CheckCircle2 },
  PROCESSING: { label: '처리중', variant: 'default', icon: CalendarClock },
  COMPLETED: { label: '완료', variant: 'outline', icon: CheckCircle2 },
  CANCELLED: { label: '취소', variant: 'destructive', icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING: { label: '결제대기', variant: 'secondary' },
  COMPLETED: { label: '결제완료', variant: 'default' },
  FAILED: { label: '결제실패', variant: 'destructive' },
  REFUNDED: { label: '환불', variant: 'outline' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchOrders, orders, isLoading } = useOrders();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchOrders(50, 0);
  }, [currentUser, fetchOrders, navigate]);

  return (
    <>
      <PageHead
        title={`주문 내역 - ${APP_CONFIG.seo.siteName}`}
        description="나의 주문 내역을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/orders`}
      />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* 헤더 */}
          <div className="mb-6 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h1 className="text-2xl font-bold">주문 내역</h1>
          </div>

          {/* 로딩 */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 주문 없음 */}
          {!isLoading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Fuel className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                주문 내역이 없습니다.
              </p>
              <Button onClick={() => navigate('/store/purchase')}>
                연료 구매하기
              </Button>
            </div>
          )}

          {/* 주문 목록 */}
          {!isLoading && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusConfig =
                  ORDER_STATUS_CONFIG[order.status] ??
                  ORDER_STATUS_CONFIG['PENDING'];
                const paymentConfig =
                  PAYMENT_STATUS_CONFIG[order.paymentStatus] ??
                  PAYMENT_STATUS_CONFIG['PENDING'];
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 min-w-0">
                          {/* 주문번호 + 날짜 */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-muted-foreground">
                              #{order.id}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(order.createdAt),
                                'MM/dd HH:mm',
                                {
                                  locale: ko,
                                }
                              )}
                            </span>
                          </div>

                          {/* 매장명 */}
                          <p className="font-semibold truncate">
                            {order.storeName}
                          </p>

                          {/* 상품 목록 */}
                          <p className="text-sm text-muted-foreground truncate">
                            {order.items
                              ?.map((item) => {
                                try {
                                  const snap =
                                    typeof item.productSnapshot === 'string'
                                      ? JSON.parse(item.productSnapshot)
                                      : item.productSnapshot;
                                  return (
                                    snap?.name ?? `상품 #${item.productId}`
                                  );
                                } catch {
                                  return `상품 #${item.productId}`;
                                }
                              })
                              .join(', ')}
                          </p>

                          {/* 금액 */}
                          <p className="font-bold text-primary">
                            {order.totalAmount?.toLocaleString()}원
                          </p>
                        </div>

                        {/* 상태 배지 + 화살표 */}
                        <div className="flex flex-col items-end gap-2 ml-3 shrink-0">
                          <Badge
                            variant={statusConfig.variant}
                            className="gap-1"
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </Badge>
                          <Badge variant={paymentConfig.variant}>
                            {paymentConfig.label}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
