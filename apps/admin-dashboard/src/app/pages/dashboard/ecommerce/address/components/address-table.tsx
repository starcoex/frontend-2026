import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import { DataTablePagination } from '@starcoex-frontend/common';
import { Loader2 } from 'lucide-react';
import type { Address } from '@starcoex-frontend/address';
import { getAddressColumns } from './address-columns';
import { AddressTableToolbar } from './address-table-toolbar';

interface AddressTableProps {
  data: Address[];
  total: number;
  isLoading?: boolean;
  // 서버사이드 검색
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  // 삭제
  onBulkDelete: (
    ids: number[]
  ) => Promise<{ success: boolean; error?: { message?: string } }>;
  onDeleteSuccess?: () => void;
  onSingleDelete?: (id: number) => void;
}

export function AddressTable({
  data,
  total,
  isLoading,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onBulkDelete,
  onDeleteSuccess,
  onSingleDelete,
}: AddressTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(
    () => getAddressColumns({ onDelete: onSingleDelete }),
    [onSingleDelete]
  );

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

  return (
    <div className="space-y-4">
      <AddressTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        isLoading={isLoading}
        onBulkDelete={onBulkDelete}
        onDeleteSuccess={onDeleteSuccess}
      />

      <div className="relative rounded-lg border">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-black/40">
            <Loader2 className="text-primary size-6 animate-spin" />
          </div>
        )}

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
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {isLoading
                    ? '불러오는 중...'
                    : table.getState().columnFilters.length > 0 || searchValue
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '저장된 주소가 없습니다.'}
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
