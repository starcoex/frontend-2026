import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { HeatingOilDelivery } from '@starcoex-frontend/reservations';
import { useHeatingOilDeliveries } from '@starcoex-frontend/reservations';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { HEATING_OIL_DELIVERY_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/reservations/data/heating-oil-delivery-walk-in-data';

interface HeatingOilDeliveryTableToolbarProps {
  table: Table<HeatingOilDelivery>;
  onRefresh: () => void;
}

export function HeatingOilDeliveryTableToolbar({
  table,
  onRefresh,
}: HeatingOilDeliveryTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { bulkDeleteDeliveries } = useHeatingOilDeliveries();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="배달 번호 / 고객명 검색..."
        value={
          (table.getColumn('deliveryNumber')?.getFilterValue() as string) ?? ''
        }
        onChange={(e) =>
          table.getColumn('deliveryNumber')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={HEATING_OIL_DELIVERY_STATUS_OPTIONS}
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
        onDelete={(ids) => bulkDeleteDeliveries(ids.map(Number))}
        onSuccess={onRefresh}
        itemLabel="배달"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
