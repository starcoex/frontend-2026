import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Payment } from '@starcoex-frontend/payments';
import { PAYMENT_STATUS_CONFIG, formatAmount } from '../data/payment-data';
import { PaymentRowActions } from './payment-row-actions';

export const paymentColumns: ColumnDef<Payment>[] = [
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
    accessorKey: 'portOneId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결제 ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.portOneId}</span>
    ),
  },
  {
    accessorKey: 'orderName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="주문명" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-sm font-medium">
        {row.original.orderName}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결제 금액" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">
        {formatAmount(row.original.amount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = PAYMENT_STATUS_CONFIG[row.original.status];
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
    id: 'reservation',
    header: '예약',
    cell: ({ row }) =>
      row.original.reservationId ? (
        <span className="text-muted-foreground font-mono text-xs">
          #{row.original.reservationId}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결제 완료일" />
    ),
    cell: ({ row }) =>
      row.original.paidAt ? (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.original.paidAt), 'yyyy.MM.dd HH:mm', {
            locale: ko,
          })}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
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
    cell: ({ row }) => <PaymentRowActions payment={row.original} />,
  },
];
