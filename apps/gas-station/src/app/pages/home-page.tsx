import React from 'react';
import { MembershipCard, PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { MembershipInfoSection } from '@/components/sections/membership-info-section';
import { LocationSection } from '@/components/sections/location-section';
import { FaqSection } from '@/components/sections/faq-section';
import { PremiumServicesSection } from '@/components/sections/premium-services-section';
import { CarWashReviewSection } from '@/components/sections/car-wash-review-section';
import { FuelPricesSection } from '@/components/sections/fuel/fuel-prices.section';
import { useAuth } from '@starcoex-frontend/auth';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // SEO를 위한 고정 메타데이터 정의
  const pageTitle =
    '별표주유소 - 제주도 실시간 최저가 주유소 & 유가 정보 플랫폼';
  const pageDescription =
    '제주도 내 모든 주유소의 실시간 가격 비교, 위치 찾기, 면세유 정보 제공. 내 주변 가장 저렴한 주유소를 지금 별표주유소에서 확인하세요.';

  const pageKeywords = [
    '제주도 주유소',
    '실시간 유가',
    '최저가 주유소 찾기',
    '기름값 비교',
    '면세유',
    '전기차 충전소',
    '별표주유소',
  ];

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}`}
        robots="index, follow"
      />
      <HeroSection />
      <PremiumServicesSection />
      <ServicesSection />
      <CarWashReviewSection />
      <FuelPricesSection />

      {/* 로그인 사용자에게 현재 멤버십 현황 표시 */}
      {isAuthenticated && (
        <section className="py-12 container">
          <LoyaltyProvider>
            <MembershipCard showActions />
          </LoyaltyProvider>
        </section>
      )}

      <MembershipInfoSection />
      <LocationSection />
      <FaqSection />
    </>
  );
};
