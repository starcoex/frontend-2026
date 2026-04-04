import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { Cart } from '@starcoex-frontend/cart';

const CART_STATUS_OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'empty', label: '비어있음' },
  { value: 'expired', label: '만료됨' },
] as const;

interface CartTableToolbarProps {
  table: Table<Cart>;
}

export function CartTableToolbar({ table }: CartTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="사용자 ID로 검색..."
        value={(table.getColumn('userId')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('userId')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={CART_STATUS_OPTIONS}
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
