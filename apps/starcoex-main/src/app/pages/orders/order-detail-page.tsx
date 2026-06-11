import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ShoppingBag,
  MapPin,
  Phone,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  FAILED: '결제 실패',
  REFUNDED: '환불 완료',
  PARTIAL_REFUNDED: '부분 환불',
};

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchOrderById, currentOrder, isLoading } = useOrders();

  useEffect(() => {
    if (id) fetchOrderById(Number(id));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !currentOrder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_LABEL[currentOrder.status] ?? {
    label: currentOrder.status,
    variant: 'outline',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">주문 상세</h1>
      </div>

      {/* 주문 상태 카드 */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
              {currentOrder.storeName}
            </span>
          </div>
          <Badge variant={statusConfig.variant as any}>
            {statusConfig.label}
          </Badge>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">주문번호</span>
            <span className="font-mono font-medium">
              {currentOrder.orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">주문일시</span>
            <span>
              {format(new Date(currentOrder.createdAt), 'yyyy.MM.dd HH:mm', {
                locale: ko,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      {currentOrder.items && currentOrder.items.length > 0 && (
        <div className="divide-y">
          {currentOrder.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-5 py-3 gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {/* productId를 상품 식별자로 표시 */}
                  상품 #{item.productId}
                </p>
                <p className="text-xs text-muted-foreground">
                  수량: {item.quantity}
                </p>
                {item.status && (
                  <p className="text-xs text-muted-foreground">
                    상태: {item.status}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold shrink-0">
                ₩{(item.unitPrice * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 배송/방문 정보 */}
      {/* 배송/방문 정보 */}
      {currentOrder.customerInfo &&
        Object.keys(currentOrder.customerInfo).length > 0 && (
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">고객 정보</span>
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              {currentOrder.customerInfo['name'] && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이름</span>
                  <span>{currentOrder.customerInfo['name']}</span>
                </div>
              )}
              {currentOrder.customerInfo['phone'] && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">연락처</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {currentOrder.customerInfo['phone']}
                  </span>
                </div>
              )}
              {currentOrder.customerInfo['address'] && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">주소</span>
                  <span className="text-right">
                    {currentOrder.customerInfo['address']}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      {/* 결제 정보 */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">결제 정보</span>
        </div>
        <Separator />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">결제 상태</span>
            <span>
              {PAYMENT_STATUS_LABEL[currentOrder.paymentStatus] ??
                currentOrder.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">상품 금액</span>
            <span>₩{currentOrder.totalAmount.toLocaleString()}</span>
          </div>
          {currentOrder.discountAmount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>할인 금액</span>
              <span>- ₩{currentOrder.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-base pt-1">
            <span>최종 결제 금액</span>
            <span>₩{currentOrder.finalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
