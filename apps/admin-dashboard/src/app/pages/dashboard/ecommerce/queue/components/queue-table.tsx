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
import {
  DataTablePagination,
  MobileCardAction,
} from '@starcoex-frontend/common';
import { QueueToolbar } from './queue-toolbar';
import { getQueueColumns } from './queue-columns';
import type { QueueSession } from '@starcoex-frontend/queue';
import { useNavigate } from 'react-router-dom';
import { QueueStatusBadge } from './queue-status-badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  MobileCard,
  MobileCardBody,
  MobileCardFooter,
  MobileCardHeader,
  MobileCardTitle,
} from '@starcoex-frontend/common';
import type { QueueStatusValue } from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';
import { QueueRowActions } from '@/app/pages/dashboard/ecommerce/queue/components/queue-row-actions';

function QueueMobileCard({
  session,
  onRefresh,
}: {
  session: QueueSession;
  onRefresh?: () => void; // ✅ prop으로 받아서 전달
}) {
  const navigate = useNavigate();

  return (
    <MobileCard onClick={() => navigate(`/admin/queue/${session.id}`)}>
      <MobileCardHeader>
        <MobileCardTitle>
          <p className="font-mono text-xs font-semibold text-primary truncate">
            {session.ticketNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            순번 {session.position} · 지점 #{session.storeId}
          </p>
        </MobileCardTitle>
        {/* ✅ 빈 함수 제거 — onRefresh prop 전달 */}
        <MobileCardAction>
          <QueueRowActions session={session} onRefresh={onRefresh} />
        </MobileCardAction>
      </MobileCardHeader>

      <MobileCardBody>
        <QueueStatusBadge status={session.status as QueueStatusValue} />
        {!session.userId && session.guestName && (
          <div className="text-xs text-muted-foreground">
            <p>{session.guestName}</p>
            <p>{session.guestPhone ?? '-'}</p>
          </div>
        )}
      </MobileCardBody>

      <MobileCardFooter>
        <p className="text-xs text-muted-foreground">
          예상 입장:{' '}
          {format(new Date(session.estimatedEntryAt), 'MM/dd HH:mm', {
            locale: ko,
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          접수:{' '}
          {format(new Date(session.createdAt), 'MM/dd HH:mm', { locale: ko })}
        </p>
      </MobileCardFooter>
    </MobileCard>
  );
}

export function QueueTable({
  data,
  onRefresh,
}: {
  data: QueueSession[];
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

  // ✅ onRefresh를 columns에 주입
  const columns = React.useMemo(() => getQueueColumns(onRefresh), [onRefresh]);

  const table = useReactTable({
    data,
    columns,
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
      <QueueToolbar table={table} onRefresh={onRefresh} />

      {/* 데스크탑 테이블 */}
      <div className="hidden sm:block rounded-lg border">
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
            {filteredRows.length ? (
              filteredRows.map((row) => (
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
                  colSpan={columns.length} // ✅ queueColumns → columns
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '대기열 세션이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 모바일 카드 */}
      <div className="flex sm:hidden flex-col gap-3">
        {filteredRows.length ? (
          filteredRows.map((row) => (
            <QueueMobileCard
              key={row.id}
              session={row.original}
              onRefresh={onRefresh} // ✅ onRefresh 전달
            />
          ))
        ) : (
          <div className="text-muted-foreground py-12 text-center text-sm">
            {table.getState().columnFilters.length > 0
              ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
              : '대기열 세션이 없습니다.'}
          </div>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
