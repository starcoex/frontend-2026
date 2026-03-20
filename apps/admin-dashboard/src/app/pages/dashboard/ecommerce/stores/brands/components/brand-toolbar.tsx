import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { PlusIcon } from 'lucide-react';
import { Brand, useStores } from '@starcoex-frontend/stores';
import { DataTableFacetedFilter } from '@/app/pages/dashboard/ecommerce/stores/components/data-table-faceted-filter';
import { DataTableViewOptions } from '@/app/pages/dashboard/ecommerce/stores/components/data-table-view-options';
import { BulkDeleteToolbar } from '@starcoex-frontend/common';

const BRAND_STATUS_OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
] as const;

interface BrandToolbarProps {
  table: Table<Brand>;
  onAddClick: () => void;
}

export function BrandToolbar({ table, onAddClick }: BrandToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteBrands, fetchBrands } = useStores();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="브랜드명 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={BRAND_STATUS_OPTIONS}
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

      <BulkDeleteToolbar
        table={table}
        onDelete={deleteBrands}
        onSuccess={fetchBrands}
        itemLabel="브랜드"
      />

      <div className="ml-auto flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={onAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          브랜드 등록
        </Button>
      </div>
    </div>
  );
}
