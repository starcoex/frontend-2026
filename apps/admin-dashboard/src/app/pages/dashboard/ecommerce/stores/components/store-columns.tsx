import { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Store } from '@starcoex-frontend/stores';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/stores/components/data-table-column-header';
import { StoreRowActions } from '@/app/pages/dashboard/ecommerce/stores/components/store-row-actons';

type StoreStatus = 'active' | 'inactive' | 'closed';

const getStoreStatus = (store: Store): StoreStatus => {
  if (store.isActive) return 'active';
  if (store.isVisible) return 'inactive';
  return 'closed';
};

const STATUS_CONFIG: Record<
  StoreStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' }
> = {
  active: { label: '운영 중', variant: 'success' },
  inactive: { label: '비활성', variant: 'warning' },
  closed: { label: '폐점', variant: 'destructive' },
};

export const storeColumns: ColumnDef<Store>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="매장명" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지점" />
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: 'brand',
    header: '브랜드',
    cell: ({ row }) => {
      const brand = row.original.brand;
      return (
        <span className="text-sm">
          {brand && typeof brand === 'object' && 'name' in brand
            ? String(brand.name)
            : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: '연락처',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.phone ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'orderCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="주문수" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.orderCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="평점" />
    ),
    cell: ({ row }) => {
      const rating = row.original.rating ?? 0;
      return (
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-orange-400 text-orange-400" />
          <span className="text-sm">{Number(rating).toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorFn: (row) => getStoreStatus(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = getStoreStatus(row.original);
      const config = STATUS_CONFIG[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    id: 'pickup',
    accessorFn: (row) => (row.pickupEnabled ? 'enabled' : 'disabled'),
    header: '픽업',
    cell: ({ row }) => (
      <Badge variant={row.original.pickupEnabled ? 'success' : 'secondary'}>
        {row.original.pickupEnabled ? '가능' : '불가'}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <StoreRowActions store={row.original} />,
  },
];
