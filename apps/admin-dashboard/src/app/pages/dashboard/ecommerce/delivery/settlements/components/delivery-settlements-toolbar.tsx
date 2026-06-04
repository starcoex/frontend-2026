import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { DriverSettlement } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import { SETTLEMENT_STATUS_CONFIG } from './delivery-settlements-columns';

const STATUS_OPTIONS = Object.entries(SETTLEMENT_STATUS_CONFIG).map(
  ([value, { label }]) => ({ value, label })
);

interface DeliverySettlementsToolbarProps {
  table: Table<DriverSettlement>;
  onUpdated: (updated: DriverSettlement) => void;
}

export function DeliverySettlementsToolbar({
  table,
  onUpdated,
}: DeliverySettlementsToolbarProps) {
  const { approveSettlementBulk } = useDelivery();
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original);

  // 다건 승인 — CALCULATED 상태만 대상
  const handleBulkApprove = async () => {
    const targets = selectedRows.filter((s) => s.status === 'CALCULATED');
    if (targets.length === 0) {
      toast.info('승인 가능한 항목(계산 완료)이 없습니다.');
      return;
    }
    setIsBulkLoading(true);
    try {
      const res = await approveSettlementBulk({
        settlementIds: targets.map((s) => s.id),
      });
      if (res.success && res.data) {
        toast.success(`${res.data.successCount}건 승인 처리되었습니다.`);
        res.data.settlements.forEach(onUpdated);
        table.resetRowSelection();
      } else {
        toast.error(res.error?.message ?? '일괄 승인에 실패했습니다.');
      }
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 상태 필터 */}
      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={STATUS_OPTIONS}
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
        {/* 다건 승인 버튼 — 선택 항목이 있을 때만 표시 */}
        {selectedRows.length > 0 && (
          <Button
            size="sm"
            variant="default"
            onClick={handleBulkApprove}
            disabled={isBulkLoading}
            className="h-8"
          >
            <IconCheck className="mr-1.5 h-4 w-4" />
            일괄 승인 (
            {selectedRows.filter((s) => s.status === 'CALCULATED').length}건)
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
