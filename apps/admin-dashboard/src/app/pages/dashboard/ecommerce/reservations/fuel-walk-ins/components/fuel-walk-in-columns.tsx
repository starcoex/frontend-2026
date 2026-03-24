import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { FuelWalkIn } from '@starcoex-frontend/reservations';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { FuelWalkInRowActions } from './fuel-walk-in-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  FUEL_PAYMENT_STATUS_CONFIG,
  FUEL_PAYMENT_TYPE_LABELS,
  FUEL_TYPE_LABELS,
  FUEL_WALK_IN_STATUS_CONFIG,
} from '@/app/pages/dashboard/ecommerce/reservations/data/fuel-walk-in-data';

export const fuelWalkInColumns: ColumnDef<FuelWalkIn>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="번호" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        #{row.original.id}
      </span>
    ),
  },
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const name = row.original.customerName ?? '-';
      const phone = row.original.customerPhone ?? '';
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
    accessorKey: 'fuelType',
    header: '유종',
    cell: ({ row }) => (
      <Badge variant="outline">
        {FUEL_TYPE_LABELS[row.original.fuelType] ?? row.original.fuelType}
      </Badge>
    ),
  },
  {
    id: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="금액" />
    ),
    cell: ({ row }) => {
      const f = row.original;
      return (
        <div className="flex flex-col">
          {f.paidAmount != null && (
            <span className="text-sm font-medium">
              ₩{f.paidAmount.toLocaleString()}
            </span>
          )}
          {f.literAmount != null && (
            <span className="text-muted-foreground text-xs">
              {f.literAmount}L
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentType',
    header: '결제 방식',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {FUEL_PAYMENT_TYPE_LABELS[row.original.paymentType] ??
          row.original.paymentType}
      </span>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: '결제 상태',
    cell: ({ row }) => {
      const config = FUEL_PAYMENT_STATUS_CONFIG[row.original.paymentStatus];
      return config ? (
        <Badge variant={config.variant}>{config.label}</Badge>
      ) : (
        <Badge variant="outline">{row.original.paymentStatus}</Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = FUEL_WALK_IN_STATUS_CONFIG[row.original.status];
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
    accessorKey: 'arrivedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="도착 시간" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.original.arrivedAt), 'HH:mm', { locale: ko })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <FuelWalkInRowActions fuelWalkIn={row.original} />,
  },
];
