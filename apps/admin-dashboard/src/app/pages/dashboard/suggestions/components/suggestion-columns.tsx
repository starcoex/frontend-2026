import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { SuggestionRowActions } from './suggestion-row-actions';
import {
  suggestionCategories,
  suggestionPriorities,
  suggestionStatuses,
} from '../data/suggestion-data';
import type { Suggestion } from '@starcoex-frontend/suggestions';

export const suggestionColumns: ColumnDef<Suggestion>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="번호" />
    ),
    cell: ({ row }) => (
      <Link
        to={`/admin/suggestions/${row.getValue('id')}`}
        className="hover:text-primary w-[60px] font-semibold underline"
      >
        #{row.getValue('id')}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="제목" />
    ),
    cell: ({ row }) => {
      const category = suggestionCategories.find(
        (c) => c.value === row.original.category
      );
      return (
        <div className="flex space-x-2">
          {category && <Badge variant="outline">{category.label}</Badge>}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = suggestionStatuses.find(
        (s) => s.value === row.getValue('status')
      );
      if (!status) return null;
      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="우선순위" />
    ),
    cell: ({ row }) => {
      const priority = suggestionPriorities.find(
        (p) => p.value === row.getValue('priority')
      );
      if (!priority) return null;
      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <span className="text-muted-foreground text-sm">
          {date.toLocaleDateString('ko-KR')}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: SuggestionRowActions,
  },
];
