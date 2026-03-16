import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Brand } from '@starcoex-frontend/stores';
import { BrandRowActions } from './brand-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/stores/components/data-table-column-header';

export const brandColumns: ColumnDef<Brand>[] = [
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
      <DataTableColumnHeader column={column} title="브랜드명" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.logoUrl && (
          <img
            src={row.original.logoUrl}
            alt={row.original.name}
            className="h-8 w-8 rounded object-contain"
          />
        )}
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-muted-foreground text-xs">{row.original.slug}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-xs truncate text-sm">
        {row.original.description ?? '-'}
      </span>
    ),
  },
  {
    accessorKey: 'brandColor',
    header: '브랜드 컬러',
    cell: ({ row }) => {
      const color = row.original.brandColor;
      return color ? (
        <div className="flex items-center gap-2">
          <div
            className="h-5 w-5 rounded border"
            style={{ backgroundColor: color }}
          />
          <span className="text-muted-foreground text-xs">{color}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      );
    },
  },
  {
    id: 'status',
    accessorFn: (row) => (row.isActive ? 'active' : 'inactive'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
        {row.original.isActive ? '활성' : '비활성'}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'yyyy/MM/dd', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <BrandRowActions brand={row.original} />,
  },
];
