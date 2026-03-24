import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { WalkIn } from '@starcoex-frontend/reservations';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { WalkInRowActions } from './walk-in-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { WALK_IN_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/walk-in-data';

export const walkInColumns: ColumnDef<WalkIn>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
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
      <span className="text-muted-foreground font-mono text-xs">
        #{row.original.id}
      </span>
    ),
  },
  {
    id: 'customer',
    header: '고객',
    cell: ({ row }) => {
      const name = row.original.customerName ?? '-';
      const phone = row.original.customerPhone ?? '';
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          {phone && (
            <span className="text-muted-foreground text-xs">{phone}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'waitingOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="대기 순서" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold">
        {row.original.waitingOrder}번
      </span>
    ),
  },
  {
    accessorKey: 'estimatedWaitMinutes',
    header: '예상 대기',
    cell: ({ row }) =>
      row.original.estimatedWaitMinutes != null ? (
        <span className="text-sm">{row.original.estimatedWaitMinutes}분</span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = WALK_IN_STATUS_CONFIG[row.original.status];
      return config ? (
        <Badge variant={config.variant}>{config.label}</Badge>
      ) : (
        <Badge variant="outline">{row.original.status}</Badge>
      );
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'arrivedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="도착 시간" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.original.arrivedAt), 'HH:mm', { locale: ko })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <WalkInRowActions walkIn={row.original} />,
  },
];
