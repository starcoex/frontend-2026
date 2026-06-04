import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useReviews } from '@starcoex-frontend/reviews';
import type { Review } from '@starcoex-frontend/reviews';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { REVIEW_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';

interface ReviewsTableToolbarProps {
  table: Table<Review>;
}

export function ReviewsTableToolbar({ table }: ReviewsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { bulkDeleteReviews, fetchReviews } = useReviews();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="제목으로 검색..."
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('title')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={REVIEW_STATUS_OPTIONS}
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
        onDelete={(ids) => bulkDeleteReviews({ ids })}
        onSuccess={() => fetchReviews({ page: 1, limit: 20 })}
        itemLabel="리뷰"
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
