import { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Review } from '@starcoex-frontend/reviews';
import { ReviewRowActions } from './review-row-actions';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import {
  REVIEW_STATUS_CONFIG,
  REVIEW_TYPE_CONFIG,
} from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';
import { format } from 'date-fns';

export const reviewColumns: ColumnDef<Review>[] = [
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
    cell: ({ row }) => (
      <div className="min-w-0 max-w-[240px]">
        <p className="truncate text-sm font-medium">{row.original.title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {row.original.content}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="평점" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="size-3.5 fill-orange-400 text-orange-400" />
        <span className="text-sm font-medium">
          {row.original.rating.toFixed(1)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: '유형',
    cell: ({ row }) => {
      const config = REVIEW_TYPE_CONFIG[row.original.type];
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'targetType',
    header: '대상 유형',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.targetType}
      </span>
    ),
  },
  {
    accessorKey: 'userId',
    header: '작성자 ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm">#{row.original.userId}</span>
    ),
  },
  {
    id: 'votes',
    header: '도움됨',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.helpfulCount} / {row.original.notHelpfulCount}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = REVIEW_STATUS_CONFIG[row.original.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="작성일" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.original.createdAt), 'yyyy.MM.dd')}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ReviewRowActions review={row.original} />,
  },
];
