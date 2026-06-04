import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '@starcoex-frontend/products';
import { productColumns } from './product-columns';
import { ProductsTableToolbar } from './product-table-toolbar';
import {
  DataTablePagination,
  MobileCard,
  MobileCardAction,
  MobileCardFooter,
  MobileCardHeader,
  MobileCardTitle,
} from '@starcoex-frontend/common';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Star } from 'lucide-react';
import { ProductRowActions } from '@/app/pages/dashboard/ecommerce/products/components/product-row-actions';
import { Badge } from '@/components/ui/badge';

// ─── 상태 계산 유틸 ───────────────────────────────────────────────────────────
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

function ProductMobileCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const imageUrl = product.imageUrls?.[0];
  const status = getProductStatus(product);
  const statusConfig = STATUS_CONFIG[status];
  const totalStock = (product.inventories ?? []).reduce(
    (sum, inv) => sum + inv.stock,
    0
  );
  const isLowStock = totalStock < 10;

  return (
    <MobileCard onClick={() => navigate(`/admin/products/${product.id}`)}>
      {/* 상단: 이미지 + 제품명 + 액션 */}
      <MobileCardHeader>
        <figure className="size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageIcon className="size-5 opacity-30" />
            </div>
          )}
        </figure>
        <MobileCardTitle className="ml-3">
          <p className="text-sm font-semibold truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {product.sku}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="size-3 fill-orange-400 text-orange-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating?.toFixed(1) ?? '0.0'}
            </span>
          </div>
        </MobileCardTitle>
        <MobileCardAction>
          <ProductRowActions product={product} />
        </MobileCardAction>
      </MobileCardHeader>

      {/* 하단: 가격 + 재고 + 상태 */}
      <MobileCardFooter>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            ₩{product.basePrice.toLocaleString()}
          </span>
          {product.salePrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              ₩{product.salePrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              isLowStock ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            재고 {totalStock.toLocaleString()}
          </span>
          <Badge variant={statusConfig.variant} className="text-xs">
            {statusConfig.label}
          </Badge>
        </div>
      </MobileCardFooter>
    </MobileCard>
  );
}

interface ProductsTableProps {
  data: Product[];
}

export function ProductsTable({ data }: ProductsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: productColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageSize: 20 } },
  });

  const filteredRows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <ProductsTableToolbar table={table} />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={productColumns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '제품이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── 모바일 카드 리스트 (sm 미만) ── */}
      <div className="flex sm:hidden flex-col gap-3">
        {filteredRows.length ? (
          filteredRows.map((row) => (
            <ProductMobileCard key={row.id} product={row.original} />
          ))
        ) : (
          <div className="text-muted-foreground py-12 text-center text-sm">
            {table.getState().columnFilters.length > 0
              ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
              : '제품이 없습니다.'}
          </div>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
