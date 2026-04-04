import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { StoreInventory, useInventory } from '@starcoex-frontend/inventory';
import {
  BulkDeleteToolbar,
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';

const STOCK_STATUS_OPTIONS = [
  { value: 'normal', label: '정상' },
  { value: 'low-stock', label: '재고 부족' },
  { value: 'out-of-stock', label: '재고 없음' },
  { value: 'over-stock', label: '과잉 재고' },
] as const;

const ZONE_OPTIONS = [
  { value: 'FUEL', label: '주유' },
  { value: 'CONVENIENCE', label: '편의점' },
  { value: 'CAFE', label: '카페' },
] as const;

interface InventoryTableToolbarProps {
  table: Table<StoreInventory>;
}

export function InventoryTableToolbar({ table }: InventoryTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteStoreInventories, fetchStoreInventories } = useInventory();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="상품 ID로 검색..."
        value={(table.getColumn('productId')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('productId')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[180px] lg:w-[240px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('stockStatus')}
        title="재고 상태"
        options={STOCK_STATUS_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('zone')}
        title="구역"
        options={ZONE_OPTIONS}
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
        onDelete={deleteStoreInventories}
        onSuccess={fetchStoreInventories}
        itemLabel="재고"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
