import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { statusStyles, userTypes } from '../data/data';
import { User } from '@starcoex-frontend/graphql'; // ✅ GraphQL 타입 사용
import { Link } from 'react-router-dom';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LongText from '@/components/long-text';
import { Badge } from '@/components/ui/badge';
import { USER_ROUTES } from '@/app/constants/user-routes';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted pr-2! md:pr-0'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { name, id } = row.original;
      return (
        <Button variant="link" className="underline" asChild>
          <Link to={USER_ROUTES.DETAIL(id)}>
            <LongText className="max-w-36">{name}</LongText>
          </Link>
        </Button>
      );
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registered Date" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {format(row.getValue('createdAt'), 'dd MMM, yyyy')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'lastLoginAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login Date" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {format(row.getValue('lastLoginAt'), 'dd MMM, yyyy')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.isActive ? 'ACTIVE' : 'INACTIVE';
      const badgeColor = statusStyles[status];
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      );
    },
    filterFn: 'weakEquals',
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;
      const userType = userTypes.find(({ value }) => value === role);

      if (!userType) {
        return null;
      }

      return (
        <div className="flex items-center gap-x-2">
          {userType.icon && (
            <userType.icon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm capitalize">{row.getValue('role')}</span>
        </div>
      );
    },
    filterFn: 'weakEquals',
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
];
