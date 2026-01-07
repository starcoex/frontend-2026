import React, { useMemo } from 'react';
import {
  FuelProductCode,
  FUEL_NAMES,
  createProcessedPrices,
  useFuelData,
} from '@starcoex-frontend/vehicles';
import { LoadingPage, PageHead } from '@starcoex-frontend/common';
import { PageHeader } from '@/components/prices/page-header';
import { StarStationSection } from '@/components/prices/star-station-section';
import { StationSearchSection } from '@/components/prices/station-search-section';
import { NationalPricesSection } from '@/components/prices/national-prices-section';
import { FooterNotice } from '@/components/footer-notice';
import { StatisticsSection } from '@/components/prices/statistics-section';
import { MonthlyPriceTrendChart } from '@/components/sections/fuel/components/monthly-price-trend-chart';
import { CityComparisonSection } from '@/components/prices/city-comparison-section';
import { BrandPriceTrend } from '@/components/prices/components/brand-price-trend';

// 취급 품목만 정의 (LPG 제외)
const AVAILABLE_FUEL_ORDER: FuelProductCode[] = [
  'B034', // 고급휘발유
  'B027', // 휘발유
  'D047', // 경유
  'C004', // 실내등유
];

export const PricesPage: React.FC = () => {
  const {
    jejuPrices,
    monthlyTrendData,
    monthlyDataInfo,
    isLoading,
    error,
    lastUpdated,
    refreshData,
  } = useFuelData();

  // 1. 제주도 평균 가격 처리
  const jejuAveragePrices = useMemo(() => {
    return createProcessedPrices(jejuPrices);
  }, [jejuPrices]);

  // 3. 한 달간 가격 추이 데이터 변환
  const processedTrendData = useMemo(() => {
    if (!monthlyTrendData || monthlyTrendData.length === 0) return null;

    const dates = Array.from(
      new Set(
        monthlyTrendData.map((d) => d.TRADE_DT).filter((d): d is string => !!d)
      )
    ).sort();

    const pricesByFuel = AVAILABLE_FUEL_ORDER.reduce((acc, fuelCode) => {
      const fuelPrices = monthlyTrendData
        .filter((d) => d.PRODCD === fuelCode && d.TRADE_DT)
        .sort((a, b) => {
          const dateA = a.TRADE_DT || '';
          const dateB = b.TRADE_DT || '';
          return dateA.localeCompare(dateB);
        })
        .map((d) => {
          const dateStr = d.TRADE_DT!;
          const isoDate =
            dateStr.length === 8
              ? dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
              : dateStr;

          return {
            date: dateStr,
            fuelCode: d.PRODCD,
            fuelType: FUEL_NAMES[d.PRODCD as FuelProductCode] || d.PRODCD,
            price: d.PRICE,
            formattedDate: new Date(isoDate).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
            }),
          };
        });

      if (fuelPrices.length > 0) {
        acc[fuelCode as FuelProductCode] = fuelPrices;
      }

      return acc;
    }, {} as Record<FuelProductCode, any[]>);

    return {
      dates,
      prices: pricesByFuel,
      lastUpdated: lastUpdated,
      isComplete: monthlyDataInfo.isComplete,
      availableDays: monthlyDataInfo.availableDays,
    };
  }, [monthlyTrendData, lastUpdated, monthlyDataInfo]);

  // 데이터 유무 확인
  const hasData =
    jejuAveragePrices.some((p: any) => p.hasData) ||
    processedTrendData !== null;

  // ✅ 로딩 조건 수정: 에러가 있으면 로딩 종료로 간주
  const showLoading = isLoading && !hasData && !error;

  if (showLoading) {
    return (
      <LoadingPage
        variant="default"
        message="연료 가격 정보 로딩 중..."
        subtitle="오피넷 API에서 최신 유가 정보를 가져오고 있습니다"
        fullScreen={true}
      />
    );
  }

  return (
    <>
      <PageHead
        title="실시간 연료 가격 정보 - 별표주유소"
        description="전국 시도별 연료 가격과 제주도 지역별 가격을 실시간으로 비교하고, 주변 주유소의 상세 정보를 확인하세요."
        keywords={['연료가격', '주유소', '유가정보', '제주도', '실시간가격']}
        siteName="별표주유소"
      />

      <PageHeader
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
        loading={isLoading}
        title="실시간 연료 가격 정보"
        description="전국 시도별 연료 가격과 제주도 지역별 가격을 실시간으로 비교하고, 주변 주유소의 상세 정보를 확인하세요."
      />

      {/* 별표주유소 정보 섹션 - 단일 날짜 선택 */}
      <StarStationSection />

      {/* 제주도 시별 비교 섹션 - 단일 날짜 선택 */}
      <CityComparisonSection />

      {/* 한 달간 가격 추이 섹션 - 기간 범위 선택 */}
      <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
        <div className="container gap-8 overflow-hidden py-12 md:py-32">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                제주도 지역
              </h2>
            </div>
          </div>
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[100%_0%]">
            <MonthlyPriceTrendChart showTitle={true} showDatePicker={true} />
          </div>
        </div>
      </section>

      {/* 주유소 검색 섹션 - 독립적인 기간 범위 선택 */}
      <StationSearchSection />

      {/* 브랜드별 가격 추이 - 독립적인 기간 범위 선택 */}
      <BrandPriceTrend />

      {/* 전국 평균가격 섹션 - 단일 날짜 선택 */}
      <NationalPricesSection />

      {/* 통계 섹션 (기존 컴포넌트) */}
      <StatisticsSection />

      <FooterNotice />
    </>
  );
};
