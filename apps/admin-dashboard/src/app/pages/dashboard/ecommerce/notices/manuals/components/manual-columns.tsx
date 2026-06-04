import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Manual } from '@starcoex-frontend/notices';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { ManualRowActions } from './manual-row-actions';
import { ManualStatusBadge } from '@/app/pages/dashboard/ecommerce/notices/components/notice-status-badge';

export const manualColumns: ColumnDef<Manual>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="제목" />
    ),
    cell: ({ row }) => (
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium">{row.original.title}</p>
        {row.original.summary && (
          <p className="text-muted-foreground truncate text-xs">
            {row.original.summary}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => <ManualStatusBadge status={row.original.status} />,
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'categoryId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="카테고리" />
    ),
    cell: ({ row }) => {
      const cat = row.original.category;
      return (
        <Badge variant="outline" className="text-xs">
          {cat?.name ?? `#${row.original.categoryId}`}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: 'targetBusiness',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="대상 사업" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.targetBusiness}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'version',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="버전" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">v{row.original.version}</span>
    ),
  },
  {
    accessorKey: 'tags',
    header: '태그',
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags?.length)
        return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="순서" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.order}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ManualRowActions manual={row.original} />,
  },
];
