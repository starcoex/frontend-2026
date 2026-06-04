import React from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { HeroSection } from '@/components/sections/hero-section';
import { FaqSection } from '@/components/sections/faq-section';
import { WashShowcase } from '@/components/sections/wash-showcase';
import { CarWashFeatures } from '@/components/sections/car-wash-features';
import { CarWashStats } from '@/components/sections/car-wash-stats';
import { CarWashTestimonials } from '@/components/sections/car-wash-testimonials';
import { CarWashCta } from '@/components/sections/car-wash-cta';
import { CarWashPreview } from '@/components/sections/car-wash-preview';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageHead
        title={`${APP_CONFIG.seo.pages.home.title} - ${APP_CONFIG.seo.siteName}`}
        description={APP_CONFIG.seo.pages.home.description}
        keywords={[
          ...APP_CONFIG.seo.keywords.primary,
          ...APP_CONFIG.seo.keywords.service,
        ]}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}`}
        robots="index, follow"
      />
      <HeroSection />
      <WashShowcase />
      <CarWashFeatures />
      <CarWashPreview /> {/* ← WashShowcase 다음에 배치 */}
      <CarWashStats />
      <CarWashTestimonials />
      <FaqSection />
      <CarWashCta />
    </>
  );
};
