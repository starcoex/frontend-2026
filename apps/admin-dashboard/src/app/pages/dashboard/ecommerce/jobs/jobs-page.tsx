import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useJobs } from '@starcoex-frontend/jobs';
import { JobTable } from './components/job-table';

export default function JobsPage() {
  const { jobPostings, isLoading, error, fetchJobPostings } = useJobs();

  useEffect(() => {
    fetchJobPostings(false); // 관리자는 전체 공고 조회
  }, [fetchJobPostings]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            채용 공고를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`채용 공고 관리 - ${COMPANY_INFO.name}`}
        description="채용 공고를 관리하고 상태를 변경하세요."
        keywords={['채용 공고', '채용 관리', COMPANY_INFO.name]}
        og={{
          title: `채용 공고 관리 - ${COMPANY_INFO.name}`,
          description: '채용 공고 목록 조회 및 관리 시스템',
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchJobPostings(false)}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && (
        <JobTable
          data={jobPostings}
          onRefresh={() => fetchJobPostings(false)}
        />
      )}
    </>
  );
}
