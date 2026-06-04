import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { PromotionsRowActions } from './promotions-row-actions';
import type {
  Promotion,
  PromotionStatus,
  PromotionType,
} from '@starcoex-frontend/promotions';

const STATUS_CONFIG: Record<
  PromotionStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  DRAFT: { label: '초안', variant: 'outline' },
  PENDING_APPROVAL: { label: '승인 대기', variant: 'secondary' },
  APPROVED: { label: '승인됨', variant: 'secondary' },
  ACTIVE: { label: '활성', variant: 'default' },
  PAUSED: { label: '일시 정지', variant: 'secondary' },
  ENDED: { label: '종료됨', variant: 'outline' },
  CANCELLED: { label: '취소됨', variant: 'destructive' },
};

const TYPE_LABELS: Record<PromotionType, string> = {
  COUPON: '쿠폰',
  DISCOUNT: '할인',
  BOGO: 'BOGO',
  FREE_SHIPPING: '무료 배송',
  POINT_MULTIPLIER: '포인트 배수',
  BUNDLE: '번들',
  TIME_BASED: '시간 기반',
  MEMBERSHIP: '멤버십',
};

export const promotionsColumns: ColumnDef<Promotion>[] = [
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
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="프로모션명" />
    ),
    cell: ({ row }) => {
      const promotion = row.original;
      return (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{promotion.name}</p>
          {promotion.code && (
            <p className="text-muted-foreground font-mono text-xs">
              {promotion.code}
            </p>
          )}
        </div>
      );
    },
    filterFn: (row, _, value: string) => {
      if (!value) return true;
      const q = value.toLowerCase();
      return (
        row.original.name.toLowerCase().includes(q) ||
        (row.original.code ?? '').toLowerCase().includes(q)
      );
    },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="타입" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {TYPE_LABELS[row.original.type] ?? row.original.type}
      </Badge>
    ),
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.type);
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status];
      return (
        <Badge variant={config?.variant ?? 'outline'}>
          {config?.label ?? row.original.status}
        </Badge>
      );
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    id: 'discountValue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="할인" />
    ),
    cell: ({ row }) => {
      const { discountType, discountValue } = row.original;
      return (
        <span className="text-sm font-medium">
          {discountType === 'PERCENTAGE'
            ? `${discountValue}%`
            : discountType === 'FIXED'
            ? `₩${discountValue.toLocaleString()}`
            : discountType}
        </span>
      );
    },
  },
  {
    id: 'period',
    header: '기간',
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      const format = (d: string) =>
        new Date(d).toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
      return (
        <div className="text-muted-foreground text-xs">
          <p>{format(startDate)}</p>
          <p>~ {format(endDate)}</p>
        </div>
      );
    },
  },
  {
    id: 'currentUsage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용 횟수" />
    ),
    cell: ({ row }) => {
      const { currentUsage, totalLimit } = row.original;
      return (
        <span className="text-sm">
          {currentUsage.toLocaleString()}
          {totalLimit ? ` / ${totalLimit.toLocaleString()}` : ''}
        </span>
      );
    },
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="우선순위" />
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.priority}</span>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <PromotionsRowActions promotion={row.original} />,
  },
];
