import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Notice } from '@starcoex-frontend/notices';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { NoticeRowActions } from './notice-row-actions';
import {
  NoticeStatusBadge,
  NoticeTypeBadge,
} from '@/app/pages/dashboard/ecommerce/notices/components/notice-status-badge';

export const noticeColumns: ColumnDef<Notice>[] = [
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
      <div className="flex items-center gap-2 min-w-0">
        {row.original.isPinned && (
          <Badge variant="outline" className="shrink-0 text-xs">
            📌 고정
          </Badge>
        )}
        {row.original.isPopup && (
          <Badge variant="outline" className="shrink-0 text-xs">
            팝업
          </Badge>
        )}
        <span className="truncate text-sm font-medium">
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="타입" />
    ),
    cell: ({ row }) => <NoticeTypeBadge type={row.original.type} />,
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => <NoticeStatusBadge status={row.original.status} />,
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'targetApps',
    header: '대상 앱',
    cell: ({ row }) => {
      const apps = row.original.targetApps;
      if (!apps?.length)
        return <span className="text-muted-foreground text-xs">전체</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {apps.slice(0, 2).map((app) => (
            <Badge key={app} variant="outline" className="text-xs">
              {app}
            </Badge>
          ))}
          {apps.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{apps.length - 2}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'publishedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="발행일" />
    ),
    cell: ({ row }) => {
      const date = row.original.publishedAt;
      if (!date)
        return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="text-sm">
          {format(new Date(date), 'MM/dd HH:mm', { locale: ko })}
        </span>
      );
    },
    sortingFn: 'datetime',
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
    cell: ({ row }) => <NoticeRowActions notice={row.original} />,
  },
];
