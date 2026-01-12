import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { UserInvitation } from '@starcoex-frontend/graphql';
import { InvitationRowActions } from './invitation-row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/app/pages/dashboard/users/components/data-table-column-header';

// ✅ 타입을 문자열 리터럴로 변경
type InvitationStatusType = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

// 초대 상태별 스타일
const statusStyles: Record<InvitationStatusType, string> = {
  PENDING:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels: Record<InvitationStatusType, string> = {
  PENDING: '대기 중',
  ACCEPTED: '수락됨',
  EXPIRED: '만료됨',
  CANCELLED: '취소됨',
};

export const columns: ColumnDef<UserInvitation>[] = [
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-[250px] font-medium">
        {row.getValue('email')}
      </LongText>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue('role')}</span>
    ),
    filterFn: 'weakEquals',
  },
  {
    accessorKey: 'userType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Type" />
    ),
    cell: ({ row }) => {
      const userType = row.getValue('userType') as string;
      return (
        <span className="capitalize">
          {userType === 'INDIVIDUAL' ? '개인' : '사업자'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as InvitationStatusType;
      const badgeColor = statusStyles[status] || '';
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {statusLabels[status] || status}
        </Badge>
      );
    },
    filterFn: 'weakEquals',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invited At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return (
        <div className="w-fit text-nowrap">
          {format(new Date(date), 'yyyy-MM-dd HH:mm')}
        </div>
      );
    },
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('expiresAt') as string;
      const isExpired = new Date(date) < new Date();
      return (
        <div
          className={cn(
            'w-fit text-nowrap',
            isExpired && 'text-destructive font-medium'
          )}
        >
          {format(new Date(date), 'yyyy-MM-dd HH:mm')}
        </div>
      );
    },
  },
  {
    accessorKey: 'adminMessage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      const message = row.getValue('adminMessage') as string;
      return message ? (
        <LongText className="max-w-[200px] text-muted-foreground text-sm">
          {message}
        </LongText>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: 'actions',
    cell: InvitationRowActions,
  },
];
