import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  DriverSettlement,
  SettlementStatus,
} from '@starcoex-frontend/delivery';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AdminSettlementRowActions } from './admin-settlement-row-actions';
import type {
  ApproveSettlementInput,
  ProcessPaymentInput,
} from '@starcoex-frontend/delivery';

export const SETTLEMENT_STATUS_CONFIG: Record<
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

interface DeliverySettlementsColumnsOptions {
  onApprove: (input: ApproveSettlementInput) => Promise<any>;
  onPay: (input: ProcessPaymentInput) => Promise<any>;
  onUpdated: (updated: DriverSettlement) => void;
}

export const deliverySettlementsColumns = ({
  onApprove,
  onPay,
  onUpdated,
}: DeliverySettlementsColumnsOptions): ColumnDef<DriverSettlement>[] => [
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
    accessorKey: 'settlementDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="정산일" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.settlementDate), 'yyyy.MM.dd', {
          locale: ko,
        })}
      </span>
    ),
  },
  {
    accessorKey: 'driverId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="기사 ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.driverId}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = SETTLEMENT_STATUS_CONFIG[row.original.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'totalDeliveries',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 배송" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">
        <span>{row.original.totalDeliveries}건</span>
        <span className="text-green-600 ml-2">
          완료 {row.original.completedDeliveries}건
        </span>
        {row.original.cancelledDeliveries > 0 && (
          <span className="text-red-500 ml-2">
            취소 {row.original.cancelledDeliveries}건
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'grossAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 수입" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        ₩{Number(row.original.grossAmount).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'deductions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="공제액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-red-500">
        {Number(row.original.deductions) > 0
          ? `-₩${Number(row.original.deductions).toLocaleString()}`
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'netAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="실수령액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-green-600">
        ₩{Number(row.original.netAmount).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지급일" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.paidAt
          ? format(new Date(row.original.paidAt), 'yyyy.MM.dd', { locale: ko })
          : '-'}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <AdminSettlementRowActions
        settlement={row.original}
        onApprove={onApprove}
        onPay={onPay}
        onUpdated={onUpdated}
      />
    ),
  },
];
