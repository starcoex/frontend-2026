import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  type Notification,
  NotificationStatus,
  NotificationType,
  NotificationChannel,
} from '@starcoex-frontend/notifications';
import { NotificationRowActions } from './notification-row-actions';
import { DataTableColumnHeader } from '@starcoex-frontend/common';

// ── 타입별 배지 설정 ─────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  [NotificationType.GENERAL]: { label: '일반', variant: 'secondary' },
  [NotificationType.SECURITY]: { label: '보안', variant: 'destructive' },
  [NotificationType.SYSTEM]: { label: '시스템', variant: 'default' },
  [NotificationType.MARKETING]: { label: '마케팅', variant: 'outline' },
  [NotificationType.REMINDER]: { label: '리마인더', variant: 'outline' },
  [NotificationType.PAYMENT]: { label: '결제', variant: 'default' },
  [NotificationType.RESERVATION]: { label: '예약', variant: 'default' },
  [NotificationType.FUEL]: { label: '유류', variant: 'secondary' },
  [NotificationType.DELIVERY]: { label: '배달', variant: 'secondary' },
};

const STATUS_CONFIG: Record<
  NotificationStatus,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'destructive'
      | 'success'
      | 'warning';
  }
> = {
  [NotificationStatus.UNREAD]: { label: '읽지 않음', variant: 'destructive' },
  [NotificationStatus.READ]: { label: '읽음', variant: 'success' },
  [NotificationStatus.ARCHIVED]: { label: '보관됨', variant: 'secondary' },
  [NotificationStatus.DELETED]: { label: '삭제됨', variant: 'outline' },
  [NotificationStatus.PENDING]: { label: '대기', variant: 'warning' },
  [NotificationStatus.SCHEDULED]: { label: '예약됨', variant: 'outline' },
  [NotificationStatus.SENT]: { label: '발송됨', variant: 'success' },
  [NotificationStatus.FAILED]: { label: '실패', variant: 'destructive' },
};

const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  [NotificationChannel.PUSH]: '푸시',
  [NotificationChannel.SMS]: 'SMS',
  [NotificationChannel.EMAIL]: '이메일',
  [NotificationChannel.KAKAO]: '카카오',
};

export const notificationColumns: ColumnDef<Notification>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="제목" />
    ),
    cell: ({ row }) => {
      const isUnread = row.original.status === NotificationStatus.UNREAD;
      return (
        <div className="min-w-0 max-w-[260px]">
          <p
            className={`truncate text-sm ${
              isUnread ? 'font-semibold' : 'font-normal'
            }`}
          >
            {row.original.title}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {row.original.message}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: '타입',
    cell: ({ row }) => {
      const config = TYPE_CONFIG[row.original.type];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.type);
    },
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
    accessorKey: 'channel',
    header: '채널',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {CHANNEL_LABEL[row.original.channel]}
      </span>
    ),
  },
  {
    accessorKey: 'userId',
    header: '수신자 ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs">#{row.original.userId}</span>
    ),
  },
  {
    accessorKey: 'relatedEntityType',
    header: '관련 엔티티',
    cell: ({ row }) => {
      const type = row.original.relatedEntityType;
      const id = row.original.relatedEntityId;
      if (!type)
        return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <span className="font-mono text-xs">
          {type}#{id}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.original.createdAt), 'MM/dd HH:mm', {
          locale: ko,
        })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <NotificationRowActions notification={row.original} />,
  },
];
