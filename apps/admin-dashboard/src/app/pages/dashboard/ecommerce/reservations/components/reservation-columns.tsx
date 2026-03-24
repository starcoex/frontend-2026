import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Reservation } from '@starcoex-frontend/reservations';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { ReservationRowActions } from './reservation-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';

export const reservationColumns: ColumnDef<Reservation>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'reservationNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="예약 번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.reservationNumber}
      </span>
    ),
  },
  {
    accessorKey: 'reservedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="예약일" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {format(new Date(row.original.reservedDate), 'yyyy.MM.dd', {
            locale: ko,
          })}
        </span>
        <span className="text-muted-foreground text-xs">
          {row.original.reservedStartTime} ~ {row.original.reservedEndTime}
        </span>
      </div>
    ),
  },
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const info = row.original.customerInfo as Record<string, string> | null;
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
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총액" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          ₩{row.original.totalAmount.toLocaleString()}
        </span>
        {row.original.paidAmount > 0 && (
          <span className="text-muted-foreground text-xs">
            결제 ₩{row.original.paidAmount.toLocaleString()}
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'type',
    header: '유형',
    cell: ({ row }) => (
      <Badge variant={row.original.isWalkIn ? 'secondary' : 'outline'}>
        {row.original.isWalkIn ? '워크인' : '예약'}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = RESERVATION_STATUS_CONFIG[row.original.status];
      return config ? (
        <Badge variant={config.variant}>{config.label}</Badge>
      ) : (
        <Badge variant="outline">{row.original.status}</Badge>
      );
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.original.createdAt), 'yyyy.MM.dd', { locale: ko })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ReservationRowActions reservation={row.original} />,
  },
];
