import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobApplyForm } from '@/app/pages/dashboard/ecommerce/jobs/applications/components/job-apply-dialog';

export default function JobApplicationAdminEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedApplication, isLoading, error, fetchApplicationById } =
    useJobs();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      setFetched(true);
      return;
    }
    fetchApplicationById(numId).finally(() => setFetched(true));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fetched || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            지원서 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedApplication) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '지원서를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </div>
    );
  }

  return (
    <JobApplyForm
      jobTitle={selectedApplication.jobPosting?.title ?? '채용 공고'}
      jobPostingId={selectedApplication.jobPostingId}
      initialData={selectedApplication}
      onCancel={() =>
        navigate(`/admin/jobs/applications/${selectedApplication.id}`)
      }
      onSuccess={() =>
        navigate(`/admin/jobs/applications/${selectedApplication.id}`)
      }
    />
  );
}
