import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import type { StoreInventory } from '@starcoex-frontend/inventory';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/products/components/data-table-column-header';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';

// 위험도 우선순위: 재고없음 > 재고부족 > 재주문필요
const getUrgencyLevel = (inv: StoreInventory) => {
  if (inv.isOutOfStock) return 'out-of-stock';
  if (inv.isLowStock) return 'low-stock';
  return 'needs-reorder';
};

type UrgencyLevel = ReturnType<typeof getUrgencyLevel>;

const URGENCY_CONFIG: Record<
  UrgencyLevel,
  {
    label: string;
    variant: 'destructive' | 'warning' | 'outline';
    priority: number;
  }
> = {
  'out-of-stock': { label: '재고 없음', variant: 'destructive', priority: 1 },
  'low-stock': { label: '재고 부족', variant: 'warning', priority: 2 },
  'needs-reorder': { label: '재주문 필요', variant: 'outline', priority: 3 },
};

export const lowStockColumns: ColumnDef<StoreInventory>[] = [
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
    id: 'urgency',
    accessorFn: (row) => URGENCY_CONFIG[getUrgencyLevel(row)].priority,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="긴급도" />
    ),
    cell: ({ row }) => {
      const level = getUrgencyLevel(row.original);
      const config = URGENCY_CONFIG[level];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    sortingFn: (rowA, rowB) => {
      const a = URGENCY_CONFIG[getUrgencyLevel(rowA.original)].priority;
      const b = URGENCY_CONFIG[getUrgencyLevel(rowB.original)].priority;
      return a - b;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(getUrgencyLevel(row.original));
    },
  },
  {
    accessorKey: 'productId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상품 ID" />
    ),
    cell: ({ row }) => (
      <Link
        to={INVENTORY_ROUTES.DETAIL.replace(':id', String(row.original.id))}
        className="text-primary font-mono text-sm hover:underline"
      >
        #{row.original.productId}
      </Link>
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
    cell: ({ row }) => {
      const { currentStock, isOutOfStock, isLowStock } = row.original;
      return (
        <span
          className={
            isOutOfStock
              ? 'text-destructive font-bold'
              : isLowStock
              ? 'text-warning font-semibold'
              : 'font-medium'
          }
        >
          {currentStock.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'minStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="최소 기준" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.minStock.toLocaleString()}
      </span>
    ),
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
    id: 'shortage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="부족 수량" />
    ),
    cell: ({ row }) => {
      const shortage = row.original.reorderPoint - row.original.currentStock;
      return shortage > 0 ? (
        <span className="text-destructive font-medium">
          -{shortage.toLocaleString()}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
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
    accessorKey: 'lastCountedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 실사" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.lastCountedAt
          ? new Date(row.original.lastCountedAt).toLocaleDateString('ko-KR')
          : '미실사'}
      </span>
    ),
  },
];
