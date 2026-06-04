import React from 'react';
import { AboutHero } from '@/components/sections/about/about-hero';
import { AboutThroughYears } from '@/components/sections/about/about-through-years';
import { AboutServiceStats } from '@/components/sections/about/about-service-stats';
import { CtaSection } from '@/components/sections/cta-section';

export const AboutPage: React.FC = () => {
  return (
    <>
      <AboutHero />
      <AboutThroughYears />
      <AboutServiceStats />
      <CtaSection />
    </>
  );
};
