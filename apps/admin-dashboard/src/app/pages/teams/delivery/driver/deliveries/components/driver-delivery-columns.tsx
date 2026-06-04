import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  DELIVERY_STATUS_CONFIG,
  DELIVERY_PRIORITY_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/teams/delivery/driver/data/driver-data';
import { DriverDeliveryRowActions } from './driver-delivery-row-actions';
import { MapPin, Package, Clock } from 'lucide-react';

interface DriverDeliveryColumnsOptions {
  onUpdated?: (delivery: Delivery) => void;
}

export const getDriverDeliveryColumns = ({
  onUpdated,
}: DriverDeliveryColumnsOptions): ColumnDef<Delivery>[] => [
  {
    id: 'deliveryNumber',
    accessorKey: 'deliveryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="배송번호" />
    ),
    cell: ({ row }) => (
      <p className="font-mono text-xs font-semibold">
        {row.original.deliveryNumber}
      </p>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const cfg = DELIVERY_STATUS_CONFIG[row.original.status];
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    id: 'priority',
    accessorFn: (row) => row.priority,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="우선순위" />
    ),
    cell: ({ row }) => {
      const cfg = DELIVERY_PRIORITY_CONFIG[row.original.priority];
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.priority);
    },
  },
  {
    id: 'pickupAddress',
    header: '픽업',
    cell: ({ row }) => {
      const addr =
        (row.original.pickupAddress?.roadAddress as string) ??
        (row.original.pickupAddress?.roadAddr as string) ??
        '주소 없음';
      return (
        <div className="flex items-start gap-1.5 text-sm">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="max-w-[160px] truncate">{addr}</span>
        </div>
      );
    },
  },
  {
    id: 'deliveryAddress',
    header: '배송지',
    cell: ({ row }) => {
      const addr =
        (row.original.deliveryAddress?.roadAddress as string) ??
        (row.original.deliveryAddress?.roadAddr as string) ??
        '주소 없음';
      return (
        <div className="flex items-start gap-1.5 text-sm">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          <span className="max-w-[160px] truncate">{addr}</span>
        </div>
      );
    },
  },
  {
    id: 'itemCount',
    accessorKey: 'itemCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수량" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm tabular-nums">
        <Package className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.itemCount}개
      </div>
    ),
  },
  {
    id: 'driverFee',
    accessorKey: 'driverFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수령액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold tabular-nums text-primary">
        {formatDeliveryFee(row.original.driverFee)}
      </span>
    ),
  },
  {
    id: 'requestedAt',
    accessorKey: 'requestedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="요청일시" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
        <Clock className="h-3.5 w-3.5" />
        {new Date(row.original.requestedAt).toLocaleString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <DriverDeliveryRowActions delivery={row.original} onUpdated={onUpdated} />
    ),
  },
];
