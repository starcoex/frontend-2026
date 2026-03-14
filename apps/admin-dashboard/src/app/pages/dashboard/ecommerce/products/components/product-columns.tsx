import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Product, ProductCategoryRef } from '@starcoex-frontend/products';
import { ProductRowActions } from './product-row-actions';

const getCategoryName = (
  category: ProductCategoryRef | null | undefined
): string => category?.name ?? 'N/A';

type ProductStatus = 'active' | 'out-of-stock' | 'closed-for-sale';

const getProductStatus = (product: Product): ProductStatus => {
  if (!product.isActive) return 'closed-for-sale';
  if (!product.isAvailable) return 'out-of-stock';
  return 'active';
};

const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' }
> = {
  active: { label: '판매 중', variant: 'success' },
  'out-of-stock': { label: '품절', variant: 'warning' },
  'closed-for-sale': { label: '판매 중단', variant: 'destructive' },
};

export const productColumns: ColumnDef<Product>[] = [
  // ── 선택 ──────────────────────────────────────────────────────────────────
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

  // ── 제품명 + 이미지 ────────────────────────────────────────────────────────
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        제품명 <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrls?.[0];
      return (
        <div className="flex items-center gap-3">
          <figure className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                width={40}
                height={40}
                alt={row.original.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ImageIcon className="size-4 opacity-30" />
              </div>
            )}
          </figure>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {row.original.slug}
            </p>
          </div>
        </div>
      );
    },
  },

  // ── 가격 ──────────────────────────────────────────────────────────────────
  {
    accessorKey: 'basePrice',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        가격 <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          ₩{row.original.basePrice.toLocaleString()}
        </span>
        {row.original.salePrice != null && (
          <span className="text-muted-foreground text-xs line-through">
            ₩{row.original.salePrice.toLocaleString()}
          </span>
        )}
      </div>
    ),
  },

  // ── 카테고리 ──────────────────────────────────────────────────────────────
  {
    accessorKey: 'categoryId',
    header: '카테고리',
    cell: ({ row }) => (
      <span className="text-sm">{getCategoryName(row.original.category)}</span>
    ),
  },

  // ── 재고 (inventories 합산) ────────────────────────────────────────────────
  {
    id: 'stock',
    header: ({ column }) => (
      <Button
        className="-ml-3"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        재고 <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const inventories = row.original.inventories ?? [];
      const stock = inventories.reduce((sum, inv) => sum + inv.stock, 0);
      const isLow = stock < 10;
      return (
        <div className="flex flex-col">
          <span
            className={
              isLow ? 'text-destructive font-semibold text-sm' : 'text-sm'
            }
          >
            {stock.toLocaleString()}
          </span>
          {inventories.length > 0 && (
            <span className="text-muted-foreground text-xs">
              {inventories.length}개 매장
            </span>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const stockA = (rowA.original.inventories ?? []).reduce(
        (sum, inv) => sum + inv.stock,
        0
      );
      const stockB = (rowB.original.inventories ?? []).reduce(
        (sum, inv) => sum + inv.stock,
        0
      );
      return stockA - stockB;
    },
  },

  // ── SKU ───────────────────────────────────────────────────────────────────
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.sku}
      </span>
    ),
  },

  // ── 바코드 ────────────────────────────────────────────────────────────────
  {
    accessorKey: 'barcode',
    header: '바코드',
    cell: ({ row }) =>
      row.original.barcode ? (
        <span className="font-mono text-xs">{row.original.barcode}</span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },

  // ── 평점 ──────────────────────────────────────────────────────────────────
  {
    accessorKey: 'rating',
    header: '평점',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="size-3.5 fill-orange-400 text-orange-400" />
        <span className="text-sm">
          {row.original.rating?.toFixed(1) ?? '0.0'}
        </span>
      </div>
    ),
  },

  // ── 상태 ──────────────────────────────────────────────────────────────────
  {
    id: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = getProductStatus(row.original);
      const config = STATUS_CONFIG[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, filterValue) => {
      if (!filterValue) return true;
      return getProductStatus(row.original) === filterValue;
    },
  },

  // ── 액션 ──────────────────────────────────────────────────────────────────
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ProductRowActions product={row.original} />,
  },
];
