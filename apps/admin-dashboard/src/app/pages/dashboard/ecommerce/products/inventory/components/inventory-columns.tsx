import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { ProductInventory, Product } from '@starcoex-frontend/products';
import { InventoryRowActions } from './inventory-row-actions';

// 테이블 행 타입: Inventory + 연결된 Product 정보
export type InventoryRow = ProductInventory & {
  product?: Pick<Product, 'id' | 'name' | 'sku' | 'imageUrls'>;
};

export const inventoryColumns: ColumnDef<InventoryRow>[] = [
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
    id: 'product',
    header: '제품',
    cell: ({ row }) => {
      const product = row.original.product;
      return (
        <div className="flex items-center gap-3">
          {product?.imageUrls?.[0] ? (
            <figure className="size-10 shrink-0 overflow-hidden rounded-md border">
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="size-full object-cover"
              />
            </figure>
          ) : (
            <div className="bg-muted size-10 shrink-0 rounded-md border" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {product?.name ?? `제품 #${row.original.productId}`}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              SKU: {product?.sku ?? '-'}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'storeId',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        매장
        <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">매장 #{row.original.storeId}</span>
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        현재 재고
        <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const { stock, minStock } = row.original;
      const isLow = stock <= minStock;
      return (
        <div className="flex items-center gap-2">
          <span className={isLow ? 'text-destructive font-semibold' : ''}>
            {stock}
          </span>
          {isLow && (
            <Badge variant="destructive" className="text-xs">
              부족
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'minStock',
    header: '최소 재고',
    cell: ({ row }) => <span className="text-sm">{row.original.minStock}</span>,
  },
  {
    accessorKey: 'maxStock',
    header: '최대 재고',
    cell: ({ row }) => <span className="text-sm">{row.original.maxStock}</span>,
  },
  {
    accessorKey: 'storePrice',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        매장 가격
        <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = row.original.storePrice;
      return (
        <span className="text-sm">
          {price != null ? `₩${price.toLocaleString()}` : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'isAvailable',
    header: '판매 가능',
    cell: ({ row }) => (
      <Badge variant={row.original.isAvailable ? 'success' : 'secondary'}>
        {row.original.isAvailable ? '가능' : '불가'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <InventoryRowActions inventory={row.original} />,
  },
];
