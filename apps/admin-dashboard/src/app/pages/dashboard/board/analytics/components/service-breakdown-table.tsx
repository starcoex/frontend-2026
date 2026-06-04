import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { ServiceBreakdownOutput } from '@starcoex-frontend/analytics';
import {
  SERVICE_STATUS_CONFIG,
  SERVICE_TREND_CONFIG,
  ServiceStatus,
  ServiceTrend,
} from '@/app/pages/dashboard/board/analytics/data/analytics-data';
import {
  ExportButton,
  MobileCard,
  MobileCardFooter,
  MobileCardHeader,
  MobileCardTitle,
  useDetailDrawer,
} from '@starcoex-frontend/common';

interface Props {
  data: ServiceBreakdownOutput[];
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '서비스', key: 'serviceName' },
  { header: '주문 수', key: 'totalOrdersFormatted' },
  { header: '총 결제액', key: 'totalAmountFormatted' },
  { header: '총 절약액', key: 'totalSavingsFormatted' },
  { header: '평균 주문액', key: 'averageOrderAmountFormatted' },
  { header: '비율', key: 'percentageFormatted' },
  { header: '트렌드', key: 'trend' },
  { header: '상태', key: 'status' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function ServiceDetailDrawer({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: ServiceBreakdownOutput | null;
}) {
  if (!service) return null;
  const trendCfg =
    SERVICE_TREND_CONFIG[service.trend as ServiceTrend] ??
    SERVICE_TREND_CONFIG.stable;
  const statusCfg =
    SERVICE_STATUS_CONFIG[service.status as ServiceStatus] ??
    SERVICE_STATUS_CONFIG.inactive;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>{service.serviceName}</SheetTitle>
          <SheetDescription>서비스 분석 상세</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">실적 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">총 주문 수</dt>
                <dd className="font-bold">
                  {service.totalOrders.toLocaleString()}건
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">총 결제액</dt>
                <dd className="font-bold">
                  ₩{service.totalAmount.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">총 절약액</dt>
                <dd className="font-bold text-emerald-500">
                  ₩{service.totalSavings.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">평균 주문액</dt>
                <dd className="font-medium">
                  ₩{service.averageOrderAmount.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">비율</dt>
                <dd className="font-medium">{service.percentage}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">트렌드</dt>
                <dd className={trendCfg.className}>{trendCfg.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="px-4 sm:px-6">
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

// ─── 모바일 카드 아이템 ───────────────────────────────────────────────────────
function ServiceMobileItem({
  row,
  onDetail,
}: {
  row: ServiceBreakdownOutput;
  onDetail: (row: ServiceBreakdownOutput) => void;
}) {
  const statusCfg =
    SERVICE_STATUS_CONFIG[row.status as ServiceStatus] ??
    SERVICE_STATUS_CONFIG.inactive;

  return (
    <MobileCard onClick={() => onDetail(row)}>
      <MobileCardHeader>
        <MobileCardTitle>
          <p className="text-sm font-semibold">{row.serviceName}</p>
          <p className="text-xs text-muted-foreground">
            주문 {row.totalOrders.toLocaleString()}건 · {row.percentage}%
          </p>
        </MobileCardTitle>
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge variant={statusCfg.variant} className="text-xs">
            {statusCfg.label}
          </Badge>
        </div>
      </MobileCardHeader>
      <MobileCardFooter>
        <div>
          <p className="text-xs text-muted-foreground">총 결제액</p>
          <p className="text-sm font-semibold">
            ₩{row.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">총 절약액</p>
          <p className="text-sm font-semibold text-emerald-500">
            ₩{row.totalSavings.toLocaleString()}
          </p>
        </div>
      </MobileCardFooter>
    </MobileCard>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function ServiceBreakdownTable({ data, isLoading }: Props) {
  const { selected, open, setOpen, openDrawer } =
    useDetailDrawer<ServiceBreakdownOutput>();

  const exportData = data.map((row) => ({
    serviceName: row.serviceName,
    totalOrdersFormatted: `${row.totalOrders.toLocaleString()}건`,
    totalAmountFormatted: `₩${row.totalAmount.toLocaleString()}`,
    totalSavingsFormatted: `₩${row.totalSavings.toLocaleString()}`,
    averageOrderAmountFormatted: `₩${row.averageOrderAmount.toLocaleString()}`,
    percentageFormatted: `${row.percentage}%`,
    trend: row.trend,
    status: row.status,
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>서비스별 상세 현황</CardTitle>
              <CardDescription>
                서비스별 주문·결제·절약 상세 데이터
              </CardDescription>
            </div>
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="service-breakdown"
              pdfTitle="서비스별 분석"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              데이터가 없습니다.
            </div>
          ) : (
            <>
              {/* ── 모바일 카드 (sm 미만) ── */}
              <div className="flex sm:hidden flex-col gap-3">
                {data.map((row) => (
                  <ServiceMobileItem
                    key={row.service}
                    row={row}
                    onDetail={openDrawer}
                  />
                ))}
              </div>

              {/* ── 데스크탑 테이블 (sm 이상) ── */}
              <div className="hidden sm:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>서비스</TableHead>
                      <TableHead className="text-right">주문 수</TableHead>
                      <TableHead className="text-right">총 결제액</TableHead>
                      <TableHead className="text-right">총 절약액</TableHead>
                      <TableHead className="text-right">평균 주문액</TableHead>
                      <TableHead className="text-center">비율</TableHead>
                      <TableHead className="text-center">트렌드</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row) => {
                      const trendCfg =
                        SERVICE_TREND_CONFIG[row.trend as ServiceTrend] ??
                        SERVICE_TREND_CONFIG.stable;
                      const statusCfg =
                        SERVICE_STATUS_CONFIG[row.status as ServiceStatus] ??
                        SERVICE_STATUS_CONFIG.inactive;
                      return (
                        <TableRow key={row.service}>
                          <TableCell className="font-medium">
                            {row.serviceName}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.totalOrders.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.totalAmount.toLocaleString()}원
                          </TableCell>
                          <TableCell className="text-right text-emerald-500">
                            {row.totalSavings.toLocaleString()}원
                          </TableCell>
                          <TableCell className="text-right">
                            {row.averageOrderAmount.toLocaleString()}원
                          </TableCell>
                          <TableCell className="text-center">
                            {row.percentage}%
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={trendCfg.className}>
                              {trendCfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusCfg.variant}>
                              {statusCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
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
                                  onClick={() => openDrawer(row)}
                                >
                                  상세보기
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ServiceDetailDrawer
        open={open}
        onOpenChange={setOpen}
        service={selected}
      />
    </>
  );
}
