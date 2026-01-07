import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  FuelProductCode,
  FUEL_CODES,
  FUEL_UI_CONFIG,
  FUEL_NAMES,
  formatPrice,
  useVehicles,
} from '@starcoex-frontend/vehicles';
import { FuelPrice } from '@starcoex-frontend/graphql';
import { TrendingUp, Zap, Car, Truck, Fuel, RefreshCw } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { DateRangePicker } from '@/components/date-rang-picker';
import { SearchLimitBanner } from '@/components/search-limit-banner';
import { useSearchLimit } from '@/hooks/useSearchLimit';

// ==============================================================================
// 타입 정의
// ==============================================================================

export interface PriceData {
  date: string;
  fuelCode: string;
  fuelType: string;
  price: number;
  formattedDate: string;
}

interface PriceStatistics {
  current: number;
  change: number;
  changePercent: number;
  max: number;
  min: number;
  average: number;
}

// ==============================================================================
// 상수 및 설정
// ==============================================================================

const DEFAULT_PRICE_RANGE = { min: 1300, max: 1700 };
const PRICE_MARGIN = 0.02;
const JEJU_SIDO_CODE = '16';

// 취급 품목만 정의 (LPG 제외)
const AVAILABLE_FUEL_ORDER: FuelProductCode[] = [
  'B034', // 고급휘발유
  'B027', // 휘발유
  'D047', // 경유
  'C004', // 실내등유
];

// ==============================================================================
// 유틸리티 함수들
// ==============================================================================

// 연료별 아이콘 반환 함수
const getFuelIcon = (fuelCode: FuelProductCode) => {
  switch (fuelCode) {
    case FUEL_CODES.PREMIUM_GASOLINE:
      return Zap;
    case FUEL_CODES.GASOLINE:
      return Car;
    case FUEL_CODES.DIESEL:
      return Truck;
    case FUEL_CODES.KEROSENE:
      return Fuel;
    default:
      return Fuel;
  }
};

// 날짜를 YYYYMMDD 형식으로 변환
const formatDateToApi = (date: Date): string => {
  return format(date, 'yyyyMMdd');
};

// 날짜 문자열을 Date 객체로 변환
const parseDateString = (dateStr: string): Date => {
  if (dateStr.includes('-')) {
    return new Date(dateStr);
  }
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1;
  const day = parseInt(dateStr.slice(6, 8));
  return new Date(year, month, day);
};

const calculatePriceRange = (
  prices: PriceData[]
): { min: number; max: number } => {
  if (prices.length === 0) {
    return DEFAULT_PRICE_RANGE;
  }

  const priceValues = prices.map((p) => p.price).filter((p) => !isNaN(p));
  if (priceValues.length === 0) {
    return DEFAULT_PRICE_RANGE;
  }

  const min = Math.min(...priceValues) * (1 - PRICE_MARGIN);
  const max = Math.max(...priceValues) * (1 + PRICE_MARGIN);

  return { min, max };
};

const calculatePriceStatistics = (prices: PriceData[]): PriceStatistics => {
  if (prices.length === 0) {
    return {
      current: 0,
      change: 0,
      changePercent: 0,
      max: 0,
      min: 0,
      average: 0,
    };
  }

  const sortedPrices = [...prices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const priceValues = prices.map((p) => p.price);
  const firstPrice = sortedPrices[0]?.price || 0;
  const currentPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
  const change = currentPrice - firstPrice;
  const changePercent = firstPrice !== 0 ? (change / firstPrice) * 100 : 0;
  const max = Math.max(...priceValues);
  const min = Math.min(...priceValues);
  const average =
    priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;

  return {
    current: currentPrice,
    change,
    changePercent,
    max,
    min,
    average,
  };
};

const formatDateForChart = (date: string): string => {
  return new Date(date).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
};

const transformChartData = (prices: PriceData[]): PriceData[] => {
  return prices
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      ...item,
      formattedDate: item.formattedDate || formatDateForChart(item.date),
      price: Number(item.price),
    }));
};

// API 데이터를 PriceData로 변환
const transformApiData = (
  data: FuelPrice[]
): Record<FuelProductCode, PriceData[]> => {
  const result: Record<string, PriceData[]> = {};

  AVAILABLE_FUEL_ORDER.forEach((fuelCode) => {
    const fuelPrices = data
      .filter((d) => d.PRODCD === fuelCode && d.TRADE_DT)
      .map((d) => {
        const dateStr = d.TRADE_DT!;
        const isoDate =
          dateStr.length === 8
            ? dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
            : dateStr;

        return {
          date: dateStr,
          fuelCode: d.PRODCD || '',
          fuelType: FUEL_NAMES[d.PRODCD as FuelProductCode] || d.PRODCD || '',
          price: d.PRICE || 0,
          formattedDate: new Date(isoDate).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
          }),
        };
      });

    if (fuelPrices.length > 0) {
      result[fuelCode] = fuelPrices;
    }
  });

  return result as Record<FuelProductCode, PriceData[]>;
};

// ==============================================================================
// UI 컴포넌트들
// ==============================================================================

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">가격 추이 데이터를 불러오는 중...</p>
    </div>
  </div>
);

const EmptyDataState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">
        표시할 가격 추이 데이터가 없습니다.
      </p>
    </div>
  </div>
);

// ==============================================================================
// 연료 선택기 컴포넌트들
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
  const config = FUEL_UI_CONFIG[fuelCode];
  const IconComponent = getFuelIcon(fuelCode);

  const getGradientClasses = () => {
    if (config.color.includes('green')) return 'from-green-500 to-emerald-500';
    if (config.color.includes('yellow')) return 'from-yellow-400 to-orange-500';
    if (config.color.includes('blue')) return 'from-blue-400 to-cyan-500';
    if (config.color.includes('slate')) return 'from-slate-400 to-slate-600';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <button
      onClick={() => onClick(fuelCode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div
        className={`p-1.5 rounded-md bg-gradient-to-r ${
          isSelected ? getGradientClasses() : 'bg-muted'
        } ${isSelected ? 'text-white' : 'text-muted-foreground'}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
      </div>
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          isSelected ? config.color : 'text-muted-foreground'
        }`}
      >
        {config.name}
      </span>
    </button>
  );
};

interface FuelSelectorSectionProps {
  availableFuels: FuelProductCode[];
  selectedFuel: FuelProductCode;
  onFuelSelect: (fuel: FuelProductCode) => void;
}

const FuelSelectorSection: React.FC<FuelSelectorSectionProps> = ({
  availableFuels,
  selectedFuel,
  onFuelSelect,
}) => (
  <div className="flex items-center gap-3 mb-6 flex-wrap">
    {availableFuels.map((fuelCode) => (
      <FuelSelectorButton
        key={fuelCode}
        fuelCode={fuelCode}
        isSelected={selectedFuel === fuelCode}
        onClick={onFuelSelect}
      />
    ))}
  </div>
);

// ==============================================================================
// 가격 통계 컴포넌트들
// ==============================================================================

interface PriceStatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const PriceStatCard: React.FC<PriceStatCardProps> = ({
  label,
  value,
  trend,
  className = '',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <p className={`text-lg font-semibold ${getTrendColor()}`}>{value}</p>
      </div>
    </div>
  );
};

interface PriceStatisticsGridProps {
  statistics: PriceStatistics;
}

const PriceStatisticsGrid: React.FC<PriceStatisticsGridProps> = ({
  statistics,
}) => {
  const getTrend = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
      <PriceStatCard
        label="최신 가격"
        value={formatPrice(statistics.current)}
      />
      <PriceStatCard
        label="가격 변화"
        value={`${statistics.change > 0 ? '+' : ''}${formatPrice(
          statistics.change
        )} (${
          statistics.changePercent > 0 ? '+' : ''
        }${statistics.changePercent.toFixed(2)}%)`}
        trend={getTrend(statistics.change)}
      />
      <PriceStatCard label="최고가" value={formatPrice(statistics.max)} />
      <PriceStatCard label="최저가" value={formatPrice(statistics.min)} />
    </div>
  );
};

// ==============================================================================
// 차트 컴포넌트들
// ==============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedFuel: FuelProductCode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  selectedFuel,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const config = FUEL_UI_CONFIG[selectedFuel];
  const IconComponent = getFuelIcon(selectedFuel);

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded ${config.bgColor} text-white`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <span className={`text-sm font-bold ${config.color}`}>
          {config.name}:
        </span>
        <span className="text-sm font-bold text-foreground">
          {formatPrice(payload[0].value)}
        </span>
      </div>
    </div>
  );
};

interface PriceTrendChartProps {
  data: PriceData[];
  priceRange: { min: number; max: number };
  selectedFuel: FuelProductCode;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  data,
  priceRange,
  selectedFuel,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            선택한 연료의 데이터가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  // 연료별 CSS 변수 매핑
  const getChartColorVar = (fuelCode: FuelProductCode) => {
    switch (fuelCode) {
      case FUEL_CODES.PREMIUM_GASOLINE:
        return 'var(--chart-fuel-premium)';
      case FUEL_CODES.GASOLINE:
        return 'var(--chart-fuel-gasoline)';
      case FUEL_CODES.DIESEL:
        return 'var(--chart-fuel-diesel)';
      case FUEL_CODES.KEROSENE:
        return 'var(--chart-fuel-kerosene)';
      default:
        return 'var(--chart-1)';
    }
  };

  const chartColor = getChartColorVar(selectedFuel);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient
              id={`gradient-${selectedFuel}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="formattedDate"
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[priceRange.min * 0.99, priceRange.max * 1.01]}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.round(value)}원`}
          />
          <Tooltip content={<CustomTooltip selectedFuel={selectedFuel} />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={3}
            fill={`url(#gradient-${selectedFuel})`}
            dot={{
              fill: chartColor,
              strokeWidth: 2,
              stroke: 'var(--background)',
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: chartColor,
              strokeWidth: 2,
              fill: 'var(--background)',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PriceTrendChartSectionProps {
  prices: PriceData[];
  priceRange: { min: number; max: number };
  selectedFuel: FuelProductCode;
}

const PriceTrendChartSection: React.FC<PriceTrendChartSectionProps> = ({
  prices,
  priceRange,
  selectedFuel,
}) => {
  const chartData = useMemo(() => transformChartData(prices), [prices]);
  const statistics = useMemo(() => calculatePriceStatistics(prices), [prices]);

  return (
    <div className="space-y-6">
      <PriceTrendChart
        data={chartData}
        priceRange={priceRange}
        selectedFuel={selectedFuel}
      />
      <PriceStatisticsGrid statistics={statistics} />
    </div>
  );
};

// ==============================================================================
// 메인 컴포넌트
// ==============================================================================

interface MonthlyPriceTrendChartProps {
  showTitle?: boolean;
  showDatePicker?: boolean;
  areaCode?: string;
}

export const MonthlyPriceTrendChart: React.FC<MonthlyPriceTrendChartProps> = ({
  showTitle = true,
  showDatePicker = true,
  areaCode = JEJU_SIDO_CODE,
}) => {
  const { getMonthlyAvgPrices } = useVehicles();
  const {
    canSearch,
    remainingSearches,
    totalLimit,
    incrementSearchCount,
    isAuthenticated,
  } = useSearchLimit();

  const [selectedFuel, setSelectedFuel] = useState<FuelProductCode>(
    FUEL_CODES.GASOLINE
  );

  // 독립적인 날짜 범위 상태
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // 로컬 데이터 상태
  const [rawMonthlyData, setRawMonthlyData] = useState<FuelPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩 함수 - shouldCountSearch 인자로 카운트 여부 결정
  const loadData = async (shouldCountSearch = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const baseDate = formatDateToApi(dateRange.to);
      const res = await getMonthlyAvgPrices({ areaCode, baseDate });

      if (res.success && res.data) {
        setRawMonthlyData(res.data.data ?? []);
        // 데이터 로딩 성공 시 횟수 증가 (비회원만)
        // incrementSearchCount();
        // 명시적으로 카운트해야 할 때만 증가 (사용자가 날짜를 변경했을 때)
        if (shouldCountSearch && !isAuthenticated) {
          incrementSearchCount();
        }
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('MonthlyPriceTrendChart 데이터 로딩 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // dateRange.to 변경 시에만 API 재호출
  const previousToRef = useRef<string>(formatDateToApi(dateRange.to));
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentTo = formatDateToApi(dateRange.to);
    if (isInitialMount.current) {
      // 초기 로딩 시에는 카운트하지 않음
      isInitialMount.current = false;
      if (rawMonthlyData.length === 0) {
        loadData(false);
      }
    } else if (previousToRef.current !== currentTo) {
      // 사용자가 날짜를 변경했을 때만 카운트
      previousToRef.current = currentTo;
      loadData(true);
    }
  }, [dateRange.to]);

  // API 데이터를 PriceData 형식으로 변환
  const pricesByFuel = useMemo(() => {
    return transformApiData(rawMonthlyData);
  }, [rawMonthlyData]);

  // dateRange로 필터링된 데이터
  const filteredPrices = useMemo(() => {
    const prices = pricesByFuel[selectedFuel] || [];
    if (prices.length === 0) return [];

    const fromTime = dateRange.from.getTime();
    const toTime = dateRange.to.getTime();

    return prices.filter((item) => {
      const itemDate = parseDateString(item.date);
      const itemTime = itemDate.getTime();
      return itemTime >= fromTime && itemTime <= toTime;
    });
  }, [pricesByFuel, selectedFuel, dateRange]);

  // 취급 품목만 필터링
  const availableFuels = useMemo(() => {
    return AVAILABLE_FUEL_ORDER.filter((fuelCode) => {
      const prices = pricesByFuel[fuelCode];
      return Array.isArray(prices) && prices.length > 0;
    });
  }, [pricesByFuel]);

  // 가격 범위 계산
  const priceRange = useMemo(
    () => calculatePriceRange(filteredPrices),
    [filteredPrices]
  );

  // 유효한 선택된 연료 계산
  const effectiveSelectedFuel = useMemo(() => {
    return availableFuels.includes(selectedFuel)
      ? selectedFuel
      : availableFuels[0] || FUEL_CODES.GASOLINE;
  }, [selectedFuel, availableFuels]);

  // 연료 선택 핸들러
  const handleFuelSelect = useCallback((fuelCode: FuelProductCode) => {
    setSelectedFuel(fuelCode);
  }, []);

  // 선택된 연료 동기화
  useEffect(() => {
    if (effectiveSelectedFuel !== selectedFuel && availableFuels.length > 0) {
      setSelectedFuel(effectiveSelectedFuel);
    }
  }, [effectiveSelectedFuel, selectedFuel, availableFuels.length]);

  const hasData = rawMonthlyData.length > 0;
  // 검색 제한에 도달했는지
  const isLimitReached = !isAuthenticated && !canSearch;

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-foreground text-xl lg:text-2xl font-semibold text-left">
            최근 한 달간 가격 추이
          </h3>
          {showDatePicker && !isLimitReached && (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              maxDays={31}
            />
          )}
        </div>
      )}

      <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative">
        {/* 비회원 검색 제한 배너 */}
        {!isAuthenticated && (
          <SearchLimitBanner
            remainingSearches={remainingSearches}
            totalLimit={totalLimit}
            isLimitReached={isLimitReached}
          />
        )}

        {/* 검색 제한 도달 시 차트 UI 비활성화 */}
        {isLimitReached ? null : (
          <>
            {isLoading && hasData && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-xl">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {isLoading && !hasData ? (
              <LoadingState />
            ) : error && !hasData ? (
              <EmptyDataState />
            ) : !hasData ? (
              <EmptyDataState />
            ) : (
              <>
                <FuelSelectorSection
                  availableFuels={availableFuels}
                  selectedFuel={effectiveSelectedFuel}
                  onFuelSelect={handleFuelSelect}
                />

                <PriceTrendChartSection
                  prices={filteredPrices}
                  priceRange={priceRange}
                  selectedFuel={effectiveSelectedFuel}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
