import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { StoreInventory } from '@starcoex-frontend/inventory';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { InventoryRowActions } from './inventory-row-actions';

const getStockStatus = (inv: StoreInventory) => {
  if (inv.isOutOfStock) return 'out-of-stock';
  if (inv.isLowStock) return 'low-stock';
  if (inv.isOverStock) return 'over-stock';
  return 'normal';
};

type StockStatus = ReturnType<typeof getStockStatus>;

const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  {
    label: string;
    variant: 'destructive' | 'warning' | 'secondary' | 'success';
  }
> = {
  'out-of-stock': { label: '재고 없음', variant: 'destructive' },
  'low-stock': { label: '재고 부족', variant: 'warning' },
  'over-stock': { label: '과잉 재고', variant: 'secondary' },
  normal: { label: '정상', variant: 'success' },
};

export const inventoryColumns: ColumnDef<StoreInventory>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'productId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상품 ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">#{row.original.productId}</span>
    ),
  },
  {
    accessorKey: 'storeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="매장" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">매장 #{row.original.storeId}</span>
    ),
  },
  {
    accessorKey: 'currentStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="현재 재고" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.currentStock.toLocaleString()}
        <span className="text-muted-foreground ml-1 text-xs">
          {row.original.unit}
        </span>
      </span>
    ),
  },
  {
    accessorKey: 'reservedStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="예약 재고" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.reservedStock.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'availableStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="가용 재고" />
    ),
    cell: ({ row }) => {
      const status = getStockStatus(row.original);
      return (
        <span
          className={
            status === 'out-of-stock'
              ? 'text-destructive font-semibold'
              : status === 'low-stock'
              ? 'text-warning font-semibold'
              : 'font-medium'
          }
        >
          {row.original.availableStock.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'reorderPoint',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="재주문 시점" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.reorderPoint.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'zone',
    header: '구역',
    cell: ({ row }) =>
      row.original.zone ? (
        <Badge variant="outline">{row.original.zone}</Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    accessorKey: 'location',
    header: '위치',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.location ?? '-'}
      </span>
    ),
  },
  {
    id: 'stockStatus',
    accessorFn: (row) => getStockStatus(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = getStockStatus(row.original);
      const config = STOCK_STATUS_CONFIG[status];
      const inv = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant={config.variant}>{config.label}</Badge>
          {inv.hasExpiringItems && (
            <Badge variant="destructive" className="text-xs">
              유통기한 임박
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(getStockStatus(row.original));
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <InventoryRowActions inventory={row.original} />,
  },
];
