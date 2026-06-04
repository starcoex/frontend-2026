import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { useJobs, type JobApplication } from '@starcoex-frontend/jobs';
import { JOB_APPLICATION_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';

interface ApplicationToolbarProps {
  table: Table<JobApplication>;
  postingOptions: { value: string; label: string }[];
  onRefresh?: () => void;
}

export function ApplicationToolbar({
  table,
  postingOptions,
  onRefresh,
}: ApplicationToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteJobApplications } = useJobs();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {/* 공고명 검색 */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Label htmlFor="app-search" className="sr-only">
          공고명 검색
        </Label>
        <Input
          id="app-search"
          placeholder="공고명 검색..."
          value={
            (table.getColumn('jobTitle')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table.getColumn('jobTitle')?.setFilterValue(e.target.value)
          }
          className="h-8 pl-8 w-full sm:w-[200px] lg:w-[260px]"
        />
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <DataTableFacetedFilter
          column={table.getColumn('jobApplicationStatus')}
          title="지원 상태"
          options={JOB_APPLICATION_STATUS_OPTIONS}
        />
        {postingOptions.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn('postingId')}
            title="채용 공고"
            options={postingOptions}
          />
        )}
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

      {/* 벌크삭제 + 뷰옵션 */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <BulkDeleteToolbar
          table={table}
          onDelete={(ids) => deleteJobApplications({ ids })}
          onSuccess={onRefresh}
          itemLabel="지원서"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
