import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Package,
  User,
  MapPin,
  Clock,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useOrders } from '@starcoex-frontend/orders';

// ─── 주문 상태 흐름 (schema.prisma OrderStatus 기준) ─────────────────────────
const ORDER_STATUS_OPTIONS = [
  {
    value: 'PENDING',
    label: '주문 접수',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'CONFIRMED',
    label: '주문 확인',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'PREPARING',
    label: '상품 준비중',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'SHIPPED',
    label: '배송 시작',
    color: 'bg-indigo-100 text-indigo-800',
  },
  {
    value: 'DELIVERED',
    label: '배송 완료',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'CANCELLED', label: '주문 취소', color: 'bg-red-100 text-red-800' },
  {
    value: 'REFUNDED',
    label: '환불 완료',
    color: 'bg-orange-100 text-orange-800',
  },
  { value: 'RETURNED', label: '반품 완료', color: 'bg-gray-100 text-gray-800' },
] as const;

type OrderStatusValue = (typeof ORDER_STATUS_OPTIONS)[number]['value'];

// 처리 방식 레이블
const FULFILLMENT_LABELS: Record<string, string> = {
  DELIVERY: '🚚 배송',
  PICKUP: '🏪 픽업',
  ON_SITE: '⛽ 현장',
};

// ─── Zod 스키마 ───────────────────────────────────────────────────────────────
const FormSchema = z.object({
  status: z.string().min(1, { message: '상태를 선택하세요.' }),
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditOrderForm({
  order,
}: {
  order: NonNullable<ReturnType<typeof useOrders>['currentOrder']>;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateOrderStatus } = useOrders(); // fetchOrderById, isLoading, error, currentOrder 제거

  const orderId = id ? parseInt(id, 10) : NaN;

  // ❌ 아래 useEffect 제거 (OrderEditPage에서 이미 처리)
  // useEffect(() => {
  //   if (!isNaN(orderId)) fetchOrderById(orderId);
  // }, [orderId, fetchOrderById]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { status: order.status, reason: '' }, // order prop 직접 사용
  });

  useEffect(() => {
    form.reset({ status: order.status, reason: '' });
  }, [order, form]);

  const selectedStatus = form.watch('status') as OrderStatusValue;
  const currentStatusOption = ORDER_STATUS_OPTIONS.find(
    (s) => s.value === order.status // currentOrder → order
  );
  const selectedStatusOption = ORDER_STATUS_OPTIONS.find(
    (s) => s.value === selectedStatus
  );
  const isStatusChanged = selectedStatus !== order?.status;

  // ── 제출 ────────────────────────────────────────────────────────────────────
  async function onSubmit(data: FormValues) {
    if (!isStatusChanged) {
      toast.info('변경된 상태가 없습니다.');
      return;
    }

    const res = await updateOrderStatus({
      orderId,
      status: data.status as any,
      reason: data.reason || undefined,
    });

    if (res.success) {
      toast.success('주문 상태가 변경되었습니다.');
      navigate('/admin/orders');
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
  }

  // ── 로딩 / 에러 ─────────────────────────────────────────────────────────────
  if (isNaN(orderId)) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>유효하지 않은 주문 ID입니다.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>
          주문 목록으로
        </Button>
      </div>
    );
  }

  const customerInfo = (() => {
    try {
      const raw = order.customerInfo;
      if (!raw) return null;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as {
        name?: string;
        phone?: string;
        email?: string;
      };
    } catch {
      return null;
    }
  })();

  const deliveryAddress = (() => {
    try {
      const raw = order.deliveryAddress;
      if (!raw) return null;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as {
        address?: string;
        zipCode?: string;
        detail?: string;
      };
    } catch {
      return null;
    }
  })();

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/orders">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                주문 상태 변경
              </h1>
              <p className="text-muted-foreground text-sm font-mono">
                {order.orderNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || !isStatusChanged}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '상태 저장'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* ─── 좌측: 주문 요약 (읽기 전용) ──────────────────────────────── */}
          <div className="space-y-4 lg:col-span-4">
            {/* 고객 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{customerInfo?.name ?? '—'}</p>
                  <p className="text-muted-foreground">
                    {customerInfo?.phone ?? '—'}
                  </p>
                  {customerInfo?.email && (
                    <p className="text-muted-foreground">
                      {customerInfo.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 처리 방식 + 배송/픽업 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  {FULFILLMENT_LABELS[order.fulfillmentType] ??
                    order.fulfillmentType}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {order.fulfillmentType === 'DELIVERY' && deliveryAddress && (
                  <>
                    <p className="font-medium">{deliveryAddress.address}</p>
                    {deliveryAddress.detail && (
                      <p className="text-muted-foreground">
                        {deliveryAddress.detail}
                      </p>
                    )}
                    {deliveryAddress.zipCode && (
                      <p className="text-muted-foreground">
                        우편번호: {deliveryAddress.zipCode}
                      </p>
                    )}
                  </>
                )}
                {order.fulfillmentType === 'PICKUP' && order.pickupTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <p>{new Date(order.pickupTime).toLocaleString('ko-KR')}</p>
                  </div>
                )}
                {order.fulfillmentType === 'ON_SITE' && (
                  <p className="text-muted-foreground">
                    {order.deliveryMemo ?? '현장 방문'}
                  </p>
                )}
                {order.deliveryMemo && order.fulfillmentType === 'DELIVERY' && (
                  <p className="text-muted-foreground border-t pt-1 mt-1">
                    메모: {order.deliveryMemo}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 주문 상품 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  주문 상품
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {item.productSnapshot?.name ??
                          `상품 #${item.productId}`}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ₩{Number(item.unitPrice).toLocaleString()} ×{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="ml-2 font-medium shrink-0">
                      ₩{Number(item.totalPrice).toLocaleString()}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>상품 금액</span>
                    <span>₩{Number(order.totalAmount).toLocaleString()}</span>
                  </div>
                  {Number(order.deliveryAmount) > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>배송비</span>
                      <span>
                        ₩{Number(order.deliveryAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>최종 금액</span>
                    <span>₩{Number(order.finalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── 우측: 상태 변경 (편집 영역) ──────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 현재 상태 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">현재 상태</CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    currentStatusOption?.color ?? ''
                  }`}
                >
                  {currentStatusOption?.label ?? order.status}
                </span>
              </CardContent>
            </Card>

            {/* 상태 변경 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">상태 변경</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-1.5">
                          {ORDER_STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                field.value === opt.value
                                  ? 'border-primary bg-primary/5 font-medium text-primary'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${opt.color}`}
                              >
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 변경 사유 (상태가 바뀐 경우에만 표시) */}
                {isStatusChanged && (
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">변경 사유</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={
                              selectedStatus === 'CANCELLED'
                                ? '취소 사유를 입력하세요.'
                                : selectedStatus === 'REFUNDED'
                                ? '환불 사유를 입력하세요.'
                                : '변경 사유 (선택)'
                            }
                            rows={3}
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* 변경 예고 */}
                {isStatusChanged && (
                  <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <span
                      className={`font-medium ${currentStatusOption?.color} rounded px-1`}
                    >
                      {currentStatusOption?.label}
                    </span>
                    {' → '}
                    <span
                      className={`font-medium ${selectedStatusOption?.color} rounded px-1`}
                    >
                      {selectedStatusOption?.label}
                    </span>
                    으로 변경됩니다.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 결제 상태 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  결제 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">
                  {order.paymentStatus}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
