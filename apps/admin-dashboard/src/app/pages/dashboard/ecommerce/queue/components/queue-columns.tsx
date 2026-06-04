import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type { QueueSession } from '@starcoex-frontend/queue';
import { QueueStatusBadge } from './queue-status-badge';
import type { QueueStatusValue } from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';
import { QueueRowActions } from './queue-row-actions';

export const getQueueColumns = (
  onRefresh?: () => void
): ColumnDef<QueueSession>[] => [
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
    accessorKey: 'ticketNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="티켓 번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.original.ticketNumber}
      </span>
    ),
  },
  {
    accessorKey: 'storeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지점 ID" />
    ),
    cell: ({ row }) => <span className="text-sm">#{row.original.storeId}</span>,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="순번" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.position}</span>
    ),
  },
  // ✅ 고객 정보 (회원/비회원 통합)
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const { userId, guestName, guestPhone } = row.original;
      if (userId) {
        return (
          <div className="text-sm">
            <p className="font-medium text-muted-foreground">회원 #{userId}</p>
          </div>
        );
      }
      return (
        <div className="text-sm min-w-0">
          <p className="font-medium truncate">{guestName ?? '-'}</p>
          <p className="text-muted-foreground text-xs truncate">
            {guestPhone ?? '-'}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <QueueStatusBadge status={row.original.status as QueueStatusValue} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'estimatedEntryAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="예상 입장" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.estimatedEntryAt), 'MM/dd HH:mm', {
        locale: ko,
      }),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="접수 시각" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  // ✅ actions 컬럼 — QueueRowActions 연결
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <QueueRowActions session={row.original} onRefresh={onRefresh} />
    ),
  },
];
