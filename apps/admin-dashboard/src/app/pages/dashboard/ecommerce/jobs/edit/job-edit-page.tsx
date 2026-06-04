import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import JobForm from '@/app/pages/dashboard/ecommerce/jobs/create/job-form';

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedJobPosting, isLoading, error, fetchJobPosting } = useJobs();

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) return;
    fetchJobPosting(numId);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            공고 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedJobPosting) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '공고를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/jobs')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`공고 수정 - ${COMPANY_INFO.name}`}
        description="채용 공고를 수정하세요."
        keywords={['채용 공고 수정', COMPANY_INFO.name]}
        og={{
          title: `공고 수정 - ${COMPANY_INFO.name}`,
          description: '채용 공고를 수정하세요.',
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <JobForm mode="edit" job={selectedJobPosting} />
      </div>
    </>
  );
}
