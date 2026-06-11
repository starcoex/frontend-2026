import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company.config';
import FaqSection from '@/components/section/faq-section';
import { TestimonialsSection } from '@/components/section/testimonials-section';

export function FaqPage() {
  return (
    <>
      <PageHead
        title={`자주 묻는 질문 - ${COMPANY_INFO.name}`}
        description="스타코엑스 서비스 이용 관련 자주 묻는 질문을 확인하세요."
      />

      <div className="py-14 md:py-20 lg:py-24">
        <FaqSection withBorders={false} />
        <div className="py-14 md:py-20 lg:py-24">
          <TestimonialsSection withBorders={false} />
        </div>
      </div>
    </>
  );
}
