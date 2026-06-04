import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import JobForm from './job-form';

export default function JobCreatePage() {
  return (
    <>
      <PageHead
        title={`채용 공고 추가 - ${COMPANY_INFO.name}`}
        description="새로운 채용 공고를 등록하세요."
        keywords={['채용 공고 추가', COMPANY_INFO.name]}
        og={{
          title: `채용 공고 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 채용 공고를 등록하세요.',
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <JobForm mode="create" />
      </div>
    </>
  );
}
