import { ChevronLeft, Edit3Icon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '@starcoex-frontend/orders';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { OrderStatusUpdateDialog } from '../components/order-status-update-dialog';
import { useState } from 'react';
import {
  NEXT_STATUS_MAP,
  OrderStatusValue,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';
import {
  FulfillmentBadge,
  ORDER_STATUS_MAP,
  OrderStatusBadge,
  PaymentStatusBadge,
} from '@/app/pages/dashboard/ecommerce/orders/components/order-status-bage';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, isLoading, error, fetchOrderById } = useOrders();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (id) fetchOrderById(parseInt(id));
  }, [id, fetchOrderById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            주문 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '주문을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/orders')}>
          주문 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const canChangeStatus =
    (NEXT_STATUS_MAP[currentOrder.status as OrderStatusValue] ?? []).length > 0;

  const customerInfo = (() => {
    try {
      const raw = currentOrder.customerInfo;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Record<
        string,
        string
      >;
    } catch {
      return {} as Record<string, string>;
    }
  })();

  const deliveryAddress = (() => {
    try {
      const raw = currentOrder.deliveryAddress;
      if (!raw) return null;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Record<
        string,
        string
      >;
    } catch {
      return null;
    }
  })();

  return (
    <>
      <PageHead
        title={`주문 ${currentOrder.orderNumber} - ${COMPANY_INFO.name}`}
        description="주문 상세 정보"
        keywords={['주문 상세', currentOrder.orderNumber, COMPANY_INFO.name]}
        og={{
          title: `주문 ${currentOrder.orderNumber} - ${COMPANY_INFO.name}`,
          description: '주문 상세 정보',
          image: '/images/og-orders.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/admin/orders')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                주문 #{currentOrder.orderNumber}
              </h1>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap gap-2 text-sm">
              <span>{currentOrder.storeName}</span>
              <span>·</span>
              <span>
                {format(
                  new Date(currentOrder.createdAt),
                  'yyyy년 MM월 dd일 HH:mm',
                  {
                    locale: ko,
                  }
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canChangeStatus && (
              <Button
                variant="outline"
                onClick={() => setStatusDialogOpen(true)}
              >
                상태 변경
              </Button>
            )}
            <Button onClick={() => navigate(`/admin/orders/${id}/edit`)}>
              <Edit3Icon className="mr-1 h-4 w-4" />
              수정
            </Button>
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={currentOrder.status} />
          <PaymentStatusBadge status={currentOrder.paymentStatus} />
          <FulfillmentBadge type={currentOrder.fulfillmentType} />
        </div>

        {/* 상단 스탯 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted flex flex-col gap-1 rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">상품 금액</span>
            <span className="text-lg font-semibold">
              ₩{currentOrder.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="bg-muted flex flex-col gap-1 rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">배송비</span>
            <span className="text-lg font-semibold">
              ₩{currentOrder.deliveryAmount.toLocaleString()}
            </span>
          </div>
          <div className="bg-muted flex flex-col gap-1 rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">최종 금액</span>
            <span className="text-lg font-semibold">
              ₩{currentOrder.finalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 탭 */}
        <Tabs defaultValue="items">
          <TabsList className="w-full">
            <TabsTrigger value="items" className="flex-1">
              주문 상품
              <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                {currentOrder.items.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex-1">
              고객 정보
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              상태 이력
              {currentOrder.OrderStatusHistory.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {currentOrder.OrderStatusHistory.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 주문 상품 탭 */}
          <TabsContent value="items" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>주문 상품 ({currentOrder.items.length}개)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentOrder.items.map((item) => {
                  const snapshot = item.productSnapshot as Record<string, any>;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-md border px-4 py-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {snapshot?.name ?? `상품 #${item.productId}`}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          ₩{item.unitPrice.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-semibold">
                          ₩{item.totalPrice.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고객 정보 탭 */}
          <TabsContent value="customer" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>고객 및 배송 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">이름</TableCell>
                        <TableCell>{customerInfo?.name ?? '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">연락처</TableCell>
                        <TableCell>{customerInfo?.phone ?? '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">이메일</TableCell>
                        <TableCell>
                          {customerInfo?.email ??
                            currentOrder.guestEmail ??
                            '-'}
                        </TableCell>
                      </TableRow>
                      {deliveryAddress && (
                        <TableRow>
                          <TableCell className="font-semibold">주소</TableCell>
                          <TableCell>
                            {deliveryAddress?.address ?? '-'}
                          </TableCell>
                        </TableRow>
                      )}
                      {currentOrder.deliveryMemo && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            배송 메모
                          </TableCell>
                          <TableCell>{currentOrder.deliveryMemo}</TableCell>
                        </TableRow>
                      )}
                      {currentOrder.pickupTime && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            픽업 시간
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(currentOrder.pickupTime),
                              'yyyy년 MM월 dd일 HH:mm',
                              { locale: ko }
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 상태 이력 탭 */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>상태 변경 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrder.OrderStatusHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    상태 변경 이력이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {[...currentOrder.OrderStatusHistory]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((h, idx) => (
                        <div key={h.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="bg-primary size-2.5 rounded-full" />
                            {idx <
                              currentOrder.OrderStatusHistory.length - 1 && (
                              <div className="bg-border w-px flex-1" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-sm font-medium">
                              {h.fromStatus && (
                                <span className="text-muted-foreground">
                                  {ORDER_STATUS_MAP[
                                    h.fromStatus as OrderStatusValue
                                  ]?.label ?? h.fromStatus}
                                  {' → '}
                                </span>
                              )}
                              {ORDER_STATUS_MAP[h.toStatus as OrderStatusValue]
                                ?.label ?? h.toStatus}
                            </p>
                            {h.reason && (
                              <p className="text-muted-foreground text-xs">
                                {h.reason}
                              </p>
                            )}
                            <p className="text-muted-foreground text-xs">
                              {format(new Date(h.createdAt), 'MM/dd HH:mm', {
                                locale: ko,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <OrderStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={currentOrder}
        onSuccess={() => fetchOrderById(parseInt(id!))} // ✅ 추가
      />
    </>
  );
}
