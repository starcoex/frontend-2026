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
import { FileWithUrl } from '@starcoex-frontend/graphql';
import { FileToolbar } from './file-toolbar';
import { fileColumns } from './file-columns';
import { DataTablePagination } from '@starcoex-frontend/common';

interface ServerPaginationProps {
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface FileTableProps {
  data: FileWithUrl[];
  hideToolbar?: boolean;
  serverPagination?: ServerPaginationProps; // ✅ 서버 페이지네이션
}

export function FileTable({
  data,
  hideToolbar = false,
  serverPagination,
}: FileTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const isServerPagination = !!serverPagination;

  const table = useReactTable({
    data,
    columns: fileColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // ✅ 서버 페이지네이션이면 클라이언트 페이지네이션 비활성
    ...(isServerPagination
      ? {
          manualPagination: true,
          pageCount: Math.ceil(
            serverPagination.totalCount / serverPagination.pageSize
          ),
        }
      : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(isServerPagination && {
        pagination: {
          pageIndex: serverPagination.pageIndex,
          pageSize: serverPagination.pageSize,
        },
      }),
    },
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-4">
      {!hideToolbar && <FileToolbar table={table} />}

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
                <TableRow key={row.id}>
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
                  colSpan={fileColumns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '파일이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ 서버 페이지네이션이면 직접 버튼 렌더링, 아니면 기존 DataTablePagination */}
      {isServerPagination ? (
        <div className="flex items-center justify-between px-2">
          <p className="text-muted-foreground text-sm">
            전체 {serverPagination.totalCount.toLocaleString()}개
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() =>
                serverPagination.onPageChange(serverPagination.pageIndex - 1)
              }
              disabled={serverPagination.pageIndex === 0}
            >
              이전
            </button>
            <span className="text-sm">
              {serverPagination.pageIndex + 1} /{' '}
              {Math.ceil(
                serverPagination.totalCount / serverPagination.pageSize
              ) || 1}
            </span>
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() =>
                serverPagination.onPageChange(serverPagination.pageIndex + 1)
              }
              disabled={
                (serverPagination.pageIndex + 1) * serverPagination.pageSize >=
                serverPagination.totalCount
              }
            >
              다음
            </button>
          </div>
        </div>
      ) : (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
