import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReviews } from '@starcoex-frontend/reviews';
import { ReviewsTable } from '@/app/pages/dashboard/ecommerce/reviews/components/review-table';

export default function ReviewsPage() {
  const { reviews, isLoading, error, fetchReviews } = useReviews();

  if (isLoading) {
    return <LoadingSpinner message="리뷰 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`리뷰 관리 - ${COMPANY_INFO.name}`}
        description="리뷰 목록을 관리하고 필터링하세요."
        keywords={['리뷰 관리', '리뷰 목록', COMPANY_INFO.name]}
        og={{
          title: `리뷰 관리 - ${COMPANY_INFO.name}`,
          description: '리뷰 목록 조회 및 관리 시스템',
          image: '/images/og-reviews.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => fetchReviews({ page: 1, limit: 20 })}
        />
      )}

      {!error && <ReviewsTable data={reviews} />}
    </>
  );
}
