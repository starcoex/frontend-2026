import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: '승인 대기' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
  { value: 'SUSPENDED', label: '정지' },
  { value: 'TERMINATED', label: '해지' },
] as const;

const VEHICLE_OPTIONS = [
  { value: 'BICYCLE', label: '자전거' },
  { value: 'MOTORCYCLE', label: '오토바이' },
  { value: 'CAR', label: '자동차' },
  { value: 'TRUCK', label: '트럭' },
] as const;

interface Props {
  table: Table<DeliveryDriver>;
  onDeleteSuccess: () => void; // ✅ 삭제 후 목록 새로고침
}

export function DriverTableToolbar({ table, onDeleteSuccess }: Props) {
  const { deleteDrivers } = useDelivery();
  const isFiltered = table.getState().columnFilters.length > 0;

  const statusColumn = table.getColumn('status');
  const vehicleColumn = table.getColumn('vehicle');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="이름, 코드로 검색..."
        value={(table.getColumn('info')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('info')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[260px]"
      />

      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="상태"
          options={STATUS_OPTIONS}
        />
      )}
      {vehicleColumn && (
        <DataTableFacetedFilter
          column={vehicleColumn}
          title="차량"
          options={VEHICLE_OPTIONS}
        />
      )}

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

      <div className="ml-auto flex items-center gap-2">
        {/* ✅ 다건 삭제 */}
        <BulkDeleteToolbar
          table={table}
          onDelete={(ids) => deleteDrivers(ids)}
          onSuccess={onDeleteSuccess}
          itemLabel="배달기사"
          deleteDescription="선택한 배달기사를 완전히 삭제합니다. 진행 중인 배송이 있는 경우 삭제되지 않을 수 있습니다."
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
