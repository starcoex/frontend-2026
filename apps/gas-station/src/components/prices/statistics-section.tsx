import React from 'react';
import { useFuelData } from '@starcoex-frontend/vehicles';

interface StatisticsSectionProps {
  hasStarStation?: boolean;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  hasStarStation,
}) => {
  const { sidoPrices, starStationDetail } = useFuelData();

  // 시도별 데이터 개수 계산 (지역 코드 기준 고유 개수)
  const regionCount = React.useMemo(() => {
    if (!sidoPrices || sidoPrices.length === 0) return 0;
    const uniqueRegions = new Set(
      sidoPrices.map((p) => p.AREA_CD).filter(Boolean)
    );
    return uniqueRegions.size;
  }, [sidoPrices]);

  // hasStarStation이 명시적으로 전달되지 않으면 Context에서 확인
  const showStarStation = hasStarStation ?? !!starStationDetail;

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col items-center justify-center gap-8 overflow-hidden py-12 text-center md:py-32">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          서비스 통계
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {regionCount}개
            </div>
            <p className="text-blue-700 dark:text-blue-400 font-medium">
              시도별 가격 비교
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              전국 시도 데이터 제공
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4종류</div>
            <p className="text-green-700 dark:text-green-400 font-medium">
              연료 종류
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              고급휘발유, 보통휘발유, 경유, 실내등유
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {showStarStation ? '1개' : '검색'}
            </div>
            <p className="text-yellow-700 dark:text-yellow-400 font-medium">
              주유소 정보
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              별표주유소 및 검색
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-6 border-orange-200 dark:border-orange-800 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">30분</div>
            <p className="text-orange-700 dark:text-orange-400 font-medium">
              업데이트 주기
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              실시간 가격 정보 제공
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
