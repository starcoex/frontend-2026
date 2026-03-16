import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Product } from '@starcoex-frontend/products';
import { DataTableFacetedFilter } from '@/app/pages/dashboard/ecommerce/products/components/data-table-faceted-filter';
import { DataTableViewOptions } from '@/app/pages/dashboard/ecommerce/products/components/data-table-view-options';

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="제품명으로 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={PRODUCT_STATUS_OPTIONS}
      />

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
