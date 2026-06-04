import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Order {
  id: number;
  orderNumber: string;
  storeName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Props {
  orders: Order[];
  isLoading: boolean;
}

const ORDER_STATUS_CONFIG: Record<
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
  REFUNDED: { label: '환불', variant: 'outline' },
};

const EXPORT_COLUMNS = [
  { header: '주문번호', key: 'orderNumber' },
  { header: '매장', key: 'storeName' },
  { header: '금액', key: 'totalAmountFormatted' },
  { header: '주문상태', key: 'statusLabel' },
  { header: '결제상태', key: 'paymentStatus' },
  { header: '주문일시', key: 'createdAtFormatted' },
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
  const cfg = ORDER_STATUS_CONFIG[order.status] ?? {
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
                <dt className="text-muted-foreground">매장</dt>
                <dd className="font-medium">{order.storeName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">금액</dt>
                <dd className="font-bold">
                  ₩{order.totalAmount.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">주문 상태</dt>
                <dd>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">결제 상태</dt>
                <dd>
                  <Badge variant="outline">{order.paymentStatus}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">주문일시</dt>
                <dd className="font-medium">
                  {format(new Date(order.createdAt), 'yyyy.MM.dd HH:mm', {
                    locale: ko,
                  })}
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
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
          >
            수정
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
export function SalesOrderTable({ orders, isLoading }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { selected, open, setOpen, openDrawer } = useDetailDrawer<Order>();

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.storeName.toLowerCase().includes(search.toLowerCase())
  );

  const exportData = filtered.map((o) => ({
    orderNumber: o.orderNumber,
    storeName: o.storeName,
    totalAmountFormatted: `₩${o.totalAmount.toLocaleString()}`,
    statusLabel: ORDER_STATUS_CONFIG[o.status]?.label ?? o.status,
    paymentStatus: o.paymentStatus,
    createdAtFormatted: format(new Date(o.createdAt), 'yyyy.MM.dd HH:mm', {
      locale: ko,
    }),
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>주문 현황</CardTitle>
              <CardDescription>
                최근 주문 목록 · 총 {filtered.length}건
              </CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="sales-orders"
                pdfTitle="매출 현황 - 주문 목록"
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
          <Input
            placeholder="주문번호 · 매장명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              주문 데이터가 없습니다.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>매장</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-right">날짜</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 10).map((order) => {
                    const statusCfg = ORDER_STATUS_CONFIG[order.status] ?? {
                      label: order.status,
                      variant: 'outline' as const,
                    };
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate text-sm">
                          {order.storeName}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          ₩{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={statusCfg.variant}>
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right text-xs">
                          {format(new Date(order.createdAt), 'MM.dd HH:mm', {
                            locale: ko,
                          })}
                        </TableCell>
                        {/* ⋮ 메뉴 */}
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
                                onClick={() => openDrawer(order)}
                              >
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailDrawer open={open} onOpenChange={setOpen} order={selected} />
    </>
  );
}
