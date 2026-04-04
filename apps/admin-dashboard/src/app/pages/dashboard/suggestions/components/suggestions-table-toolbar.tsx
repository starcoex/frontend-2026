import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import {
  suggestionPriorities,
  suggestionStatuses,
} from '../data/suggestion-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Suggestion, useSuggestions } from '@starcoex-frontend/suggestions';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';

interface Props {
  table: Table<Suggestion>;
}

export function SuggestionsTableToolbar({ table }: Props) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteSuggestions, fetchSuggestions } = useSuggestions();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="제목으로 검색..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="상태"
              options={suggestionStatuses}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')}
              title="우선순위"
              options={suggestionPriorities}
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
          onDelete={deleteSuggestions}
          onSuccess={fetchSuggestions}
          itemLabel="건의사항"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
