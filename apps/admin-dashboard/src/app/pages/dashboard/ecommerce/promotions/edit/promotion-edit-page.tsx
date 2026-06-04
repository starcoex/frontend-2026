import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePromotions } from '@starcoex-frontend/promotions';
import { PromotionForm } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-form';

export default function PromotionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentPromotion,
    promotions,
    isLoading,
    error,
    fetchPromotionById,
    fetchPromotions,
    setCurrentPromotion,
  } = usePromotions();

  useEffect(() => {
    if (id) {
      fetchPromotionById(parseInt(id));
      // ✅ 전체 목록에서 우선순위 추출
      fetchPromotions({ page: 1, limit: 200 });
    }
    return () => setCurrentPromotion(null);
  }, [id, fetchPromotionById, fetchPromotions, setCurrentPromotion]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            프로모션 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentPromotion) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '프로모션을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/promotions')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`${currentPromotion.name} 수정 - ${COMPANY_INFO.name}`}
        description="프로모션 정보를 수정하세요."
        keywords={['프로모션 수정', currentPromotion.name, COMPANY_INFO.name]}
        og={{
          title: `${currentPromotion.name} 수정 - ${COMPANY_INFO.name}`,
          description: '프로모션 정보를 수정하세요.',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <PromotionForm
          promotion={currentPromotion}
          usedPriorities={promotions.map((p) => p.priority)}
          onSuccess={() => navigate(`/admin/promotions/${currentPromotion.id}`)}
          onCancel={() => navigate(`/admin/promotions/${currentPromotion.id}`)}
        />
      </div>
    </>
  );
}
