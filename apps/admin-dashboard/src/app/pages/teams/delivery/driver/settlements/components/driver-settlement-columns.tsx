import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type {
  DriverSettlement,
  SettlementStatus,
} from '@starcoex-frontend/delivery';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const DRIVER_SETTLEMENT_STATUS_CONFIG: Record<
  SettlementStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  PENDING: { label: '정산 대기', variant: 'outline' },
  CALCULATED: { label: '계산 완료', variant: 'secondary' },
  APPROVED: { label: '승인 완료', variant: 'default' },
  PAID: { label: '지급 완료', variant: 'default' },
};

export const driverSettlementColumns: ColumnDef<DriverSettlement>[] = [
  {
    id: 'settlementDate',
    accessorKey: 'settlementDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="정산일" />
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {format(new Date(row.original.settlementDate), 'yyyy.MM.dd', {
          locale: ko,
        })}
      </span>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const cfg = DRIVER_SETTLEMENT_STATUS_CONFIG[row.original.status];
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    id: 'totalDeliveries',
    accessorKey: 'totalDeliveries',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 배송" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 text-sm tabular-nums">
        <span>{row.original.totalDeliveries}건</span>
        <span className="text-green-600">
          완료 {row.original.completedDeliveries}건
        </span>
        {row.original.cancelledDeliveries > 0 && (
          <span className="text-destructive">
            취소 {row.original.cancelledDeliveries}건
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'grossAmount',
    accessorKey: 'grossAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 수입" />
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        ₩{Number(row.original.grossAmount).toLocaleString()}
      </span>
    ),
  },
  {
    id: 'deductions',
    accessorKey: 'deductions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="공제액" />
    ),
    cell: ({ row }) => {
      const val = Number(row.original.deductions);
      return val > 0 ? (
        <span className="text-destructive text-sm tabular-nums">
          -₩{val.toLocaleString()}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: 'netAmount',
    accessorKey: 'netAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="실수령액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold tabular-nums text-green-600">
        ₩{Number(row.original.netAmount).toLocaleString()}
      </span>
    ),
  },
  {
    id: 'paidAt',
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지급일" />
    ),
    cell: ({ row }) =>
      row.original.paidAt ? (
        <div className="text-xs tabular-nums">
          <p>
            {format(new Date(row.original.paidAt), 'yyyy.MM.dd HH:mm', {
              locale: ko,
            })}
          </p>
          {row.original.paymentMethod && (
            <p className="text-muted-foreground">
              {row.original.paymentMethod}
            </p>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
  {
    id: 'notes',
    accessorKey: 'notes',
    header: '메모',
    cell: ({ row }) =>
      row.original.notes ? (
        <span className="text-muted-foreground max-w-[160px] truncate text-xs">
          {row.original.notes}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
];
