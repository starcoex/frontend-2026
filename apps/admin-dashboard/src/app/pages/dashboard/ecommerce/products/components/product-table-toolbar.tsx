import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Product, useProducts } from '@starcoex-frontend/products';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { Search } from 'lucide-react';

const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: '판매 중' },
  { value: 'out-of-stock', label: '품절' },
  { value: 'closed-for-sale', label: '판매 중단' },
] as const;

interface ProductsTableToolbarProps {
  table: Table<Product>;
}

export function ProductsTableToolbar({ table }: ProductsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteProducts, fetchProducts } = useProducts();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {/* 검색창: 모바일 전체 너비 */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="제품명으로 검색..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className="h-8 pl-8 w-full sm:w-[200px] lg:w-[280px]"
        />
      </div>

      {/* 필터 버튼들: 모바일 가로 스크롤 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title="상태"
          options={PRODUCT_STATUS_OPTIONS}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 shrink-0"
          >
            초기화
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 벌크삭제 + 뷰옵션: 우측 정렬 */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <BulkDeleteToolbar
          table={table}
          onDelete={deleteProducts}
          onSuccess={fetchProducts}
          itemLabel="제품"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
