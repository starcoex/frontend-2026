import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { CategoryRowActions } from './category-row-actions';
import type { Category } from '@starcoex-frontend/categories';

export const categoryColumns: ColumnDef<Category>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10' },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        #{row.getValue('id')}
      </span>
    ),
    meta: { className: 'w-16' },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이름" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.getValue('name')}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.slug}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="설명" />
    ),
    cell: ({ row }) => {
      const description = row.getValue<string | null>('description');
      return (
        <span className="text-muted-foreground max-w-[240px] truncate text-sm">
          {description ?? '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'parentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="구분" />
    ),
    cell: ({ row }) => {
      const parentId = row.getValue<number | null>('parentId');
      return (
        <span className="text-sm">
          {parentId ? (
            <span className="text-muted-foreground">└ 하위</span>
          ) : (
            <span className="text-primary font-medium">최상위</span>
          )}
        </span>
      );
    },
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'productCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상품 수" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('productCount')}</span>
    ),
    meta: { className: 'w-24' },
  },
  // {
  //   accessorKey: 'sortOrder',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="정렬" />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="text-sm">{row.getValue('sortOrder')}</span>
  //   ),
  //   meta: { className: 'w-20' },
  // },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? '활성' : '비활성'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
    meta: { className: 'w-24' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CategoryRowActions row={row} />,
    meta: { className: 'w-12' },
  },
];
