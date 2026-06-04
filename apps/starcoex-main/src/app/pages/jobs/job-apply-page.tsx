import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import { Loader2 } from 'lucide-react';
import { JobApplyForm } from '@/app/pages/jobs/components/job-apply-dialog';

export const JobApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedJobPosting, isLoading, fetchJobPosting } = useJobs();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      setFetched(true);
      return;
    }
    fetchJobPosting(numId).finally(() => setFetched(true));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fetched || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            공고 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedJobPosting) {
    navigate('/careers');
    return null;
  }

  return (
    <JobApplyForm
      jobTitle={selectedJobPosting.title}
      jobPostingId={selectedJobPosting.id}
      onCancel={() => navigate(`/careers/${id}`)}
      onSuccess={() => navigate('/my-applications')}
    />
  );
};
