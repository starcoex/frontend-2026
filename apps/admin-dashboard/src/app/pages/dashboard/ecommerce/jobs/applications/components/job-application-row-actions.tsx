import { useState } from 'react';
import { MoreHorizontal, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJobs } from '@starcoex-frontend/jobs';
import type { JobApplication } from '@starcoex-frontend/jobs';
import {
  JOB_APPLICATION_STATUS_OPTIONS,
  type JobApplicationStatusValue,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';

export function ApplicationRowActions({
  application,
}: {
  application: JobApplication;
}) {
  const navigate = useNavigate();
  const { updateApplicationStatus } = useJobs();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: JobApplicationStatusValue) => {
    if (newStatus === application.jobApplicationStatus) return;
    setIsUpdating(true);
    try {
      const res = await updateApplicationStatus({
        applicationId: application.id,
        jobApplicationStatus: newStatus,
      });
      if (res.success) {
        toast.success('지원서 상태가 변경되었습니다.');
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 인라인 상태 변경 Select */}
      <Select
        value={application.jobApplicationStatus}
        onValueChange={(v) =>
          handleStatusChange(v as JobApplicationStatusValue)
        }
        disabled={isUpdating}
      >
        <SelectTrigger className="h-7 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {JOB_APPLICATION_STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 추가 액션 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* 상세 보기 추가 */}
          <DropdownMenuItem
            onSelect={() =>
              navigate(`/admin/jobs/applications/${application.id}`)
            }
          >
            <Eye className="mr-2 h-3.5 w-3.5" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {JOB_APPLICATION_STATUS_OPTIONS.map((o) => (
            <DropdownMenuItem
              key={o.value}
              onSelect={() => handleStatusChange(o.value)}
              disabled={
                isUpdating || o.value === application.jobApplicationStatus
              }
              className={
                o.value === application.jobApplicationStatus
                  ? 'font-semibold text-primary'
                  : ''
              }
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              {o.label}으로 변경
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
