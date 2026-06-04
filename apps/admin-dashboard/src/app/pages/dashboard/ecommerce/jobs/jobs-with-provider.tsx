import { JobsProvider } from '@starcoex-frontend/jobs';
import { JobsLayout } from '@/app/pages/dashboard/ecommerce/jobs/jobs-layout';

export const JobsWithProvider = () => {
  return (
    <JobsProvider>
      <JobsLayout />
    </JobsProvider>
  );
};
