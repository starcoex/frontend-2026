import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { HeatingOilDelivery } from '@starcoex-frontend/reservations';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { HeatingOilDeliveryRowActions } from './heating-oil-delivery-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  HEATING_OIL_DELIVERY_STATUS_CONFIG,
  HEATING_OIL_FUEL_TYPE_LABELS,
  HEATING_OIL_ORDER_TYPE_LABELS,
} from '@/app/pages/dashboard/ecommerce/reservations/data/heating-oil-delivery-walk-in-data';

export const heatingOilDeliveryColumns: ColumnDef<HeatingOilDelivery>[] = [
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
    accessorKey: 'deliveryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="배달 번호" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono text-xs">{row.original.deliveryNumber}</span>
        {row.original.isUrgent && (
          <Badge variant="destructive" className="mt-1 w-fit text-xs">
            긴급
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{d.customerName}</span>
          <span className="text-muted-foreground text-xs">
            {d.customerPhone}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'deliveryAddress',
    header: '배달 주소',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="max-w-[180px] truncate text-sm">
          {row.original.deliveryAddress}
        </span>
        {row.original.deliveryAddressDetail && (
          <span className="text-muted-foreground max-w-[180px] truncate text-xs">
            {row.original.deliveryAddressDetail}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'fuelType',
    header: '유종',
    cell: ({ row }) => (
      <Badge variant="outline">
        {HEATING_OIL_FUEL_TYPE_LABELS[row.original.fuelType] ??
          row.original.fuelType}
      </Badge>
    ),
  },
  {
    id: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수량" />
    ),
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{d.requestedLiters}L 요청</span>
          {d.actualLiters != null && (
            <span className="text-muted-foreground text-xs">
              {d.actualLiters}L 실제
            </span>
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
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            ₩{d.totalAmount.toLocaleString()}
          </span>
          {d.paidAmount > 0 && (
            <span className="text-muted-foreground text-xs">
              결제 ₩{d.paidAmount.toLocaleString()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduledDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="예약일" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">
          {format(new Date(row.original.scheduledDate), 'yyyy.MM.dd', {
            locale: ko,
          })}
        </span>
        <span className="text-muted-foreground text-xs">
          {row.original.scheduledTimeSlot}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'orderType',
    header: '유형',
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.orderType === 'URGENT' ? 'destructive' : 'outline'
        }
      >
        {HEATING_OIL_ORDER_TYPE_LABELS[row.original.orderType] ??
          row.original.orderType}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = HEATING_OIL_DELIVERY_STATUS_CONFIG[row.original.status];
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
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <HeatingOilDeliveryRowActions delivery={row.original} />,
  },
];
