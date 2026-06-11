import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useJobs } from '@starcoex-frontend/jobs';

const APPLICATION_STATUS_LABEL: Record<
  string,
  { label: string; variant: string }
> = {
  PENDING: { label: '검토중', variant: 'secondary' },
  REVIEWING: { label: '서류심사', variant: 'warning' },
  PASSED: { label: '합격', variant: 'success' }, // ★ ACCEPTED → PASSED
  REJECTED: { label: '불합격', variant: 'destructive' },
  CANCELLED: { label: '취소', variant: 'outline' }, // ★ WITHDRAWN → CANCELLED
};

export const MyApplicationsSection: React.FC = () => {
  const navigate = useNavigate();
  const { myApplications, isLoading, fetchMyApplications } = useJobs(); // ★ 훅 연결
  const recent = myApplications.slice(0, 3);

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">내 채용 지원 현황</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground h-8"
          onClick={() => navigate('/my-applications')}
        >
          전체 보기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Briefcase className="w-8 h-8 opacity-30" />
            <p className="text-sm">지원 내역이 없습니다.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/careers')}
              className="mt-1"
            >
              채용 공고 보기
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recent.map(
              (
                app // ★ statusConfig 변수 제거
              ) => (
                <button
                  key={app.id}
                  onClick={() => navigate(`/my-applications/${app.id}`)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {app.jobPosting?.title ?? '채용 공고'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(app.createdAt), 'MM월 dd일', {
                        locale: ko,
                      })}{' '}
                      지원
                    </p>
                  </div>
                  <Badge
                    variant={
                      (APPLICATION_STATUS_LABEL[app.jobApplicationStatus]
                        ?.variant ?? 'outline') as any
                    }
                    className="text-xs shrink-0"
                  >
                    {APPLICATION_STATUS_LABEL[app.jobApplicationStatus]
                      ?.label ?? app.jobApplicationStatus}
                  </Badge>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
