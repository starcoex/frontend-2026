import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Store, useStores } from '@starcoex-frontend/stores';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import { BulkDeleteToolbar } from '@starcoex-frontend/common';

const STORE_STATUS_OPTIONS = [
  { value: 'active', label: '운영 중' },
  { value: 'inactive', label: '비활성' },
  { value: 'closed', label: '폐점' },
] as const;

const PICKUP_OPTIONS = [
  { value: 'enabled', label: '픽업 가능' },
  { value: 'disabled', label: '픽업 불가' },
] as const;

interface StoreToolbarProps {
  table: Table<Store>;
}

export function StoreToolbar({ table }: StoreToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteStores, fetchStores } = useStores();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="매장명 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={STORE_STATUS_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('pickup')}
        title="픽업"
        options={PICKUP_OPTIONS}
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
        onDelete={deleteStores}
        onSuccess={fetchStores}
        itemLabel="매장"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
