import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReviews } from '@starcoex-frontend/reviews';
import { ReviewScopeManager } from '@/app/pages/dashboard/ecommerce/reviews/scopes/components/review-scope-manger';

export default function ReviewScopesPage() {
  const { fetchGeneralReviewScopes } = useReviews();

  useEffect(() => {
    fetchGeneralReviewScopes();
  }, [fetchGeneralReviewScopes]);

  return (
    <>
      <PageHead
        title={`리뷰 스코프 관리 - ${COMPANY_INFO.name}`}
        description="일반 리뷰 스코프를 관리합니다."
        keywords={['리뷰 스코프', '일반 리뷰', COMPANY_INFO.name]}
        og={{
          title: `리뷰 스코프 관리 - ${COMPANY_INFO.name}`,
          description: '일반 리뷰 스코프 관리',
          image: '/images/og-reviews.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-6">
        <ReviewScopeManager />
      </div>
    </>
  );
}
