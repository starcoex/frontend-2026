import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { FuelWalkIn } from '@starcoex-frontend/reservations';
import { useFuelWalkIns } from '@starcoex-frontend/reservations';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { FUEL_WALK_IN_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/reservations/data/fuel-walk-in-data';

interface FuelWalkInTableToolbarProps {
  table: Table<FuelWalkIn>;
  onRefresh: () => void;
}

export function FuelWalkInTableToolbar({
  table,
  onRefresh,
}: FuelWalkInTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { bulkDeleteFuelWalkIns } = useFuelWalkIns();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="고객명으로 검색..."
        value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('customer')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={FUEL_WALK_IN_STATUS_OPTIONS}
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
        onDelete={(ids) => bulkDeleteFuelWalkIns(ids.map(Number))}
        onSuccess={onRefresh}
        itemLabel="주유 워크인"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
