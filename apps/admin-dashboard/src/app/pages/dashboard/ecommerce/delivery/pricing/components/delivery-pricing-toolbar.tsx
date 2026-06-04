import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { DeliveryFeePolicy } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';
import {
  DataTableViewOptions,
  DataTableFacetedFilter,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';

const ACTIVE_OPTIONS = [
  { value: 'true', label: '활성' },
  { value: 'false', label: '비활성' },
] as const;

const DEFAULT_OPTIONS = [
  { value: 'true', label: '기본 정책' },
  { value: 'false', label: '일반 정책' },
] as const;

interface DeliveryPricingToolbarProps {
  table: Table<DeliveryFeePolicy>;
  onDeleteSuccess?: () => void;
}

export function DeliveryPricingToolbar({
  table,
  onDeleteSuccess,
}: DeliveryPricingToolbarProps) {
  const { deleteDeliveryFeePolicy } = useDelivery();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 정책명 검색 */}
      <Input
        placeholder="정책명 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      {/* 활성 상태 필터 */}
      <DataTableFacetedFilter
        column={table.getColumn('isActive')}
        title="활성 상태"
        options={ACTIVE_OPTIONS}
      />

      {/* 기본 정책 필터 */}
      <DataTableFacetedFilter
        column={table.getColumn('isDefault')}
        title="정책 유형"
        options={DEFAULT_OPTIONS}
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

      <div className="ml-auto flex items-center gap-2">
        <BulkDeleteToolbar
          table={table}
          onDelete={(ids) =>
            Promise.all(ids.map((id) => deleteDeliveryFeePolicy(id))).then(
              (results) => ({
                success: results.every((r) => r.success),
                error: results.find((r) => !r.success)?.error,
              })
            )
          }
          onSuccess={onDeleteSuccess}
          itemLabel="정책"
          deleteDescription="선택한 배달비 정책을 삭제합니다."
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
