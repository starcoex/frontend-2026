import { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { generateAvatarFallback } from '@/app/utils/generateAvatarFallback';
import { LoyaltyRowActions } from './loyalty-row-actions';
import type { User, MembershipTier } from '@starcoex-frontend/graphql';

const TIER_CONFIG: Record<
  MembershipTier,
  { label: string; variant: 'outline' | 'secondary' | 'default' }
> = {
  WELCOME: { label: 'WELCOME', variant: 'outline' },
  SHINE: { label: 'SHINE', variant: 'secondary' },
  STAR: { label: 'STAR', variant: 'default' },
};

export const loyaltyColumns: ColumnDef<User>[] = [
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
    id: 'user',
    header: '회원',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback>
              {generateAvatarFallback(user.name ?? user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user.name ?? '이름 없음'}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
    filterFn: (row, _, value: string) => {
      if (!value) return true;
      const q = value.toLowerCase();
      return (
        (row.original.name ?? '').toLowerCase().includes(q) ||
        row.original.email.toLowerCase().includes(q)
      );
    },
  },
  {
    id: 'tier',
    accessorFn: (row) => row.membership?.currentTier ?? 'WELCOME',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등급" />
    ),
    cell: ({ row }) => {
      const tier = (row.original.membership?.currentTier ??
        'WELCOME') as MembershipTier;
      const config = TIER_CONFIG[tier];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.membership?.currentTier ?? 'WELCOME');
    },
  },
  {
    id: 'availableStars',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="보유 별" />
    ),
    cell: ({ row }) => {
      const stars = row.original.membership?.availableStars ?? 0;
      return (
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{stars.toLocaleString()}</span>
        </div>
      );
    },
    sortingFn: (a, b) =>
      (a.original.membership?.availableStars ?? 0) -
      (b.original.membership?.availableStars ?? 0),
  },
  {
    id: 'couponProgress',
    header: '쿠폰 진행률',
    cell: ({ row }) => {
      const progress = row.original.membership?.couponProgress ?? 0;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-1.5 w-20 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-muted-foreground text-xs">
            {Math.round(progress)}%
          </span>
        </div>
      );
    },
  },
  {
    id: 'exchangeableCoupons',
    header: '교환 가능 쿠폰',
    cell: ({ row }) => {
      const count = Math.floor(
        row.original.membership?.exchangeableCoupons ?? 0
      );
      return count > 0 ? (
        <Badge variant="outline">{count}개</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: 'tierProgress',
    header: '등급 진행률',
    cell: ({ row }) => {
      const membership = row.original.membership;
      const progress = membership?.tierProgress ?? 0;
      const nextTierName = membership?.nextTierName;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="bg-secondary h-1.5 w-20 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs">
              {Math.round(progress)}%
            </span>
          </div>
          {nextTierName && (
            <span className="text-muted-foreground text-xs">
              → {nextTierName}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <LoyaltyRowActions user={row.original} />,
  },
];
