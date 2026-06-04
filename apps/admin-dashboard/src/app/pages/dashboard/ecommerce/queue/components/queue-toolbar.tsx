import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import {
  QUEUE_STATUS_OPTIONS,
  QUEUE_TAB_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';
import type { QueueSession } from '@starcoex-frontend/queue';

interface QueueToolbarProps {
  table: Table<QueueSession>;
  onRefresh?: () => void;
}

export function QueueToolbar({ table, onRefresh }: QueueToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-3">
      {/* 탭 필터 */}
      <div className="w-full overflow-x-auto scrollbar-none -mx-1 px-1">
        <Tabs
          defaultValue="all"
          onValueChange={(v) =>
            table
              .getColumn('status')
              ?.setFilterValue(v === 'all' ? undefined : [v])
          }
        >
          <TabsList className="w-max min-w-full sm:w-auto">
            {QUEUE_TAB_OPTIONS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Label htmlFor="queue-search" className="sr-only">
            티켓 번호 검색
          </Label>
          <Input
            id="queue-search"
            placeholder="티켓 번호 검색..."
            aria-label="티켓 번호 검색"
            value={
              (table.getColumn('ticketNumber')?.getFilterValue() as string) ??
              ''
            }
            onChange={(e) =>
              table.getColumn('ticketNumber')?.setFilterValue(e.target.value)
            }
            className="h-8 pl-8 w-full sm:w-[200px] lg:w-[280px]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="상태"
            options={QUEUE_STATUS_OPTIONS}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 shrink-0"
            >
              초기화
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
