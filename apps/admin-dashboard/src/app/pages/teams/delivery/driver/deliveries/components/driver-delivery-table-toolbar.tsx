import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { Delivery } from '@starcoex-frontend/delivery';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: '수락 대기' },
  { value: 'DRIVER_ASSIGNED', label: '기사 배정' },
  { value: 'PICKUP_COMPLETED', label: '픽업 완료' },
  { value: 'IN_TRANSIT', label: '배송 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'CANCELLED', label: '취소' },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
] as const;

interface Props {
  table: Table<Delivery>;
}

export function DriverDeliveryTableToolbar({ table }: Props) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const statusColumn = table.getColumn('status');
  const priorityColumn = table.getColumn('priority');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="배송번호로 검색..."
        value={
          (table.getColumn('deliveryNumber')?.getFilterValue() as string) ?? ''
        }
        onChange={(e) =>
          table.getColumn('deliveryNumber')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[180px] lg:w-[240px]"
      />

      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="상태"
          options={STATUS_OPTIONS}
        />
      )}
      {priorityColumn && (
        <DataTableFacetedFilter
          column={priorityColumn}
          title="우선순위"
          options={PRIORITY_OPTIONS}
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

      <div className="ml-auto">
        {/* 배달기사는 삭제 권한 없으므로 BulkDeleteToolbar 제외 */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
