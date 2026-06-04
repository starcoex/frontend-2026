import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
}

interface Props {
  orders: Order[];
  isLoading: boolean;
}

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | 'success'
      | 'warning'
      | 'info';
  }
> = {
  PENDING: { label: '대기', variant: 'warning' },
  CONFIRMED: { label: '확정', variant: 'info' },
  PROCESSING: { label: '처리중', variant: 'info' },
  COMPLETED: { label: '완료', variant: 'success' },
  CANCELLED: { label: '취소', variant: 'destructive' },
};

const EXPORT_COLUMNS = [
  { header: '주문번호', key: 'orderNumber' },
  { header: '상태', key: 'statusLabel' },
  { header: '금액', key: 'totalAmountFormatted' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function OrderDetailDrawer({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: Order | null;
}) {
  const navigate = useNavigate();
  if (!order) return null;
  const cfg = STATUS_MAP[order.status] ?? {
    label: order.status,
    variant: 'outline' as const,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>주문 상세</SheetTitle>
          <SheetDescription className="font-mono">
            {order.orderNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">주문 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">주문번호</dt>
                <dd className="font-mono font-medium">{order.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">금액</dt>
                <dd className="font-bold">
                  ₩{order.totalAmount.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            상세 페이지로 이동
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function OverviewOrderStatus({ orders, isLoading }: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } = useDetailDrawer<Order>();

  const exportData = orders.map((o) => ({
    orderNumber: o.orderNumber,
    statusLabel: STATUS_MAP[o.status]?.label ?? o.status,
    totalAmountFormatted: `₩${o.totalAmount.toLocaleString()}`,
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>주문 현황</CardTitle>
              <CardDescription>상태별 주문 수</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="orders"
                pdfTitle="주문 현황"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/orders')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          ) : (
            <>
              {/* 상태별 요약 */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(STATUS_MAP).map(([status, cfg]) => (
                  <div
                    key={status}
                    className="rounded-md border p-2 text-center"
                  >
                    <Badge variant={cfg.variant} className="mb-1 text-xs">
                      {cfg.label}
                    </Badge>
                    <p className="text-lg font-bold">
                      {orders.filter((o) => o.status === status).length}
                    </p>
                  </div>
                ))}
              </div>

              {/* 최근 주문 목록 */}
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => {
                  const cfg = STATUS_MAP[order.status] ?? {
                    label: order.status,
                    variant: 'outline' as const,
                  };
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <span className="font-mono text-xs">
                        {order.orderNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ₩{order.totalAmount.toLocaleString()}
                        </span>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        {/* ⋮ 메뉴 */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDrawer(order)}>
                              상세보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/orders/${order.id}/edit`)
                              }
                            >
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/orders/${order.id}`)
                              }
                            >
                              상태변경
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <OrderDetailDrawer open={open} onOpenChange={setOpen} order={selected} />
    </>
  );
}
