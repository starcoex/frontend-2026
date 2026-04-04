import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { categoryStatuses } from '../data/category-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category, useCategories } from '@starcoex-frontend/categories';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';

interface Props {
  table: Table<Category>;
}

export function CategoriesTableToolbar({ table }: Props) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteCategories, fetchCategoryTree } = useCategories();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="이름으로 검색..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('isActive') && (
            <DataTableFacetedFilter
              column={table.getColumn('isActive')}
              title="상태"
              options={categoryStatuses}
            />
          )}
        </div>
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
          onDelete={deleteCategories}
          onSuccess={fetchCategoryTree}
          itemLabel="카테고리"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
