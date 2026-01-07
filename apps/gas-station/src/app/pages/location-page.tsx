import React from 'react';
import { useFuelData } from '@starcoex-frontend/vehicles';
import {
  ErrorBoundary,
  LoadingPage,
  PageHead,
} from '@starcoex-frontend/common';
import { LocationHero } from '@/components/sections/locations/location-hero';
import { LocationSection } from '@/components/sections/location-section';

export const LocationPage: React.FC = () => {
  // 전역 상태에서 로딩/에러 상태만 가져오기
  const { isLoading, error } = useFuelData();

  // 로딩 상태
  if (isLoading) {
    return (
      <LoadingPage
        variant="default"
        message="위치 정보 로딩 중..."
        subtitle="별표주유소 위치와 편의시설 정보를 가져오고 있습니다"
        fullScreen={true}
      />
    );
  }

  // 에러 상태
  if (error) {
    return <ErrorBoundary />;
  }

  return (
    <>
      <PageHead
        title="위치 안내 - 별표주유소"
        description="제주도 연동에 위치한 별표주유소 위치 안내, 교통 정보, 편의시설을 확인하세요. 24시간 운영, 다양한 편의시설 완비."
        keywords={[
          '별표주유소위치',
          '제주주유소',
          '연동주유소',
          '24시간주유소',
          '제주도주유소위치',
          '교통안내',
          '편의시설',
        ]}
        siteName="별표주유소"
      />

      <LocationHero />

      {/* 위치 안내 메인 섹션 */}
      <LocationSection />
    </>
  );
};
