import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { StoreInventory, useInventory } from '@starcoex-frontend/inventory';
import { INVENTORY_ZONE_OPTIONS } from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';

const URGENCY_OPTIONS = [
  { value: 'out-of-stock', label: '재고 없음' },
  { value: 'low-stock', label: '재고 부족' },
  { value: 'needs-reorder', label: '재주문 필요' },
] as const;

interface LowStockToolbarProps {
  table: Table<StoreInventory>;
}

export function LowStockToolbar({ table }: LowStockToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteStoreInventories, fetchLowStockInventories } = useInventory();

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
        column={table.getColumn('urgency')}
        title="긴급도"
        options={URGENCY_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('zone')}
        title="구역"
        options={INVENTORY_ZONE_OPTIONS}
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
        onSuccess={fetchLowStockInventories}
        itemLabel="재고"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
