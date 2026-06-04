import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderToolbar } from './order-toolbar';
import { orderColumns } from './order-columns';
import type { Order } from '@starcoex-frontend/orders';
import {
  DataTablePagination,
  MobileCard,
  MobileCardAction,
  MobileCardBody,
  MobileCardFooter,
  MobileCardHeader,
  MobileCardTitle,
} from '@starcoex-frontend/common';
import { useNavigate } from 'react-router-dom';
import { OrderRowActions } from '@/app/pages/dashboard/ecommerce/orders/components/order-row-actions';
import {
  FulfillmentBadge,
  OrderStatusBadge,
  PaymentStatusBadge,
} from './order-status-badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── 모바일 카드 ──────────────────────────────────────────────────────────────
function OrderMobileCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const customerInfo = (() => {
    try {
      const raw = order.customerInfo;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Record<
        string,
        string
      >;
    } catch {
      return {} as Record<string, string>;
    }
  })();

  return (
    <MobileCard onClick={() => navigate(`/admin/orders/${order.id}`)}>
      {/* 상단: 주문번호 + 액션 */}
      <MobileCardHeader>
        <MobileCardTitle>
          <p className="font-mono text-xs font-semibold text-primary truncate">
            {order.orderNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.storeName}
          </p>
        </MobileCardTitle>
        <MobileCardAction>
          <OrderRowActions order={order} />
        </MobileCardAction>
      </MobileCardHeader>

      {/* 중단: 고객 정보 + 처리방식 */}
      <MobileCardBody>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {customerInfo?.name ?? '-'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {customerInfo?.phone ?? customerInfo?.email ?? '-'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          <FulfillmentBadge type={order.fulfillmentType} />
        </div>
      </MobileCardBody>

      {/* 하단: 상태 배지 + 금액 + 날짜 */}
      <MobileCardFooter>
        <div className="flex flex-wrap gap-1">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">
            ₩{order.finalAmount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(order.createdAt), 'MM/dd HH:mm', { locale: ko })}
          </p>
        </div>
      </MobileCardFooter>
    </MobileCard>
  );
}

export function OrderTable({
  data,
  onRefresh,
}: {
  data: Order[];
  onRefresh?: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: orderColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageSize: 20 } },
  });

  const filteredRows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <OrderToolbar table={table} onRefresh={onRefresh} />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={orderColumns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '주문 내역이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── 모바일 카드 리스트 (sm 미만) ── */}
      <div className="flex sm:hidden flex-col gap-3">
        {filteredRows.length ? (
          filteredRows.map((row) => (
            <OrderMobileCard key={row.id} order={row.original} />
          ))
        ) : (
          <div className="text-muted-foreground py-12 text-center text-sm">
            {table.getState().columnFilters.length > 0
              ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
              : '주문 내역이 없습니다.'}
          </div>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
