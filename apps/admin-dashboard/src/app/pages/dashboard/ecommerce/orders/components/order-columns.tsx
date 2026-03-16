import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import type { Order } from '@starcoex-frontend/orders';
import { OrderRowActions } from './order-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  FulfillmentBadge,
  OrderStatusBadge,
  PaymentStatusBadge,
} from '@/app/pages/dashboard/ecommerce/orders/components/order-status-bage';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/orders/components/data-table-column-header';

export const orderColumns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="주문번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.original.orderNumber}
      </span>
    ),
  },
  {
    accessorKey: 'storeName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="매장" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.storeName}</span>
    ),
  },
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const info = row.original.customerInfo as Record<string, string>;
      return (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{info?.name ?? '-'}</p>
          <p className="text-muted-foreground truncate text-xs">
            {info?.phone ?? info?.email ?? '-'}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="주문 상태" />
    ),
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'paymentStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결제 상태" />
    ),
    cell: ({ row }) => (
      <PaymentStatusBadge status={row.original.paymentStatus} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'fulfillmentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="처리 방식" />
    ),
    cell: ({ row }) => <FulfillmentBadge type={row.original.fulfillmentType} />,
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'finalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="최종 금액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        ₩{row.original.finalAmount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="주문일시" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
];
