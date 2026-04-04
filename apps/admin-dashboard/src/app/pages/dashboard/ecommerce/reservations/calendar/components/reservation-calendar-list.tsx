import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Reservation } from '@starcoex-frontend/reservations';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import type { ReservationStatusValue } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';

interface ReservationCalendarListProps {
  reservations: Reservation[];
  onDelete: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
}

const formatTime = (dateTimeStr: string): string => {
  try {
    return new Date(dateTimeStr).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dateTimeStr;
  }
};

export function ReservationCalendarList({
  reservations,
  onDelete,
  onEdit,
}: ReservationCalendarListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Reservation>[] = useMemo(
    () => [
      {
        accessorKey: 'reservationNumber',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent text-muted-foreground font-normal"
          >
            예약 번호
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            {row.original.reservationNumber}
          </span>
        ),
      },
      {
        id: 'customer',
        header: '고객',
        cell: ({ row }) => {
          const info = row.original.customerInfo as Record<
            string,
            string
          > | null;
          const name = info?.name ?? info?.customerName ?? '-';
          const phone = info?.phone ?? info?.customerPhone ?? '';
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{name}</span>
              {phone && (
                <span className="text-muted-foreground text-xs">{phone}</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'time',
        header: '시간',
        cell: ({ row }) => (
          <span className="text-sm">
            {formatTime(row.original.reservedStartTime)} ~{' '}
            {formatTime(row.original.reservedEndTime)}
          </span>
        ),
      },
      {
        accessorKey: 'reservedDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent text-muted-foreground font-normal"
          >
            예약일
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => {
          try {
            return (
              <span className="text-sm">
                {format(
                  new Date(row.original.reservedDate),
                  'yyyy.MM.dd (EEE)',
                  {
                    locale: ko,
                  }
                )}
              </span>
            );
          } catch {
            return <span className="text-sm">{row.original.reservedDate}</span>;
          }
        },
      },
      {
        id: 'payment',
        header: '결제',
        cell: ({ row }) => (
          <Badge
            variant={row.original.paymentConfirmed ? 'default' : 'outline'}
          >
            {row.original.paymentConfirmed ? '결제완료' : '미결제'}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: '상태',
        cell: ({ row }) => {
          const config =
            RESERVATION_STATUS_CONFIG[
              row.original.status as ReservationStatusValue
            ];
          return config ? (
            <Badge variant={config.variant}>{config.label}</Badge>
          ) : (
            <Badge variant="outline">{row.original.status}</Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-destructive focus:text-destructive"
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onDelete, onEdit]
  );

  const table = useReactTable({
    data: reservations,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
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
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  해당 기간에 예약이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}{' '}
          페이지 · 총 {reservations.length}건
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
