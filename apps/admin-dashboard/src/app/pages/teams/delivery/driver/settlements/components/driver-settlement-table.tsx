import { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@starcoex-frontend/common';
import type { DriverSettlement } from '@starcoex-frontend/delivery';
import { driverSettlementColumns } from './driver-settlement-columns';
import { DriverSettlementTableToolbar } from './driver-settlement-table-toolbar';

interface Props {
  data: DriverSettlement[];
  initialStatusFilter?: string; // ✅ 쿼리스트링으로 받은 초기 필터
}

export function DriverSettlementTable({ data, initialStatusFilter }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    // ✅ 초기 필터 주입 — ?status=paid → [{ id: 'status', value: ['PAID'] }]
    initialStatusFilter
      ? [{ id: 'status', value: [initialStatusFilter.toUpperCase()] }]
      : []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // ✅ 쿼리스트링 변경 감지 — 사이드바 클릭 시 필터 동기화
  useEffect(() => {
    setColumnFilters(
      initialStatusFilter
        ? [{ id: 'status', value: [initialStatusFilter.toUpperCase()] }]
        : []
    );
  }, [initialStatusFilter]);

  const table = useReactTable({
    data,
    columns: driverSettlementColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-4">
      <DriverSettlementTableToolbar table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {table.getRowModel().rows.length ? (
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
                  colSpan={driverSettlementColumns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '정산 내역이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
