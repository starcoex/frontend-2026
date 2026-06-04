import { useNavigate } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePromotions } from '@starcoex-frontend/promotions';
import { useEffect } from 'react';
import { PromotionForm } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-form';

export default function PromotionCreatePage() {
  const navigate = useNavigate();
  const { promotions, fetchPromotions } = usePromotions();

  // ✅ 사용 중인 우선순위 목록 조회
  useEffect(() => {
    fetchPromotions({ page: 1, limit: 200 });
  }, [fetchPromotions]);

  const usedPriorities = promotions.map((p) => p.priority);

  return (
    <>
      <PageHead
        title={`프로모션 생성 - ${COMPANY_INFO.name}`}
        description="새로운 프로모션 캠페인을 생성하세요."
        keywords={['프로모션 생성', '할인 캠페인', COMPANY_INFO.name]}
        og={{
          title: `프로모션 생성 - ${COMPANY_INFO.name}`,
          description: '새로운 프로모션 캠페인을 생성하세요.',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <PromotionForm
          usedPriorities={usedPriorities}
          onSuccess={(id) => navigate(`/admin/promotions/${id}`)}
          onCancel={() => navigate('/admin/promotions')}
        />
      </div>
    </>
  );
}
