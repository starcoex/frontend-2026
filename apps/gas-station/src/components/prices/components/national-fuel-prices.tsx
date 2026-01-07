import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FuelPrice } from '@starcoex-frontend/graphql';
import {
  useFuelData,
  formatPrice,
  FUEL_NAMES,
  FuelProductCode,
  FUEL_ORDER,
} from '@starcoex-frontend/vehicles';

// ==============================================================================
// 상수 정의
// ==============================================================================

// LPG 제외한 연료 순서
const AVAILABLE_FUEL_ORDER: FuelProductCode[] = FUEL_ORDER.filter(
  (code) => code !== 'K015'
);

const FUEL_COLORS: Record<
  FuelProductCode,
  { bg: string; border: string; light: string }
> = {
  B034: {
    bg: 'bg-green-500',
    border: 'border-green-200 dark:border-green-800',
    light: 'bg-green-50 dark:bg-green-950/30',
  },
  B027: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-200 dark:border-yellow-800',
    light: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
  D047: {
    bg: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
    light: 'bg-blue-50 dark:bg-blue-950/30',
  },
  C004: {
    bg: 'bg-slate-500',
    border: 'border-slate-200 dark:border-slate-700',
    light: 'bg-slate-50 dark:bg-slate-900/30',
  },
  K015: {
    bg: 'bg-purple-500',
    border: 'border-purple-200 dark:border-purple-800',
    light: 'bg-purple-50 dark:bg-purple-950/30',
  },
};

// ==============================================================================
// 타입 정의
// ==============================================================================

interface ProcessedRegionData {
  regionName: string;
  regionCode: string;
  prices: Record<FuelProductCode, { price: number; diff: number }>;
}

interface FuelStatistics {
  fuelCode: FuelProductCode;
  fuelName: string;
  minPrice: number;
  maxPrice: number;
  minRegion: string;
  maxRegion: string;
  avgChange: number;
}

// ==============================================================================
// 유틸리티 함수
// ==============================================================================

const getTrendColor = (change: number): string => {
  if (change > 0) return 'text-red-500';
  if (change < 0) return 'text-green-500';
  return 'text-gray-500';
};

const getTrendIcon = (change: number) => {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '-';
};

const processRegionData = (prices: FuelPrice[]): ProcessedRegionData[] => {
  const regionMap = new Map<string, ProcessedRegionData>();

  prices.forEach((price) => {
    const regionCode = price.AREA_CD || '';
    const regionName = price.AREA_NM || '';
    const fuelCode = price.PRODCD as FuelProductCode;

    if (!regionCode || !fuelCode) return;

    if (!regionMap.has(regionCode)) {
      regionMap.set(regionCode, {
        regionName,
        regionCode,
        prices: {} as Record<FuelProductCode, { price: number; diff: number }>,
      });
    }

    const region = regionMap.get(regionCode)!;
    region.prices[fuelCode] = {
      price: price.PRICE || 0,
      diff: price.DIFF || 0,
    };
  });

  return Array.from(regionMap.values());
};

const calculateStatistics = (data: ProcessedRegionData[]): FuelStatistics[] => {
  const stats: Record<string, FuelStatistics> = {};

  data.forEach((region) => {
    AVAILABLE_FUEL_ORDER.forEach((fuelCode) => {
      const priceData = region.prices[fuelCode];
      if (!priceData) return;

      if (!stats[fuelCode]) {
        stats[fuelCode] = {
          fuelCode,
          fuelName: FUEL_NAMES[fuelCode] || fuelCode,
          minPrice: priceData.price,
          maxPrice: priceData.price,
          minRegion: region.regionName,
          maxRegion: region.regionName,
          avgChange: priceData.diff,
        };
      } else {
        const stat = stats[fuelCode];
        if (priceData.price < stat.minPrice) {
          stat.minPrice = priceData.price;
          stat.minRegion = region.regionName;
        }
        if (priceData.price > stat.maxPrice) {
          stat.maxPrice = priceData.price;
          stat.maxRegion = region.regionName;
        }
      }
    });
  });

  return AVAILABLE_FUEL_ORDER.map((code) => stats[code]).filter(Boolean);
};

// ==============================================================================
// UI 컴포넌트들
// ==============================================================================

const LoadingState: React.FC = () => (
  <div className="bg-background rounded-xl border border-border p-8">
    <div className="text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-64 mx-auto"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
      <p className="text-muted-foreground mt-4">
        연료 가격 정보를 불러오는 중...
      </p>
    </div>
  </div>
);

const FuelStatCard: React.FC<{ stat: FuelStatistics }> = ({ stat }) => {
  const colors = FUEL_COLORS[stat.fuelCode];
  if (!colors) return null;

  return (
    <div className={`p-4 rounded-lg border ${colors.border} ${colors.light}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
        <h5 className="font-medium text-foreground text-sm">{stat.fuelName}</h5>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-green-600">최저가:</span>
          <span className="font-medium">
            {formatPrice(stat.minPrice)} ({stat.minRegion})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-600">최고가:</span>
          <span className="font-medium">
            {formatPrice(stat.maxPrice)} ({stat.maxRegion})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">가격차:</span>
          <span className="font-medium">
            {formatPrice(stat.maxPrice - stat.minPrice)}
          </span>
        </div>
        {stat.avgChange !== 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">전일대비:</span>
            <span className={`font-medium ${getTrendColor(stat.avgChange)}`}>
              {stat.avgChange > 0 ? '+' : ''}
              {stat.avgChange.toFixed(1)}원
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const StatisticsSection: React.FC<{
  stats: FuelStatistics[];
  selectedRegionName: string;
}> = ({ stats, selectedRegionName }) => (
  <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
    <h4 className="text-lg font-medium text-foreground mb-4">
      {selectedRegionName} 연료별 가격 현황
    </h4>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <FuelStatCard key={stat.fuelCode} stat={stat} />
      ))}
    </div>
  </div>
);

const PriceCell: React.FC<{ priceData?: { price: number; diff: number } }> = ({
  priceData,
}) => {
  if (!priceData) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div>
      <div className="font-medium text-foreground">
        {formatPrice(priceData.price)}
      </div>
      <div
        className={`flex items-center justify-center gap-1 text-xs ${getTrendColor(
          priceData.diff
        )}`}
      >
        {getTrendIcon(priceData.diff)}
        <span>
          {priceData.diff > 0 ? '+' : ''}
          {priceData.diff.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

const FuelPricesTable: React.FC<{
  displayData: ProcessedRegionData[];
  expandedRegions: Set<string>;
  onToggleExpand: (regionCode: string) => void;
}> = ({ displayData, expandedRegions, onToggleExpand }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left p-4 font-medium">지역</TableHead>
          {AVAILABLE_FUEL_ORDER.map((fuelCode) => {
            const colors = FUEL_COLORS[fuelCode];
            return (
              <TableHead key={fuelCode} className="text-center p-4 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 ${colors?.bg} rounded-full`}></div>
                  {FUEL_NAMES[fuelCode]}
                </div>
              </TableHead>
            );
          })}
          <TableHead className="text-center p-4 font-medium">상세</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayData.map((region) => (
          <React.Fragment key={region.regionCode}>
            <TableRow className="hover:bg-muted/20 transition-colors">
              <TableCell className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="font-medium text-foreground">
                    {region.regionName}
                  </div>
                </div>
              </TableCell>
              {AVAILABLE_FUEL_ORDER.map((fuelCode) => (
                <TableCell key={fuelCode} className="p-4 text-center">
                  <PriceCell priceData={region.prices[fuelCode]} />
                </TableCell>
              ))}
              <TableCell className="p-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleExpand(region.regionCode)}
                  className="text-primary hover:text-primary/80"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedRegions.has(region.regionCode) ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </TableCell>
            </TableRow>
            {expandedRegions.has(region.regionCode) && (
              <TableRow>
                <TableCell
                  colSpan={AVAILABLE_FUEL_ORDER.length + 2}
                  className="p-4 bg-muted/10"
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {AVAILABLE_FUEL_ORDER.map((fuelCode) => {
                      const priceData = region.prices[fuelCode];
                      const colors = FUEL_COLORS[fuelCode];
                      if (!priceData || !colors) return null;

                      return (
                        <div
                          key={fuelCode}
                          className={`p-3 rounded-lg border ${colors.border} ${colors.light}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-2 h-2 rounded-full ${colors.bg}`}
                            ></div>
                            <span className="text-sm font-medium">
                              {FUEL_NAMES[fuelCode]}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-foreground">
                            {formatPrice(priceData.price)}
                          </div>
                          <div
                            className={`flex items-center gap-1 text-xs ${getTrendColor(
                              priceData.diff
                            )}`}
                          >
                            {getTrendIcon(priceData.diff)}
                            <span>
                              전일 대비 {priceData.diff > 0 ? '+' : ''}
                              {priceData.diff}원
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  </div>
);

// ==============================================================================
// 메인 컴포넌트
// ==============================================================================

export const NationalFuelPrices: React.FC = () => {
  const { sidoPrices, isLoading, lastUpdated } = useFuelData();

  // 상태
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set()
  );

  // 데이터 처리
  const processedData = useMemo(() => {
    return processRegionData(sidoPrices);
  }, [sidoPrices]);

  // 제주 지역 기본 선택
  useEffect(() => {
    if (processedData.length > 0 && selectedRegion === '') {
      const jejuRegion = processedData.find((r) =>
        r.regionName.includes('제주')
      );
      if (jejuRegion) {
        setSelectedRegion(jejuRegion.regionCode);
      }
    }
  }, [processedData, selectedRegion]);

  // 표시 데이터
  const displayData = useMemo(() => {
    if (selectedRegion === 'all') return processedData;
    return processedData.filter((r) => r.regionCode === selectedRegion);
  }, [processedData, selectedRegion]);

  // 선택된 지역 이름
  const selectedRegionName = useMemo(() => {
    if (selectedRegion === 'all') return '전국';
    const region = processedData.find((r) => r.regionCode === selectedRegion);
    return region?.regionName || '';
  }, [processedData, selectedRegion]);

  // 통계 계산
  const fuelStats = useMemo(() => {
    return calculateStatistics(displayData);
  }, [displayData]);

  // 핸들러
  const handleToggleExpand = (regionCode: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionCode)) {
      newExpanded.delete(regionCode);
    } else {
      newExpanded.add(regionCode);
    }
    setExpandedRegions(newExpanded);
  };

  const hasData = sidoPrices.length > 0;

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden relative">
      {isLoading && hasData && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {isLoading && !hasData ? (
        <LoadingState />
      ) : (
        <>
          {/* 헤더 */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  전국 시도별 주유소 가격
                </h3>
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground mt-1">
                    마지막 업데이트: {lastUpdated}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {processedData.map((region) => (
                      <SelectItem
                        key={region.regionCode}
                        value={region.regionCode}
                      >
                        {region.regionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <StatisticsSection
            stats={fuelStats}
            selectedRegionName={selectedRegionName}
          />

          <FuelPricesTable
            displayData={displayData}
            expandedRegions={expandedRegions}
            onToggleExpand={handleToggleExpand}
          />

          <div className="p-4 bg-muted/10 border-t border-border text-center text-sm text-muted-foreground">
            <p>데이터 출처: 오피넷 (opinet.co.kr)</p>
          </div>
        </>
      )}
    </div>
  );
};
