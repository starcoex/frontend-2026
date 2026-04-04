import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHead } from '@starcoex-frontend/common';
import { useOrders } from '@starcoex-frontend/orders';
import { useAuth } from '@starcoex-frontend/auth';
import { APP_CONFIG } from '@/app/config/app.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Store,
  Package,
  User,
  MapPin,
  Trash2,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  CONFIRMED: '확정',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  REFUNDED: '환불 완료',
};

const FULFILLMENT_TYPE_LABELS: Record<string, string> = {
  ON_SITE: '현장 방문',
  DELIVERY: '배송',
  PICKUP: '픽업',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchOrderById, currentOrder, isLoading, deleteOrder } = useOrders();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    if (id) fetchOrderById(Number(id));
  }, [id, currentUser, fetchOrderById, navigate]);

  // ── 취소 가능 여부 ──────────────────────────────────────────────────────────
  const isCancellable =
    currentOrder?.status === 'PENDING' &&
    currentOrder?.paymentStatus === 'PENDING';

  // ── 주문 취소 처리 ──────────────────────────────────────────────────────────
  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    setIsCancelling(true);
    try {
      const res = await deleteOrder(currentOrder.id);
      if (res.success) {
        toast.success('주문이 취소되었습니다.');
        navigate('/orders');
      } else {
        toast.error(res.error?.message ?? '주문 취소에 실패했습니다.');
      }
    } catch {
      toast.error('주문 취소 중 오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
    }
  };

  // customerInfo 파싱
  let customerInfo: Record<string, string> = {};
  try {
    customerInfo =
      typeof currentOrder?.customerInfo === 'string'
        ? JSON.parse(currentOrder.customerInfo)
        : currentOrder?.customerInfo ?? {};
  } catch {
    customerInfo = {};
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl text-center py-20">
          <p className="text-muted-foreground mb-4">
            주문 정보를 찾을 수 없습니다.
          </p>
          <Button onClick={() => navigate('/orders')}>주문 목록으로</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`주문 상세 #${currentOrder.id} - ${APP_CONFIG.seo.siteName}`}
        description="주문 상세 내역을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/orders/${currentOrder.id}`}
      />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">주문 #{currentOrder.id}</h1>
              <p className="text-xs text-muted-foreground">
                {format(
                  new Date(currentOrder.createdAt),
                  'yyyy년 MM월 dd일 HH:mm',
                  { locale: ko }
                )}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Badge>
                {ORDER_STATUS_LABELS[currentOrder.status] ??
                  currentOrder.status}
              </Badge>
              <Badge variant="outline">
                {PAYMENT_STATUS_LABELS[currentOrder.paymentStatus] ??
                  currentOrder.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* ── 취소 가능 안내 배너 ─────────────────────────────────────────── */}
          {isCancellable && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                      결제 전 주문입니다
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400 mt-0.5">
                      아직 결제가 완료되지 않았습니다. 주문을 취소할 수
                      있습니다.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowCancelDialog(true)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    주문 취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 취소된 주문 안내 */}
          {currentOrder.status === 'CANCELLED' && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
              <CardContent className="p-4 text-sm text-red-700 dark:text-red-400 text-center">
                취소된 주문입니다.
              </CardContent>
            </Card>
          )}

          {/* 매장 정보 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Store className="w-4 h-4 opacity-60" />
                매장 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">매장명</span>
                <span className="font-medium">{currentOrder.storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">처리 방식</span>
                <span className="font-medium">
                  {FULFILLMENT_TYPE_LABELS[currentOrder.fulfillmentType] ??
                    currentOrder.fulfillmentType}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 주문 상품 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4 opacity-60" />
                주문 상품
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentOrder.items?.map((item) => {
                let snapshot: Record<string, any> = {};
                try {
                  snapshot =
                    typeof item.productSnapshot === 'string'
                      ? JSON.parse(item.productSnapshot)
                      : item.productSnapshot ?? {};
                } catch {
                  snapshot = {};
                }

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium">
                        {snapshot.name ?? `상품 #${item.productId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {[
                          snapshot.fuelType && `유종: ${snapshot.fuelType}`,
                          snapshot.isFullTank && '가득',
                          snapshot.estimatedLiter &&
                            `약 ${snapshot.estimatedLiter}L`,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.unitPrice?.toLocaleString()}원 × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">
                      {(item.unitPrice * item.quantity)?.toLocaleString()}원
                    </span>
                  </div>
                );
              })}

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{currentOrder.totalAmount?.toLocaleString()}원</span>
                </div>
                {(currentOrder.deliveryAmount ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">배달료</span>
                    <span>
                      {currentOrder.deliveryAmount?.toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>최종 결제금액</span>
                  <span className="text-primary">
                    {(
                      (currentOrder.totalAmount ?? 0) +
                      (currentOrder.deliveryAmount ?? 0)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 고객 정보 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 opacity-60" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">이름</span>
                <span>{customerInfo.name ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">연락처</span>
                <span>{customerInfo.phone ?? '-'}</span>
              </div>
            </CardContent>
          </Card>

          {/* 현장 결제 안내 */}
          {currentOrder.fulfillmentType === 'ON_SITE' &&
            currentOrder.paymentStatus === 'PENDING' &&
            currentOrder.status !== 'CANCELLED' && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-800 dark:text-blue-300">
                        현장 결제 안내
                      </p>
                      <p className="text-blue-700 dark:text-blue-400 mt-1">
                        주유소 방문 시{' '}
                        <strong>주문번호 #{currentOrder.id}</strong>를 직원에게
                        알려주세요.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/orders')}
          >
            주문 목록으로
          </Button>
        </div>
      </div>

      {/* ── 주문 취소 확인 다이얼로그 ─────────────────────────────────────────── */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>주문을 취소하시겠습니까?</DialogTitle>
            <DialogDescription>
              주문 #{currentOrder.id}을 취소합니다.
              <br />
              취소 후에는 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              돌아가기
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  취소 중...
                </>
              ) : (
                '주문 취소'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
