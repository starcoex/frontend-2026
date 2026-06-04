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

interface Delivery {
  id: number;
  deliveryNumber?: string;
  status: string;
}

interface Props {
  deliveries: Delivery[];
  isLoading: boolean;
}

const DELIVERY_STATUS_MAP: Record<
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
  ASSIGNED: { label: '배정', variant: 'info' },
  PICKED_UP: { label: '픽업', variant: 'info' },
  IN_TRANSIT: { label: '배송중', variant: 'default' },
  DELIVERED: { label: '완료', variant: 'success' },
  FAILED: { label: '실패', variant: 'destructive' },
};

const EXPORT_COLUMNS = [
  { header: '배송번호', key: 'deliveryNumber' },
  { header: '상태', key: 'statusLabel' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function DeliveryDetailDrawer({
  open,
  onOpenChange,
  delivery,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  delivery: Delivery | null;
}) {
  const navigate = useNavigate();
  if (!delivery) return null;
  const cfg = DELIVERY_STATUS_MAP[delivery.status] ?? {
    label: delivery.status,
    variant: 'outline' as const,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>배송 상세</SheetTitle>
          <SheetDescription className="font-mono">
            {delivery.deliveryNumber ?? `#${delivery.id}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">배송 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">배송번호</dt>
                <dd className="font-mono font-medium">
                  {delivery.deliveryNumber ?? `#${delivery.id}`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/delivery/${delivery.id}`)}
          >
            상세 페이지로 이동
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/admin/delivery/tracking')}
          >
            실시간 추적
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function OverviewDeliveryStatus({ deliveries, isLoading }: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } = useDetailDrawer<Delivery>();

  const exportData = deliveries.map((d) => ({
    deliveryNumber: d.deliveryNumber ?? `#${d.id}`,
    statusLabel: DELIVERY_STATUS_MAP[d.status]?.label ?? d.status,
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>배송 현황</CardTitle>
              <CardDescription>최근 배송 목록</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="deliveries"
                pdfTitle="배송 현황"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/delivery')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {(['PENDING', 'IN_TRANSIT', 'DELIVERED'] as const).map(
                  (status) => {
                    const cfg = DELIVERY_STATUS_MAP[status];
                    return (
                      <div
                        key={status}
                        className="rounded-md border p-2 text-center"
                      >
                        <Badge variant={cfg.variant} className="mb-1 text-xs">
                          {cfg.label}
                        </Badge>
                        <p className="text-lg font-bold">
                          {deliveries.filter((d) => d.status === status).length}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="space-y-2">
                {deliveries.slice(0, 5).map((delivery) => {
                  const cfg = DELIVERY_STATUS_MAP[delivery.status] ?? {
                    label: delivery.status,
                    variant: 'outline' as const,
                  };
                  return (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <span className="font-mono text-xs">
                        {delivery.deliveryNumber ?? `#${delivery.id}`}
                      </span>
                      <div className="flex items-center gap-2">
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
                            <DropdownMenuItem
                              onClick={() => openDrawer(delivery)}
                            >
                              상세보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate('/admin/delivery/tracking')
                              }
                            >
                              추적
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/delivery/${delivery.id}`)
                              }
                            >
                              기사 배정
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
                {deliveries.length === 0 && (
                  <p className="text-muted-foreground text-center text-sm">
                    배송 데이터가 없습니다.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeliveryDetailDrawer
        open={open}
        onOpenChange={setOpen}
        delivery={selected}
      />
    </>
  );
}
