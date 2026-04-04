import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  Delivery,
  DeliveryStatus,
  DeliveryPriority,
} from '@starcoex-frontend/delivery';
import { DeliveryRowActions } from './delivery-row-actions';
import { DataTableColumnHeader } from '@starcoex-frontend/common';

const STATUS_CONFIG: Record<
  DeliveryStatus,
  {
    label: string;
    variant:
      | 'default'
      | 'outline'
      | 'destructive'
      | 'warning'
      | 'secondary'
      | 'success';
  }
> = {
  PENDING: { label: '대기', variant: 'outline' },
  DRIVER_ASSIGNED: { label: '기사 배정', variant: 'secondary' },
  ACCEPTED: { label: '수락됨', variant: 'secondary' },
  PICKED_UP: { label: '픽업 완료', variant: 'warning' },
  IN_TRANSIT: { label: '배송 중', variant: 'warning' },
  DELIVERED: { label: '배송 완료', variant: 'success' },
  FAILED: { label: '실패', variant: 'destructive' },
  CANCELLED: { label: '취소', variant: 'destructive' },
  RETURNED: { label: '반송', variant: 'outline' },
};

const PRIORITY_CONFIG: Record<
  DeliveryPriority,
  {
    label: string;
    variant: 'default' | 'outline' | 'destructive' | 'warning' | 'secondary';
  }
> = {
  LOW: { label: '낮음', variant: 'outline' },
  NORMAL: { label: '보통', variant: 'secondary' },
  HIGH: { label: '높음', variant: 'warning' },
  URGENT: { label: '긴급', variant: 'destructive' },
};

export const deliveryColumns: ColumnDef<Delivery>[] = [
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
    accessorKey: 'deliveryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="배송번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.original.deliveryNumber}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="우선순위" />
    ),
    cell: ({ row }) => {
      const config = PRIORITY_CONFIG[row.original.priority];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: 'driver',
    header: '배달기사',
    cell: ({ row }) =>
      row.original.driver ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {row.original.driver.name}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {row.original.driver.vehicleType}
          </p>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">미배정</span>
      ),
  },
  {
    accessorKey: 'deliveryFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="배송비" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        ₩{row.original.deliveryFee.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'itemCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수량" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.itemCount}개</span>
    ),
  },
  {
    id: 'issueReported',
    header: '이슈',
    cell: ({ row }) =>
      row.original.issueReported ? (
        <Badge variant="destructive">이슈 있음</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
  {
    accessorKey: 'requestedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="요청일시" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.original.requestedAt).toLocaleString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DeliveryRowActions delivery={row.original} />,
  },
];
