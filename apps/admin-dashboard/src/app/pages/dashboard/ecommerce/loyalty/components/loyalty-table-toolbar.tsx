import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { User } from '@starcoex-frontend/graphql';

const TIER_OPTIONS = [
  { value: 'WELCOME', label: 'WELCOME' },
  { value: 'SHINE', label: 'SHINE' },
  { value: 'STAR', label: 'STAR' },
] as const;

interface LoyaltyTableToolbarProps {
  table: Table<User>;
}

export function LoyaltyTableToolbar({ table }: LoyaltyTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="이름 또는 이메일 검색..."
        value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('user')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('tier')}
        title="등급"
        options={TIER_OPTIONS}
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

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
