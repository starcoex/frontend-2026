import { APP_CONFIG } from '../config/app.config';
import { PageHead } from '@starcoex-frontend/common';
import { GasStationAboutHero } from '@/components/about/gas-station-about-hero';
import GasStationSeparator from '@/components/about/gas-station-separator';
import { GasStationTeamCarousel } from '@/components/about/gas-station-team-carosel-section';
import GasStationSplitSection from '@/components/about/gas-station-split-section';
import GasStationValuesSection from '@/components/about/gas-station-values-section';
import GasStationOpenPositions from '@/components/about/gas-station-open-positions';

// Split Section 데이터 배열
const SPLIT_SECTIONS = [
  {
    header: '품질에 대한 약속',
    description:
      '별표 주유소는 고품질의 연료와 정확한 계량 시스템을 통해 고객님께 신뢰할 수 있는 서비스를 제공합니다. 매일 품질 검사를 실시하고, 정기적인 장비 점검을 통해 항상 최상의 연료를 공급하고 있습니다.',
    image:
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    side: 'R' as const,
  },
  {
    header: '고객 중심 서비스',
    description:
      '고객 한 분 한 분의 소중한 시간을 배려하며 편안한 주유 환경을 만들어갑니다. 20년 경험을 바탕으로 한 신뢰할 수 있는 서비스로 고객 만족을 최우선으로 생각합니다.',
    image:
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    side: 'L' as const,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="회사 소개 - 별표주유소"
        description="2003년부터 제주도에서 함께해온 별표 주유소의 역사와 가치를 소개합니다."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/about`}
      />
      <GasStationAboutHero />
      <GasStationSeparator />
      <GasStationTeamCarousel />

      {SPLIT_SECTIONS.map((section, index) => (
        <GasStationSplitSection
          key={index}
          header={section.header}
          description={section.description}
          image={section.image}
          side={section.side}
        />
      ))}
      <GasStationSeparator />
      <GasStationValuesSection />
      <GasStationSeparator />
      <GasStationOpenPositions />
      <GasStationSeparator />
    </>
  );
}
