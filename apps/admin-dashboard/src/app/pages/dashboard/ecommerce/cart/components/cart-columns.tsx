import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type { Cart } from '@starcoex-frontend/cart';
import { CartRowActions } from './cart-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type CartStatus = 'active' | 'empty' | 'expired';

const getCartStatus = (cart: Cart): CartStatus => {
  if (cart.isExpired) return 'expired';
  if (cart.isEmpty) return 'empty';
  return 'active';
};

const STATUS_CONFIG: Record<
  CartStatus,
  { label: string; variant: 'success' | 'secondary' | 'destructive' }
> = {
  active: { label: '활성', variant: 'success' },
  empty: { label: '비어있음', variant: 'secondary' },
  expired: { label: '만료됨', variant: 'destructive' },
};

export const cartColumns: ColumnDef<Cart>[] = [
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
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자 ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">#{row.original.userId}</span>
    ),
  },
  {
    accessorKey: 'itemCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상품 수" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.itemCount}개</span>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 금액" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        ₩{row.original.totalAmount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'estimatedShipping',
    header: '배송비',
    cell: ({ row }) => {
      const shipping = row.original.estimatedShipping;
      if (shipping == null)
        return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <span className="text-sm">
          {shipping === 0 ? '무료' : `₩${shipping.toLocaleString()}`}
        </span>
      );
    },
  },
  {
    accessorKey: 'daysUntilExpiry',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="만료까지" />
    ),
    cell: ({ row }) => {
      const days = row.original.daysUntilExpiry;
      if (row.original.isExpired) {
        return <Badge variant="destructive">만료됨</Badge>;
      }
      if (days == null)
        return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <span
          className={`text-sm ${
            days <= 3 ? 'text-destructive font-semibold' : ''
          }`}
        >
          {days}일 후
        </span>
      );
    },
  },
  {
    accessorKey: 'lastAccessedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 접근" />
    ),
    cell: ({ row }) => {
      try {
        return (
          <span className="text-muted-foreground text-xs">
            {format(new Date(row.original.lastAccessedAt), 'yyyy.MM.dd HH:mm', {
              locale: ko,
            })}
          </span>
        );
      } catch {
        return <span className="text-muted-foreground text-xs">-</span>;
      }
    },
  },
  {
    id: 'status',
    accessorFn: (row) => getCartStatus(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = getCartStatus(row.original);
      const config = STATUS_CONFIG[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(getCartStatus(row.original));
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <CartRowActions cart={row.original} />,
  },
];
