import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { PlusIcon } from 'lucide-react';
import type { InventoryRow } from './inventory-columns';
import { useProducts } from '@starcoex-frontend/products';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
const AVAILABILITY_OPTIONS = [
  { value: 'available', label: '판매 가능' },
  { value: 'unavailable', label: '판매 불가' },
] as const;

interface InventoryToolbarProps {
  table: Table<InventoryRow>;
  onAddClick: () => void;
  onRefresh?: () => void;
}

export function InventoryToolbar({
  table,
  onAddClick,
  onRefresh,
}: InventoryToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteInventory } = useProducts();

  // 다건 삭제: Promise.all로 병렬 처리
  const handleBulkDelete = async (ids: number[]) => {
    const results = await Promise.all(ids.map((id) => deleteInventory(id)));
    const failed = results.find((r) => !r.success);
    if (failed) return { success: false, error: failed.error };
    return { success: true };
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="제품명으로 검색..."
        value={(table.getColumn('product')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('product')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('isAvailable')}
        title="판매 상태"
        options={AVAILABILITY_OPTIONS}
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
        onDelete={handleBulkDelete}
        onSuccess={onRefresh}
        itemLabel="재고"
      />

      <div className="ml-auto flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={onAddClick}>
          <PlusIcon className="mr-2 size-4" />
          재고 등록
        </Button>
      </div>
    </div>
  );
}
