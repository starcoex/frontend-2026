import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { DeliveryFeePolicy } from '@starcoex-frontend/delivery';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { DeliveryPricingRowActions } from './delivery-pricing-row-actions';

interface DeliveryPricingColumnsOptions {
  onEdit: (policy: DeliveryFeePolicy) => void;
  onDeleted: (id: number) => void;
}

export const deliveryPricingColumns = ({
  onEdit,
  onDeleted,
}: DeliveryPricingColumnsOptions): ColumnDef<DeliveryFeePolicy>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="정책명" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.name}</p>
        {row.original.description && (
          <p className="text-muted-foreground text-xs">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'baseFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="기본 배달비" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">₩{row.original.baseFee.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: 'driverRatio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="기사 비율" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.driverRatio}%</span>
    ),
  },
  {
    accessorKey: 'platformFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="플랫폼 수수료" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        ₩{row.original.platformFee.toLocaleString()}
      </span>
    ),
  },
  {
    id: 'perKm',
    header: 'km당 요금',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.perKmFee != null
          ? `₩${row.original.perKmFee.toLocaleString()}`
          : '-'}
      </span>
    ),
  },
  {
    id: 'priority',
    header: '우선순위 할증',
    cell: ({ row }) => (
      <div className="space-y-0.5 text-xs">
        {row.original.highPriorityRate != null && (
          <p>HIGH: {row.original.highPriorityRate}%</p>
        )}
        {row.original.urgentPriorityRate != null && (
          <p>URGENT: {row.original.urgentPriorityRate}%</p>
        )}
        {row.original.highPriorityRate == null &&
          row.original.urgentPriorityRate == null && (
            <span className="text-muted-foreground">-</span>
          )}
      </div>
    ),
  },
  // ✅ 기존 status 컬럼(활성+기본 합본) 제거 → isActive / isDefault 분리
  {
    accessorKey: 'isActive',
    id: 'isActive',
    header: '활성',
    cell: ({ row }) => (
      <Badge
        variant={row.original.isActive ? 'secondary' : 'outline'}
        className="text-xs"
      >
        {row.original.isActive ? '활성' : '비활성'}
      </Badge>
    ),
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(String(row.original.isActive));
    },
  },
  {
    accessorKey: 'isDefault',
    id: 'isDefault',
    header: '기본',
    cell: ({ row }) =>
      row.original.isDefault ? (
        <Badge variant="default" className="text-xs">
          기본
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(String(row.original.isDefault));
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <DeliveryPricingRowActions
        policy={row.original}
        onEdit={onEdit}
        onDeleted={onDeleted}
      />
    ),
  },
];
