import React from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { APP_CONFIG } from '@/app/config/app.config';
import { PageHead } from '@starcoex-frontend/common';
import { HeroSection } from '@/components/sections/home/hero-section';
import { ServicesSection } from '@/components/sections/home/services-section';

export const HomePage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();

  const getPageTitle = () => {
    if (isAuthenticated && currentUser?.name) {
      return `${currentUser.name}님, 환영합니다 - 스타코엑스 난방유 배달`;
    }
    return '스타코엑스 난방유 배달 - 신속하고 안전한 난방유 배송 서비스';
  };

  const getPageDescription = () => {
    if (isAuthenticated) {
      return `${APP_CONFIG.seo.defaultDescription} 포털 계정으로 자동 로그인 완료!`;
    }
    return APP_CONFIG.seo.defaultDescription;
  };

  return (
    <>
      <PageHead
        title={getPageTitle()}
        description={getPageDescription()}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}`}
      />

      <div className="space-y-0">
        <HeroSection />
        <ServicesSection />
      </div>
    </>
  );
};
