import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { AboutHero } from '@/components/sections/about/about-hero';
import { AboutWhoWeAre } from '@/components/sections/about/about-who-we-are';
import { AboutValues } from '@/components/sections/about/about-values';
import { AboutPullQuote } from '@/components/sections/about/about-pull-quote';
import { AboutTeam } from '@/components/sections/about/about-team';
import { AboutFaq } from '@/components/sections/about/about-faq';
import { AboutCta } from '@/components/sections/about/about-cta';

export function AboutPage() {
  return (
    <>
      <PageHead
        title={`제라게 소개 - ${APP_CONFIG.seo.siteName}`}
        description="제주 별표주유소 안에서 시작한 제라게 카케어. 2년간 4만 대, 매일 손으로 직접 닦습니다."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/about`}
        robots="index, follow"
      />
      <AboutHero />
      <AboutWhoWeAre />
      <AboutValues />
      <AboutPullQuote />
      <AboutTeam />
      <AboutFaq />
      <AboutCta />
    </>
  );
}
