import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { Promotion } from '@starcoex-frontend/promotions';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: '초안' },
  { value: 'PENDING_APPROVAL', label: '승인 대기' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'PAUSED', label: '일시 정지' },
  { value: 'ENDED', label: '종료됨' },
  { value: 'CANCELLED', label: '취소됨' },
] as const;

const TYPE_OPTIONS = [
  { value: 'COUPON', label: '쿠폰' },
  { value: 'DISCOUNT', label: '할인' },
  { value: 'BOGO', label: 'BOGO' },
  { value: 'FREE_SHIPPING', label: '무료 배송' },
  { value: 'POINT_MULTIPLIER', label: '포인트 배수' },
  { value: 'BUNDLE', label: '번들' },
  { value: 'TIME_BASED', label: '시간 기반' },
  { value: 'MEMBERSHIP', label: '멤버십' },
] as const;

interface PromotionsTableToolbarProps {
  table: Table<Promotion>;
}

export function PromotionsTableToolbar({ table }: PromotionsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="프로모션 이름 또는 코드 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[300px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={STATUS_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('type')}
        title="타입"
        options={TYPE_OPTIONS}
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
