import { useEffect, useState } from 'react';
import { useJobs } from '@starcoex-frontend/jobs';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { ApplicationTable } from '@/app/pages/dashboard/ecommerce/jobs/applications/components/job-application-table';

export default function JobApplicationsPage() {
  const [searchParams] = useSearchParams();
  const postingIdParam = searchParams.get('postingId');

  const {
    selectedApplications,
    jobPostings,
    error,
    fetchApplicationsByPosting,
    fetchAllApplications,
    fetchJobPostings,
  } = useJobs();

  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // jobPostings가 없을 경우 직접 로드
  useEffect(() => {
    if (jobPostings.length === 0) {
      fetchJobPostings(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 지원자 목록 로드: postingId 있으면 해당 공고 지원자, 없으면 전체
  useEffect(() => {
    setPageLoading(true);
    setPageError(null);

    const postingId = postingIdParam ? Number(postingIdParam) : null;
    const isValidId = postingId && !isNaN(postingId) && postingId > 0;

    const fetchPromise = isValidId
      ? fetchApplicationsByPosting(postingId)
      : fetchAllApplications();

    fetchPromise
      .then((res) => {
        if (res && !res.success) {
          setPageError(
            (res as any).error?.message ?? '지원자 목록을 불러오지 못했습니다.'
          );
        }
      })
      .catch((e) => {
        setPageError(e?.message ?? '오류가 발생했습니다.');
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [postingIdParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setPageLoading(true);
    setPageError(null);

    const postingId = postingIdParam ? Number(postingIdParam) : null;
    const isValidId = postingId && !isNaN(postingId) && postingId > 0;

    const fetchPromise = isValidId
      ? fetchApplicationsByPosting(postingId)
      : fetchAllApplications();

    fetchPromise.finally(() => setPageLoading(false));
  };

  return (
    <>
      <PageHead
        title={`지원자 관리 - ${COMPANY_INFO.name}`}
        description="전체 지원자 목록을 관리하세요."
        keywords={['지원자 관리', '채용 공고', COMPANY_INFO.name]}
        og={{
          title: `지원자 관리 - ${COMPANY_INFO.name}`,
          description: '전체 지원자 통합 관리',
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />

      {(error || pageError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{pageError ?? error}</span>
            <button
              onClick={handleRefresh}
              className="ml-4 text-xs underline underline-offset-2"
            >
              다시 시도
            </button>
          </AlertDescription>
        </Alert>
      )}

      {pageLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">불러오는 중...</p>
          </div>
        </div>
      ) : (
        <ApplicationTable
          data={selectedApplications}
          jobPostings={jobPostings}
          initialPostingId={postingIdParam ?? undefined}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}
