import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';

const DELIVERY_STATUS_OPTIONS = [
  { value: 'PENDING', label: '대기' },
  { value: 'DRIVER_ASSIGNED', label: '기사 배정' },
  { value: 'ACCEPTED', label: '수락됨' },
  { value: 'PICKED_UP', label: '픽업 완료' },
  { value: 'IN_TRANSIT', label: '배송 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'FAILED', label: '실패' },
  { value: 'CANCELLED', label: '취소' },
  { value: 'RETURNED', label: '반송' },
] as const;

const DELIVERY_PRIORITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
] as const;

interface DeliveryTableToolbarProps {
  table: Table<Delivery>;
}

export function DeliveryTableToolbar({ table }: DeliveryTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

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
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={DELIVERY_STATUS_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('priority')}
        title="우선순위"
        options={DELIVERY_PRIORITY_OPTIONS}
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
