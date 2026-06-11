import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Briefcase,
  Calendar,
  MapPin,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useJobs } from '@starcoex-frontend/jobs';

const APPLICATION_STATUS_LABEL: Record<
  string,
  { label: string; variant: string }
> = {
  PENDING: { label: '검토중', variant: 'secondary' },
  REVIEWING: { label: '서류심사', variant: 'warning' },
  PASSED: { label: '합격', variant: 'success' },
  REJECTED: { label: '불합격', variant: 'destructive' },
  CANCELLED: { label: '취소', variant: 'outline' },
};

export const MyApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // useJobs: fetchApplicationById, selectedApplication 사용
  const { fetchApplicationById, selectedApplication, isLoading } = useJobs();

  useEffect(() => {
    if (id) fetchApplicationById(Number(id));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !selectedApplication) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusConfig = APPLICATION_STATUS_LABEL[
    selectedApplication.jobApplicationStatus
  ] ?? {
    label: selectedApplication.jobApplicationStatus,
    variant: 'outline',
  };

  const posting = selectedApplication.jobPosting;
  // 자기소개서: profile.coverLetters 배열
  const coverLetters = selectedApplication.profile?.coverLetters ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">지원 상세</h1>
      </div>

      {/* 지원 현황 카드 */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="font-semibold text-base truncate">
              {posting?.title ?? '채용 공고'}
            </p>
            <p className="text-xs text-muted-foreground">
              지원일:{' '}
              {format(new Date(selectedApplication.createdAt), 'yyyy.MM.dd', {
                locale: ko,
              })}
            </p>
          </div>
          <Badge variant={statusConfig.variant as any} className="shrink-0">
            {statusConfig.label}
          </Badge>
        </div>

        {posting && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              {posting.department && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span>{posting.department}</span>
                </div>
              )}
              {posting.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{posting.location}</span>
                </div>
              )}
              {posting.endDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    마감일:{' '}
                    {format(new Date(posting.endDate), 'yyyy.MM.dd', {
                      locale: ko,
                    })}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 자기소개서 (복수 문항) */}
      {coverLetters.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">자기소개서</span>
          </div>
          <Separator />
          {coverLetters.map((cl) => (
            <div key={cl.id} className="space-y-1.5">
              {cl.question && (
                <p className="text-sm font-medium text-muted-foreground">
                  Q{cl.questionNo}. {cl.question}
                </p>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {cl.answer ?? '(미작성)'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 심사 결과 안내 */}
      {(selectedApplication.jobApplicationStatus === 'PASSED' ||
        selectedApplication.jobApplicationStatus === 'REJECTED') && (
        <div className="rounded-2xl border bg-muted/40 p-5 space-y-2">
          <p className="text-sm font-semibold">심사 결과</p>
          <Separator />
          <p className="text-sm text-muted-foreground">
            {selectedApplication.jobApplicationStatus === 'PASSED'
              ? '🎉 합격을 축하드립니다! 추가 안내는 등록하신 이메일로 발송됩니다.'
              : '아쉽게도 이번 채용에서는 함께하지 못하게 되었습니다. 다음 기회에 다시 도전해 주세요.'}
          </p>
        </div>
      )}

      {/* 수정 버튼 (PENDING 상태에서만) */}
      {selectedApplication.jobApplicationStatus === 'PENDING' && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/my-applications/${id}/edit`)}
        >
          지원서 수정
        </Button>
      )}
    </div>
  );
};
