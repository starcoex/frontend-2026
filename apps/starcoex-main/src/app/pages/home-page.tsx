import React from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '../config/company.config';
import { HeroSection } from '@/components/section/hero-section';
import ServicesSection from '@/components/section/services-section';
import ServiceAppsSection from '@/components/section/service-apps-section';
import { HybridBenefitsSection } from '@/components/section/hybrid-benefits-section';
import { StatsSection } from '@/components/section/stats-section';
import { TestimonialsSection } from '@/components/section/testimonials-section';
import { ContactSection } from '@/components/section/contact-section';
import FaqSection from '@/components/section/faq-section';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageHead
        title="스타코엑스 - 하이브리드 에너지 & 자동차 서비스"
        description={`${COMPANY_INFO.description} 소셜 로그인으로 간편하게 가입하고 모든 서비스를 한번에 이용하세요.`}
        keywords={[
          '하이브리드 서비스',
          '통합 플랫폼',
          '주유소 앱',
          '세차 서비스',
          '난방유 배달',
          '소셜 로그인',
          '자동 연결',
          '스타코엑스',
        ]}
        og={{
          title: '스타코엑스 - 하이브리드 에너지 & 자동차 서비스',
          description:
            '통합 포털에서 시작하여 각 서비스별 전용 앱까지! 소셜 로그인으로 간편하게 가입하고 모든 서비스를 자동으로 연결하세요.',
          image: '/images/og-hybrid-platform.jpg',
          type: 'website',
        }}
      />
      <HeroSection />
      <ServicesSection />
      <ServiceAppsSection />
      <HybridBenefitsSection />
      <StatsSection />
      <TestimonialsSection />
      <ContactSection />
      <FaqSection />
    </>
  );
};
