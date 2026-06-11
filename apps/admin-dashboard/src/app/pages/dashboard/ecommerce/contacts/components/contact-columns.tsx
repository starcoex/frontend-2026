import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import type { Contact } from '@starcoex-frontend/contact';
import { ContactRowActions } from './contact-row-actions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ContactCategoryBadge,
  ContactStatusBadge,
} from './contact-status-badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { Badge } from '@/components/ui/badge';

export const getContactColumns = (
  onRefresh?: () => void
): ColumnDef<Contact>[] => [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">#{row.original.id}</span>
    ),
  },
  {
    id: 'contact',
    header: '문의자',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{row.original.name}</p>
        <p className="text-muted-foreground truncate text-xs">
          {row.original.email}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="제목" />
    ),
    cell: ({ row }) => (
      <p className="truncate max-w-[200px] text-sm">
        {row.original.subject ?? row.original.message.slice(0, 30) + '...'}
      </p>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="카테고리" />
    ),
    cell: ({ row }) => (
      <ContactCategoryBadge category={row.original.category as any} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <ContactStatusBadge status={row.original.status as any} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'contactUserType',
    header: '문의자 유형',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.contactUserType === 'MEMBER' ? '회원' : '비회원'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="접수일시" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <ContactRowActions contact={row.original} onRefresh={onRefresh} />
    ),
  },
];
