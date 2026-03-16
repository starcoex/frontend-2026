import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { ProductInventory, Product } from '@starcoex-frontend/products';
import { InventoryRowActions } from './inventory-row-actions';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/products/components/data-table-column-header';

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
    accessorFn: (row) => row.product?.name ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="제품" />
    ),
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
      <DataTableColumnHeader column={column} title="매장" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">매장 #{row.original.storeId}</span>
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="현재 재고" />
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
      <DataTableColumnHeader column={column} title="매장 가격" />
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
    accessorFn: (row) => (row.isAvailable ? 'available' : 'unavailable'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="판매 가능" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isAvailable ? 'success' : 'secondary'}>
        {row.original.isAvailable ? '가능' : '불가'}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <InventoryRowActions inventory={row.original} />,
  },
];
