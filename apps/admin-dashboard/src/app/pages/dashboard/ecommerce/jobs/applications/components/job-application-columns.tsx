import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import type { JobApplication } from '@starcoex-frontend/jobs';
import {
  JOB_APPLICATION_STATUS_MAP,
  type JobApplicationStatusValue,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';
import { ApplicationRowActions } from './job-application-row-actions';
import { useAuth } from '@starcoex-frontend/auth';
import React, { useEffect, useState } from 'react';

// ─── 회원 이름 조회 셀 ────────────────────────────────────────────────────────
const ApplicantCell: React.FC<{ applicantId: number | null | undefined }> = ({
  applicantId,
}) => {
  const { getUserSimpleById } = useAuth();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!applicantId) return;
    getUserSimpleById(applicantId).then((res) => {
      const user = res.data?.getUserById;
      if (user?.name) setName(user.name);
    });
  }, [applicantId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!applicantId) {
    return (
      <Badge variant="outline" className="text-xs">
        비회원
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs">
      {name ? name : `회원 #${applicantId}`}
    </Badge>
  );
};

export const applicationColumns: ColumnDef<JobApplication>[] = [
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
      <DataTableColumnHeader column={column} title="지원 ID" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">#{row.original.id}</span>
    ),
  },
  {
    id: 'jobTitle',
    accessorFn: (row) => row.jobPosting?.title ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="채용 공고" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium line-clamp-1">
        {row.original.jobPosting?.title ?? '-'}
      </span>
    ),
    filterFn: (row, _id, value: string) =>
      row.original.jobPosting?.title
        ?.toLowerCase()
        .includes(value.toLowerCase()) ?? false,
  },
  {
    id: 'postingId',
    accessorFn: (row) => String(row.jobPostingId),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="공고 ID" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        #{row.original.jobPostingId}
      </span>
    ),
    filterFn: (row, _id, value: string[]) =>
      !value?.length || value.includes(String(row.original.jobPostingId)),
    enableHiding: true,
  },
  {
    accessorKey: 'jobApplicationStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config =
        JOB_APPLICATION_STATUS_MAP[
          row.original.jobApplicationStatus as JobApplicationStatusValue
        ];
      return (
        <Badge variant={(config?.variant as any) ?? 'secondary'}>
          {config?.label ?? row.original.jobApplicationStatus}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    id: 'applicantType',
    accessorFn: (row) => (row.applicantId ? '회원' : '비회원'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지원자 유형" />
    ),
    // ✅ ApplicantCell로 실제 사용자 이름 표시
    cell: ({ row }) => <ApplicantCell applicantId={row.original.applicantId} />,
  },
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-xs">
  //       {row.original.applicantId
  //         ? `회원 #${row.original.applicantId}`
  //         : '비회원'}
  //     </Badge>
  //   ),
  // },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="지원일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'yyyy/MM/dd HH:mm', {
        locale: ko,
      }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ApplicationRowActions application={row.original} />,
  },
];
