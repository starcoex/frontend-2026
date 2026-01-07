import React, { useMemo } from 'react';
import {
  FuelProductCode,
  FUEL_NAMES,
  createProcessedPrices,
  useFuelData,
} from '@starcoex-frontend/vehicles';
import { MonthlyPriceTrendChart } from '@/components/sections/fuel/components/monthly-price-trend-chart';
import { CurrentFuelPrices } from '@/components/sections/fuel/components/current-fuel-prices';
import { FuelPricesSectionHeader } from '@/components/sections/fuel/components/fuel-prices-section-header';
import {
  GasStationSidebar,
  StarStationPrices,
} from '@/components/sections/fuel/components/gas-station-sidebar';
import {
  FuelPricesError,
  FuelPricesLoading,
} from '@/components/sections/fuel/components/fuel-prices-display';

// 취급 품목만 정의 (LPG 제외)
const AVAILABLE_FUEL_ORDER: FuelProductCode[] = [
  'B034', // 고급휘발유
  'B027', // 휘발유
  'D047', // 경유
  'C004', // 실내등유
];

export const FuelPricesSection: React.FC = () => {
  // ✅ useFuel 훅 사용
  const {
    jejuPrices,
    starStationDetail,
    monthlyTrendData,
    monthlyDataInfo,
    isLoading,
    error,
    lastUpdated,
    refreshData,
  } = useFuelData();

  // ✅ 데이터 가공

  // 1. 제주도 평균 가격 처리
  const jejuAveragePrices = useMemo(() => {
    return createProcessedPrices(jejuPrices);
  }, [jejuPrices]);

  // 2. 별표주유소 가격 처리
  const starStationPrices = useMemo(() => {
    // ✅ [수정] 타입 정의에 맞춰 속성명 변경 (oilPrices -> OIL_PRICE)
    if (
      !starStationDetail?.OIL_PRICE ||
      !Array.isArray(starStationDetail.OIL_PRICE)
    ) {
      return [];
    }
    // createProcessedPrices 유틸리티가 FuelPrice[] 타입을 처리할 수 있다고 가정
    return createProcessedPrices(starStationDetail.OIL_PRICE);
  }, [starStationDetail]);

  // 3. 한 달간 가격 추이 데이터 변환 (Recharts용 포맷)
  const processedTrendData = useMemo(() => {
    if (!monthlyTrendData || monthlyTrendData.length === 0) return null;

    // 날짜 추출
    const dates = Array.from(
      new Set(
        monthlyTrendData.map((d) => d.TRADE_DT).filter((d): d is string => !!d)
      )
    ).sort();

    // 연료별 가격 데이터 매핑
    const pricesByFuel = AVAILABLE_FUEL_ORDER.reduce((acc, fuelCode) => {
      const fuelPrices = monthlyTrendData
        .filter((d) => d.PRODCD === fuelCode && d.TRADE_DT)
        .sort((a, b) => {
          const dateA = a.TRADE_DT || '';
          const dateB = b.TRADE_DT || '';
          return dateA.localeCompare(dateB);
        })
        .map((d) => {
          const dateStr = d.TRADE_DT;

          // YYYYMMDD 형식을 YYYY-MM-DD로 변환
          const formattedDate = !dateStr
            ? '-'
            : new Date(
                dateStr.length === 8
                  ? dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
                  : dateStr
              ).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              });

          return {
            date: dateStr,
            fuelCode: d.PRODCD,
            fuelType: FUEL_NAMES[d.PRODCD as FuelProductCode] || d.PRODCD,
            price: d.PRICE,
            formattedDate,
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

  // 핸들러
  const handleViewDetails = () => {
    window.location.href = '/prices';
  };

  // 로딩 및 에러 상태 처리
  // 데이터가 하나라도 있으면 로딩 화면 대신 데이터를 보여주고, 백그라운드에서 업데이트되는 느낌을 줌
  const hasData =
    jejuAveragePrices.some((p: any) => p.hasData) ||
    processedTrendData !== null;

  if (isLoading && !hasData) {
    return <FuelPricesLoading />;
  }

  if (error && !hasData) {
    return (
      <FuelPricesError
        error={error}
        onRetry={refreshData}
        isLoading={isLoading}
      />
    );
  }

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container p-0">
        <div className="flex flex-col gap-8 overflow-hidden px-6 py-12 md:px-16 md:py-32 md:pt-32">
          {/* 섹션 헤더 */}
          <FuelPricesSectionHeader
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            onRefresh={refreshData}
          />

          {/* 3단 레이아웃 구조 */}
          <div className="space-y-8">
            {/* 첫 번째 행: 제주도 평균 유가 + 별표주유소 유가 */}
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-[70%_30%]">
              <CurrentFuelPrices
                processedPrices={jejuAveragePrices}
                onViewDetails={handleViewDetails}
                showTitle={true}
              />

              <StarStationPrices
                processedPrices={starStationPrices}
                showTitle={true}
              />
            </div>

            {/* 두 번째 행: 한 달간 가격 추이 + 멤버십 등급제 */}
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-[70%_30%]">
              <MonthlyPriceTrendChart showTitle={true} />

              <GasStationSidebar showTitle={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
