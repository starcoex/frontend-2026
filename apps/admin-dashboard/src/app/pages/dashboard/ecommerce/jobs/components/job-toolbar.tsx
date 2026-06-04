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
import { useJobs, type JobPosting } from '@starcoex-frontend/jobs';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_STATUS_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';

interface JobToolbarProps {
  table: Table<JobPosting>;
  onRefresh?: () => void;
}

export function JobToolbar({ table, onRefresh }: JobToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteJobPostings } = useJobs();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {/* 검색 */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Label htmlFor="job-search" className="sr-only">
          공고 제목 검색
        </Label>
        <Input
          id="job-search"
          placeholder="공고 제목 검색..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="h-8 pl-8 w-full sm:w-[200px] lg:w-[280px]"
        />
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <DataTableFacetedFilter
          column={table.getColumn('jobPostingStatus')}
          title="상태"
          options={JOB_STATUS_OPTIONS}
        />
        <DataTableFacetedFilter
          column={table.getColumn('employmentType')}
          title="고용 형태"
          options={EMPLOYMENT_TYPE_OPTIONS}
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

      {/* 벌크삭제 + 뷰옵션 */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <BulkDeleteToolbar
          table={table}
          onDelete={(ids) => deleteJobPostings({ ids })}
          onSuccess={onRefresh}
          itemLabel="채용 공고"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
