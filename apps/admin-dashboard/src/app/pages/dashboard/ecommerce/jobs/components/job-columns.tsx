import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { JobPosting } from '@starcoex-frontend/jobs';
import { JobRowActions } from './job-row-actions';
import { EmploymentTypeBadge, JobStatusBadge } from './job-status-badge';

export const jobColumns: ColumnDef<JobPosting>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="공고 제목" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="부서" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.department ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'employmentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="고용 형태" />
    ),
    cell: ({ row }) => (
      <EmploymentTypeBadge type={row.original.employmentType} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'jobPostingStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <JobStatusBadge status={row.original.jobPostingStatus} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="근무지" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.location ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'applicationCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지원자" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.applicationCount}명
      </span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마감일" />
    ),
    cell: ({ row }) =>
      row.original.endDate
        ? format(new Date(row.original.endDate), 'yyyy/MM/dd', { locale: ko })
        : '상시',
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <JobRowActions job={row.original} />,
  },
];
