import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotices } from '@starcoex-frontend/notices';
import type { Manual } from '@starcoex-frontend/notices';
import {
  MANUAL_STATUS_OPTIONS,
  MANUAL_TAB_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/notices/data/notices-data';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';

// 대상 사업 필터 옵션
const TARGET_BUSINESS_OPTIONS = [
  { value: 'ZERAGAE_CARCARE', label: '제라게 카케어' },
  { value: 'SINHAN_NETWORKS', label: '신한 네트웍스' },
  { value: 'STAR_GAS_STATION', label: '별표 주유소' },
  { value: 'SHADE_CANOPY', label: '그늘막' },
  { value: 'COMMON', label: '공통' },
] as const;

interface ManualToolbarProps {
  table: Table<Manual>;
  onRefresh?: () => void;
}

export function ManualToolbar({ table, onRefresh }: ManualToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { bulkDeleteManuals } = useNotices();

  const handleBulkDelete = async (ids: number[]) => {
    return bulkDeleteManuals({ ids });
  };

  const handleDeleteSuccess = async () => {
    table.resetRowSelection();
    onRefresh?.();
  };

  return (
    <div className="space-y-3">
      {/* 탭 필터 */}
      <Tabs
        defaultValue="all"
        onValueChange={(v) =>
          table
            .getColumn('status')
            ?.setFilterValue(v === 'all' ? undefined : [v])
        }
      >
        <TabsList>
          {MANUAL_TAB_OPTIONS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 검색 + 필터 행 */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="제목 검색..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="h-8 w-[200px] lg:w-[280px]"
        />

        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title="상태"
          options={MANUAL_STATUS_OPTIONS}
        />

        <DataTableFacetedFilter
          column={table.getColumn('targetBusiness')}
          title="대상 사업"
          options={TARGET_BUSINESS_OPTIONS}
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
          onDelete={handleBulkDelete}
          onSuccess={handleDeleteSuccess}
          itemLabel="매뉴얼"
          deleteDescription="선택한 매뉴얼이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        />

        <div className="ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
