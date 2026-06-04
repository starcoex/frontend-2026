import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { DriverSettlement } from '@starcoex-frontend/delivery';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DRIVER_ROUTES } from '@/app/constants/teams/driver-routes';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: '정산 대기' },
  { value: 'CALCULATED', label: '계산 완료' },
  { value: 'APPROVED', label: '승인 완료' },
  { value: 'PAID', label: '지급 완료' },
] as const;

interface Props {
  table: Table<DriverSettlement>;
}

export function DriverSettlementTableToolbar({ table }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasStatusParam = searchParams.has('status');

  const isFiltered =
    table.getState().columnFilters.length > 0 || hasStatusParam;

  const statusColumn = table.getColumn('status');

  const handleReset = () => {
    table.resetColumnFilters();
    // ✅ ?status=paid 등 쿼리스트링이 있으면 URL도 초기화
    if (hasStatusParam) {
      navigate(DRIVER_ROUTES.SETTLEMENTS, { replace: true });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="상태"
          options={STATUS_OPTIONS}
        />
      )}

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={handleReset}
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
