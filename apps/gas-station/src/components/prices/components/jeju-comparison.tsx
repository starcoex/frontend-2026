import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Trophy,
  AlertCircle,
  RefreshCw,
  Zap,
  Car,
  Truck,
  Fuel,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatPrice,
  FUEL_UI_CONFIG,
  FUEL_CODES,
  JEJU_SIGUN_CODES,
  useFuelData,
} from '@starcoex-frontend/vehicles';

// 취급 품목 (LPG 제외)
const TARGET_FUELS = [
  FUEL_CODES.PREMIUM_GASOLINE,
  FUEL_CODES.GASOLINE,
  FUEL_CODES.DIESEL,
  FUEL_CODES.KEROSENE,
];

// === 타입 정의 ===
interface FuelComparisonData {
  fuelCode: string;
  fuelType: string;
  jejuPrice: number;
  seogwipoPrice: number;
  jejuChange: number;
  seogwipoChange: number;
  priceDiff: number;
  cheaperCity: 'jeju' | 'seogwipo' | 'same';
}

// === 유틸리티 함수들 ===
const getTrendIcon = (change: number) => {
  if (change > 0) {
    return <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-red-500" />;
  }
  if (change < 0) {
    return <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-green-500" />;
  }
  return <Minus className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />;
};

const getTrendColorClass = (change: number) => {
  if (change > 0) return 'text-red-500';
  if (change < 0) return 'text-green-500';
  return 'text-muted-foreground';
};

const getPriceDiffColorClass = (diff: number) => {
  if (Math.abs(diff) < 1) return 'text-muted-foreground';
  return diff > 0
    ? 'text-red-600 dark:text-red-400'
    : 'text-green-600 dark:text-green-400';
};

const getFuelIcon = (fuelCode: string) => {
  switch (fuelCode) {
    case FUEL_CODES.PREMIUM_GASOLINE:
      return <Zap className="w-4 h-4" />;
    case FUEL_CODES.GASOLINE:
      return <Car className="w-4 h-4" />;
    case FUEL_CODES.DIESEL:
      return <Truck className="w-4 h-4" />;
    case FUEL_CODES.KEROSENE:
      return <Fuel className="w-4 h-4" />;
    default:
      return <Fuel className="w-4 h-4" />;
  }
};

// === 서브 컴포넌트들 ===
interface HeaderProps {
  lastUpdated?: string;
  isLoading?: boolean;
}

const ComparisonHeader: React.FC<HeaderProps> = ({
  lastUpdated,
  isLoading,
}) => (
  <div className="p-4 md:p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
    <div className="container flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
          제주시 vs 서귀포시 연료 가격 비교
        </h3>
        <p className="text-muted-foreground text-xs md:text-sm">
          두 도시간 연료별 가격 차이를 실시간으로 비교합니다
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
        )}
        <div className="text-right text-xs md:text-sm text-muted-foreground">
          <p>마지막 업데이트</p>
          <p>{lastUpdated || '로딩 중...'}</p>
        </div>
      </div>
    </div>
  </div>
);

interface PriceCellProps {
  price: number;
  change: number;
  isCheaper: boolean;
}

const PriceCell: React.FC<PriceCellProps> = ({ price, change, isCheaper }) => {
  return (
    <div
      className={`p-2 md:p-3 rounded-lg ${
        isCheaper ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/20'
      }`}
    >
      <div className="text-sm md:text-lg font-bold text-foreground flex items-center justify-center gap-1 md:gap-2">
        {formatPrice(price)}
        {isCheaper && <Trophy className="w-4 h-4 text-yellow-500" />}
      </div>
      <div
        className={`flex items-center justify-center gap-1 text-xs mt-1 ${getTrendColorClass(
          change
        )}`}
      >
        {getTrendIcon(change)}
        <span>
          {change > 0 ? '+' : ''}
          {change.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  value: number | string;
  label: string;
  bgColor: string;
  textColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  value,
  label,
  bgColor,
  textColor,
}) => (
  <div className={`text-center p-3 md:p-4 ${bgColor} rounded-lg`}>
    <div className={`text-lg md:text-2xl font-bold ${textColor} mb-1`}>
      {value}
    </div>
    <div className={`text-xs md:text-sm ${textColor}`}>{label}</div>
  </div>
);

interface SummaryProps {
  fuelComparisons: FuelComparisonData[];
}

const ComparisonSummary: React.FC<SummaryProps> = ({ fuelComparisons }) => {
  const jejuCheaperCount = fuelComparisons.filter(
    (f) => f.cheaperCity === 'jeju'
  ).length;
  const seogwipoCheaperCount = fuelComparisons.filter(
    (f) => f.cheaperCity === 'seogwipo'
  ).length;
  const sameCount = fuelComparisons.filter(
    (f) => f.cheaperCity === 'same'
  ).length;
  const maxPriceDiff = Math.max(
    ...fuelComparisons.map((f) => Math.abs(f.priceDiff)),
    0
  );

  return (
    <div className="p-4 md:p-6 bg-muted/10 border-t border-border">
      <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          value={`${jejuCheaperCount}개`}
          label="제주시가 저렴"
          bgColor="bg-blue-50 dark:bg-blue-950/30"
          textColor="text-blue-600 dark:text-blue-400"
        />
        <SummaryCard
          value={`${seogwipoCheaperCount}개`}
          label="서귀포시가 저렴"
          bgColor="bg-green-50 dark:bg-green-950/30"
          textColor="text-green-600 dark:text-green-400"
        />
        <SummaryCard
          value={`${sameCount}개`}
          label="동일 가격"
          bgColor="bg-gray-50 dark:bg-gray-950/30"
          textColor="text-gray-600 dark:text-gray-400"
        />
        <SummaryCard
          value={`${maxPriceDiff.toFixed(0)}원`}
          label="최대 가격차"
          bgColor="bg-yellow-50 dark:bg-yellow-950/30"
          textColor="text-yellow-600 dark:text-yellow-400"
        />
      </div>
    </div>
  );
};

// === 메인 컴포넌트 ===
export const JejuCityComparison: React.FC = () => {
  const { jejuSigunPrices, isLoading, error, refreshData, lastUpdated } =
    useFuelData();

  // API 데이터를 비교용 데이터로 변환
  const fuelComparisons = useMemo((): FuelComparisonData[] => {
    if (!jejuSigunPrices || jejuSigunPrices.length === 0) return [];

    const jejuCityData = jejuSigunPrices.filter(
      (price) => price.AREA_CD === JEJU_SIGUN_CODES.JEJU_CITY
    );
    const seogwipoCityData = jejuSigunPrices.filter(
      (price) => price.AREA_CD === JEJU_SIGUN_CODES.SEOGWIPO_CITY
    );

    const comparisons: FuelComparisonData[] = [];

    TARGET_FUELS.forEach((fuelCode) => {
      const jejuFuel = jejuCityData.find((item) => item.PRODCD === fuelCode);
      const seogwipoFuel = seogwipoCityData.find(
        (item) => item.PRODCD === fuelCode
      );

      if (jejuFuel && seogwipoFuel) {
        const jejuPrice = jejuFuel.PRICE || 0;
        const seogwipoPrice = seogwipoFuel.PRICE || 0;
        const priceDiff = jejuPrice - seogwipoPrice;

        let cheaperCity: 'jeju' | 'seogwipo' | 'same' = 'same';
        if (Math.abs(priceDiff) >= 1) {
          cheaperCity = priceDiff > 0 ? 'seogwipo' : 'jeju';
        }

        const config = FUEL_UI_CONFIG[fuelCode];

        comparisons.push({
          fuelCode,
          fuelType: config?.name || fuelCode,
          jejuPrice,
          seogwipoPrice,
          jejuChange: jejuFuel.DIFF || 0,
          seogwipoChange: seogwipoFuel.DIFF || 0,
          priceDiff,
          cheaperCity,
        });
      }
    });

    return comparisons;
  }, [jejuSigunPrices]);

  if (isLoading && jejuSigunPrices.length === 0) {
    return (
      <div className="bg-background rounded-xl border border-border">
        <ComparisonHeader lastUpdated="로딩 중..." isLoading={true} />
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && jejuSigunPrices.length === 0) {
    return (
      <div className="bg-background rounded-xl border border-border">
        <ComparisonHeader lastUpdated="오류 발생" />
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            가격 비교 데이터 로드 실패
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (fuelComparisons.length === 0) {
    return (
      <div className="bg-background rounded-xl border border-border">
        <ComparisonHeader lastUpdated={lastUpdated || undefined} />
        <div className="p-8 text-center text-muted-foreground">
          비교할 가격 데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden relative">
      {isLoading && jejuSigunPrices.length > 0 && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      <ComparisonHeader
        lastUpdated={lastUpdated || undefined}
        isLoading={isLoading}
      />

      {/* 테이블 */}
      <div className="overflow-x-auto p-4 md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-sm md:text-base font-medium">
                연료 종류
              </TableHead>
              <TableHead className="text-center text-sm md:text-base font-medium min-w-[120px]">
                <div className="flex items-center justify-center gap-1 md:gap-2">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">제주시</span>
                </div>
              </TableHead>
              <TableHead className="text-center text-sm md:text-base font-medium min-w-[120px]">
                <div className="flex items-center justify-center gap-1 md:gap-2">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">서귀포시</span>
                </div>
              </TableHead>
              <TableHead className="text-center text-xs md:text-base font-medium min-w-[100px]">
                가격 차이
              </TableHead>
              <TableHead className="text-center text-xs md:text-base font-medium min-w-[100px]">
                더 저렴한 곳
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fuelComparisons.map((fuel) => {
              const isJejuCheaper = fuel.cheaperCity === 'jeju';
              const isSeogwipoCheaper = fuel.cheaperCity === 'seogwipo';
              const isSame = fuel.cheaperCity === 'same';
              const config = FUEL_UI_CONFIG[fuel.fuelCode];

              return (
                <TableRow key={fuel.fuelCode} className="hover:bg-muted/10">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={`p-1.5 rounded-md ${
                          config?.bgColor || 'bg-gray-500'
                        } text-white`}
                      >
                        {getFuelIcon(fuel.fuelCode)}
                      </div>
                      <div>
                        <div
                          className={`font-medium text-xs md:text-base ${
                            config?.color || 'text-foreground'
                          }`}
                        >
                          {fuel.fuelType}
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">
                          리터당 가격
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <PriceCell
                      price={fuel.jejuPrice}
                      change={fuel.jejuChange}
                      isCheaper={isJejuCheaper}
                    />
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <PriceCell
                      price={fuel.seogwipoPrice}
                      change={fuel.seogwipoChange}
                      isCheaper={isSeogwipoCheaper}
                    />
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <div
                      className={`text-sm md:text-lg font-bold ${getPriceDiffColorClass(
                        fuel.priceDiff
                      )}`}
                    >
                      {Math.abs(fuel.priceDiff) < 1
                        ? '동일'
                        : `${
                            fuel.priceDiff > 0 ? '+' : ''
                          }${fuel.priceDiff.toFixed(1)}원`}
                    </div>
                    {Math.abs(fuel.priceDiff) >= 1 && (
                      <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                        (
                        {fuel.priceDiff > 0
                          ? '제주시가 비쌈'
                          : '서귀포시가 비쌈'}
                        )
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      {isSame ? (
                        <span className="text-muted-foreground text-xs md:text-sm">
                          동일
                        </span>
                      ) : (
                        <>
                          <Trophy className="w-3 h-3 md:w-5 md:h-5 text-yellow-500" />
                          <span className="font-medium text-foreground text-xs md:text-base">
                            {isJejuCheaper ? '제주시' : '서귀포시'}
                          </span>
                        </>
                      )}
                    </div>
                    {!isSame && (
                      <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                        {Math.abs(fuel.priceDiff).toFixed(1)}원 저렴
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ComparisonSummary fuelComparisons={fuelComparisons} />
    </div>
  );
};

export default JejuCityComparison;
