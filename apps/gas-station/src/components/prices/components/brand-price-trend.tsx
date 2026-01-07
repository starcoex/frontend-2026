import React, { useState, useMemo, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Lock,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FuelPrice } from '@starcoex-frontend/graphql';
import {
  FuelProductCode,
  getFuelUIConfig,
  FUEL_CODES,
  FUEL_NAMES,
  useVehicles,
  formatPrice,
  formatFullDate,
  getBrandName,
} from '@starcoex-frontend/vehicles';
import { DateRangePicker } from '@/components/date-rang-picker';
import { useSearchLimit } from '@/hooks/useSearchLimit';

// ==============================================================================
// 상수 정의
// ==============================================================================

// LPG(자동차용 부탄) 제외한 연료 목록
const AVAILABLE_FUEL_ORDER: FuelProductCode[] = [
  FUEL_CODES.PREMIUM_GASOLINE, // B034
  FUEL_CODES.GASOLINE, // B027
  FUEL_CODES.DIESEL, // D047
  FUEL_CODES.KEROSENE, // C004
];

const BRAND_CHART_COLORS: Record<string, string> = {
  SKE: '#ef4444',
  GSC: '#3b82f6',
  HDO: '#22c55e',
  SOL: '#eab308',
  RTE: '#6b7280',
  NHO: '#14b8a6',
  ETC: '#a855f7',
  E1G: '#f97316',
};

// ==============================================================================
// 타입 정의
// ==============================================================================

interface BrandPriceTrendProps {
  fuelCode?: string;
}

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  [key: string]: string | number;
}

interface StateComponentProps {
  error?: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

// ==============================================================================
// 유틸리티 함수
// ==============================================================================

const getFuelName = (fuelCode: FuelProductCode): string => {
  return FUEL_NAMES[fuelCode] || fuelCode;
};

const calculatePriceDirection = (change: number) => ({
  isUp: change > 0,
  isDown: change < 0,
});

const getPriceChangeClassName = (change: number): string => {
  if (change > 0) return 'text-red-500';
  if (change < 0) return 'text-green-500';
  return 'text-gray-500';
};

const formatDateToApi = (date: Date): string => {
  return format(date, 'yyyyMMdd');
};

const parseDateString = (dateStr: string): Date => {
  if (dateStr.includes('-')) {
    return new Date(dateStr);
  }
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1;
  const day = parseInt(dateStr.slice(6, 8));
  return new Date(year, month, day);
};

// ==============================================================================
// 데이터 처리 함수
// ==============================================================================

const processChartData = (
  monthlyData: FuelPrice[],
  selectedFuel: FuelProductCode
): { chartData: ChartDataPoint[]; brands: string[] } => {
  const filteredData = monthlyData.filter(
    (price) => price.PRODCD === selectedFuel
  );

  const dateMap = new Map<string, ChartDataPoint>();
  const brandSet = new Set<string>();

  filteredData.forEach((priceData) => {
    const date = priceData.TRADE_DT || '';
    const brandCode = priceData.AREA_CD || '';

    if (!date || !brandCode) return;

    brandSet.add(brandCode);

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        formattedDate: formatFullDate(date),
      });
    }

    const dataPoint = dateMap.get(date)!;
    dataPoint[brandCode] = priceData.PRICE || 0;
  });

  const chartData = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    chartData,
    brands: Array.from(brandSet),
  };
};

const calculateBrandStats = (
  monthlyData: FuelPrice[],
  selectedFuel: FuelProductCode
): Array<{
  brandCode: string;
  brandName: string;
  averagePrice: number;
  latestPrice: number;
  priceChange: number;
  dataCount: number;
}> => {
  const filteredData = monthlyData.filter(
    (price) => price.PRODCD === selectedFuel
  );

  const brandMap = new Map<
    string,
    { prices: number[]; latestDate: string; latestPrice: number }
  >();

  filteredData.forEach((priceData) => {
    const brandCode = priceData.AREA_CD || '';
    const date = priceData.TRADE_DT || '';
    const price = priceData.PRICE || 0;

    if (!brandCode || !price) return;

    if (!brandMap.has(brandCode)) {
      brandMap.set(brandCode, { prices: [], latestDate: '', latestPrice: 0 });
    }

    const brand = brandMap.get(brandCode)!;
    brand.prices.push(price);

    if (!brand.latestDate || date > brand.latestDate) {
      brand.latestDate = date;
      brand.latestPrice = price;
    }
  });

  return Array.from(brandMap.entries())
    .map(([brandCode, data]) => {
      const sum = data.prices.reduce((acc, p) => acc + p, 0);
      const averagePrice = sum / data.prices.length;
      const oldestPrice = data.prices[data.prices.length - 1] || 0;
      const priceChange = data.latestPrice - oldestPrice;

      return {
        brandCode,
        brandName: getBrandName(brandCode),
        averagePrice: Math.round(averagePrice * 100) / 100,
        latestPrice: data.latestPrice,
        priceChange,
        dataCount: data.prices.length,
      };
    })
    .sort((a, b) => a.averagePrice - b.averagePrice);
};

// ==============================================================================
// 상태 컴포넌트들
// ==============================================================================

const LoadingState: React.FC = () => (
  <Card className="bg-background border border-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        상표별 최근 가격 추이 로딩 중...
      </CardTitle>
    </CardHeader>
  </Card>
);

const ErrorState: React.FC<StateComponentProps> = ({
  error,
  onRetry,
  canRetry = true,
}) => (
  <Card className="bg-background border border-border">
    <CardHeader>
      <CardTitle className="text-red-600">오류 발생</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-red-500 mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" disabled={!canRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      )}
    </CardContent>
  </Card>
);

const EmptyState: React.FC = () => (
  <Card className="bg-background border border-border">
    <CardHeader>
      <CardTitle>데이터가 없습니다</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        선택한 조건에 해당하는 상표별 가격 추이 데이터가 없습니다.
      </p>
    </CardContent>
  </Card>
);

// 검색 제한 도달 배너
const LimitReachedBanner: React.FC = () => (
  <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl text-center my-4">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Lock className="w-8 h-8 text-primary" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      오늘의 무료 조회 횟수를 모두 사용했습니다
    </h3>
    <p className="text-muted-foreground text-sm mb-4">
      기간 변경 및 새로고침을 계속하려면 무료 회원가입하세요!
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button asChild>
        <Link to="/auth/register">
          <UserPlus className="w-4 h-4 mr-2" />
          무료 회원가입
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/auth/login">로그인</Link>
      </Button>
    </div>
  </div>
);

// ==============================================================================
// 연료 선택기 컴포넌트
// ==============================================================================

interface FuelSelectorButtonProps {
  fuelCode: FuelProductCode;
  isSelected: boolean;
  onClick: (fuelCode: FuelProductCode) => void;
}

const FuelSelectorButton: React.FC<FuelSelectorButtonProps> = ({
  fuelCode,
  isSelected,
  onClick,
}) => {
  const config = getFuelUIConfig(fuelCode);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(fuelCode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${config.bgColor} ${
          isSelected ? 'shadow-sm' : ''
        }`}
      />
      <span className="text-sm font-medium whitespace-nowrap">
        {config.description}
      </span>
    </Button>
  );
};

interface FuelSelectorSectionProps {
  selectedFuel: FuelProductCode;
  onFuelSelect: (fuel: FuelProductCode) => void;
}

const FuelSelectorSection: React.FC<FuelSelectorSectionProps> = ({
  selectedFuel,
  onFuelSelect,
}) => (
  <div className="mb-6">
    <h4 className="text-sm font-medium mb-3">연료 종류 선택</h4>
    <div className="flex items-center gap-3 flex-wrap">
      {AVAILABLE_FUEL_ORDER.map((fuelCode) => (
        <FuelSelectorButton
          key={fuelCode}
          fuelCode={fuelCode}
          isSelected={selectedFuel === fuelCode}
          onClick={onFuelSelect}
        />
      ))}
    </div>
  </div>
);

// ==============================================================================
// 차트 컴포넌트
// ==============================================================================

interface PriceChartProps {
  chartData: ChartDataPoint[];
  brands: string[];
  fuelCode: FuelProductCode;
}

const PriceChart: React.FC<PriceChartProps> = ({ chartData, brands }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any) => (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span style={{ color: entry.color }}>
                {getBrandName(entry.dataKey)}
              </span>
              <span className="font-medium">{formatPrice(entry.value)}</span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const parts = value.split(' ');
              return parts.length >= 2 ? `${parts[1]} ${parts[2]}` : value;
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => getBrandName(value)}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          {brands.map((brand) => (
            <Line
              key={brand}
              type="monotone"
              dataKey={brand}
              stroke={BRAND_CHART_COLORS[brand] || '#888888'}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==============================================================================
// 브랜드 통계 카드 컴포넌트
// ==============================================================================

interface BrandStatsCardProps {
  stats: {
    brandCode: string;
    brandName: string;
    averagePrice: number;
    latestPrice: number;
    priceChange: number;
    dataCount: number;
  };
  rank: number;
}

const BrandStatsCard: React.FC<BrandStatsCardProps> = ({ stats, rank }) => {
  const { isUp, isDown } = calculatePriceDirection(stats.priceChange);

  return (
    <div className="p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{
              backgroundColor: BRAND_CHART_COLORS[stats.brandCode] || '#888888',
            }}
          >
            {rank}
          </div>
          <div>
            <span className="font-medium">{stats.brandName}</span>
            <div className="text-xs text-muted-foreground">
              {stats.dataCount}일간 평균
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">
            {formatPrice(stats.averagePrice)}
          </div>
          <div className="flex items-center justify-end gap-1 text-xs">
            {isUp && <TrendingUp className="w-3 h-3 text-red-500" />}
            {isDown && <TrendingDown className="w-3 h-3 text-green-500" />}
            <span className={getPriceChangeClassName(stats.priceChange)}>
              {stats.priceChange > 0 ? '+' : ''}
              {stats.priceChange.toFixed(1)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 헤더 컴포넌트
// ==============================================================================

const CardHeaderSection: React.FC<{
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
  canRefresh: boolean;
  remainingSearches?: number;
  totalLimit?: number;
  isAuthenticated?: boolean;
}> = ({
  lastUpdated,
  onRefresh,
  isLoading,
  canRefresh,
  remainingSearches,
  totalLimit,
  isAuthenticated,
}) => (
  <CardHeader>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <CardTitle className="text-lg">브랜드별 가격 비교 및 추이</CardTitle>
      <div className="flex items-center gap-2">
        {!isAuthenticated && remainingSearches !== undefined && (
          <span className="text-xs text-muted-foreground">
            남은 조회: {remainingSearches}/{totalLimit}회
          </span>
        )}
        {lastUpdated && (
          <span className="text-sm text-muted-foreground">{lastUpdated}</span>
        )}
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading || !canRefresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  </CardHeader>
);

// ==============================================================================
// 메인 컴포넌트
// ==============================================================================

export const BrandPriceTrend: React.FC<BrandPriceTrendProps> = ({
  fuelCode = FUEL_CODES.PREMIUM_GASOLINE,
}) => {
  const { getMonthlyPollAvgPrices } = useVehicles();
  const {
    canSearch,
    remainingSearches,
    totalLimit,
    incrementSearchCount,
    isAuthenticated,
  } = useSearchLimit();

  const [selectedFuel, setSelectedFuel] = useState<FuelProductCode>(
    (fuelCode as FuelProductCode) || FUEL_CODES.PREMIUM_GASOLINE
  );

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [rawMonthlyData, setRawMonthlyData] = useState<FuelPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 검색 제한 도달 여부
  const isLimitReached = !isAuthenticated && !canSearch;

  const monthlyPollTrendData = useMemo(() => {
    if (rawMonthlyData.length === 0) return [];

    const fromTime = dateRange.from.getTime();
    const toTime = dateRange.to.getTime();

    return rawMonthlyData.filter((item) => {
      if (!item.TRADE_DT) return false;
      const itemDate = parseDateString(item.TRADE_DT);
      const itemTime = itemDate.getTime();
      return itemTime >= fromTime && itemTime <= toTime;
    });
  }, [rawMonthlyData, dateRange]);

  const loadData = async (countAsSearch = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const baseDate = formatDateToApi(dateRange.to);
      const res = await getMonthlyPollAvgPrices({ baseDate });

      if (res.success && res.data) {
        setRawMonthlyData(res.data.data ?? []);
        setLastUpdated(new Date().toLocaleString('ko-KR'));

        // 검색 횟수 증가 (비회원만, 명시적 요청 시)
        if (countAsSearch && !isAuthenticated) {
          incrementSearchCount();
        }
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('BrandPriceTrend 데이터 로딩 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 (검색 횟수 증가 안 함)
  const previousToRef = React.useRef<string>(formatDateToApi(dateRange.to));

  useEffect(() => {
    const currentTo = formatDateToApi(dateRange.to);
    if (previousToRef.current !== currentTo || rawMonthlyData.length === 0) {
      previousToRef.current = currentTo;
      loadData(false); // 초기 로딩은 검색 횟수 증가 안 함
    }
  }, [dateRange.to]);

  const { chartData, brands } = useMemo(() => {
    return processChartData(monthlyPollTrendData, selectedFuel);
  }, [monthlyPollTrendData, selectedFuel]);

  const brandStats = useMemo(() => {
    return calculateBrandStats(monthlyPollTrendData, selectedFuel);
  }, [monthlyPollTrendData, selectedFuel]);

  const handleFuelChange = (fuelCode: FuelProductCode) => {
    setSelectedFuel(fuelCode);
  };

  // 날짜 범위 변경 핸들러 (검색 제한 적용)
  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    if (isLimitReached) return;

    setDateRange(newRange);

    // 날짜 변경 시 검색 횟수 증가
    if (!isAuthenticated) {
      incrementSearchCount();
    }
  };

  const handleRefresh = async () => {
    if (isLimitReached) return;
    await loadData(true); // 새로고침은 검색 횟수 증가
  };

  if (isLoading && monthlyPollTrendData.length === 0) return <LoadingState />;
  if (error && monthlyPollTrendData.length === 0)
    return (
      <ErrorState
        error={error}
        onRetry={handleRefresh}
        canRetry={!isLimitReached}
      />
    );
  if (!isLoading && monthlyPollTrendData.length === 0) return <EmptyState />;

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container gap-8 overflow-hidden py-12 text-center md:py-32">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
              상표별 최근 가격 추이
            </h3>
          </div>
          {!isLimitReached && (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              maxDays={31}
            />
          )}
        </div>

        {/* 검색 제한 도달 시 배너 */}
        {isLimitReached && <LimitReachedBanner />}

        <Card className="bg-background rounded-xl border dark:border-white/80 shadow-sm overflow-hidden relative">
          <CardHeaderSection
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            canRefresh={!isLimitReached}
            remainingSearches={remainingSearches}
            totalLimit={totalLimit}
            isAuthenticated={isAuthenticated}
          />

          <CardContent className="space-y-6">
            {isLoading && monthlyPollTrendData.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            <FuelSelectorSection
              selectedFuel={selectedFuel}
              onFuelSelect={handleFuelChange}
            />

            <div>
              <h4 className="text-sm font-medium mb-4">
                {getFuelName(selectedFuel)} 가격 추이
              </h4>
              <PriceChart
                chartData={chartData}
                brands={brands}
                fuelCode={selectedFuel}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">
                브랜드별 평균 가격 순위 ({getFuelName(selectedFuel)})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {brandStats.map((stats, index) => (
                  <BrandStatsCard
                    key={stats.brandCode}
                    stats={stats}
                    rank={index + 1}
                  />
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                * 선택한 기간의 평균 가격 기준으로 정렬되었습니다.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
