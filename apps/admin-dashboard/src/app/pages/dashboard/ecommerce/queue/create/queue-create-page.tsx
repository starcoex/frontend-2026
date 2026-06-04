import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { QueueCreateForm } from './queue-create-form';

export default function QueueCreatePage() {
  return (
    <>
      <PageHead
        title={`대기 수기 등록 - ${COMPANY_INFO.name}`}
        description="현장 방문 고객 대기 수기 등록"
        keywords={['대기 등록', '수기 등록', COMPANY_INFO.name]}
        og={{
          title: `대기 수기 등록 - ${COMPANY_INFO.name}`,
          description: '현장 방문 고객 대기 수기 등록',
          image: '/images/og-queue.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-md)">
        <QueueCreateForm />
      </div>
    </>
  );
}
