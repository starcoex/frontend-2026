import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Car,
  Droplets,
  ShoppingCart,
  Award,
  Wrench,
  RefreshCw,
  AlertCircle,
  Star,
  Navigation,
  Zap,
  Truck,
  Fuel,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  formatPrice,
  FUEL_CODES,
  FUEL_UI_CONFIG,
  useFuelData,
} from '@starcoex-frontend/vehicles';

interface StationDetailProps {
  className?: string;
  stationId?: string | null; // 특정 주유소 ID (없으면 별표주유소 표시)
}

// 연료별 아이콘 반환
const getFuelIcon = (productCode: string) => {
  switch (productCode) {
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

// 전화 지원 여부 확인
const supportsTelephone = (): boolean => {
  return typeof window !== 'undefined' && 'ontouchstart' in window;
};

// 편의시설 정보
const FACILITIES = [
  { key: 'CAR_WASH_YN', name: '세차장', icon: Droplets },
  { key: 'CVS_YN', name: '편의점', icon: ShoppingCart },
  { key: 'MAINT_YN', name: '경정비', icon: Wrench },
  { key: 'KPETRO_YN', name: '품질인증', icon: Award },
];

export const StationDetail: React.FC<StationDetailProps> = ({
  className = '',
  stationId,
}) => {
  const {
    starStationDetail,
    searchedStationDetail,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    fetchStationDetail,
  } = useFuelData();

  // stationId가 있으면 해당 주유소, 없으면 별표주유소 표시
  const stationDetail = stationId ? searchedStationDetail : starStationDetail;

  // stationId 변경 시 해당 주유소 정보 로드
  React.useEffect(() => {
    if (stationId) {
      fetchStationDetail(stationId);
    }
  }, [stationId, fetchStationDetail]);

  if (isLoading && !stationDetail) {
    return (
      <div
        className={`bg-background rounded-xl border border-border p-8 ${className}`}
      >
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
            <div className="grid gap-4 md:grid-cols-2 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !stationDetail) {
    return (
      <div
        className={`bg-background rounded-xl border border-border p-8 ${className}`}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            주유소 정보 로드 실패
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

  if (!stationDetail) {
    return (
      <div
        className={`bg-background rounded-xl border border-border p-8 ${className}`}
      >
        <div className="text-center text-muted-foreground">
          주유소 정보가 없습니다.
        </div>
      </div>
    );
  }

  const stationName = stationDetail.OS_NM || '주유소';
  const newAddress = stationDetail.NEW_ADR;
  const oldAddress = stationDetail.VAN_ADR;
  const phoneNumber = stationDetail.TEL;
  const oilPrices = stationDetail.OIL_PRICE || [];
  const hasLocation =
    stationDetail.GIS_X_COOR !== 0 || stationDetail.GIS_Y_COOR !== 0;

  // 별표주유소인지 확인 (stationId가 없으면 별표주유소)
  const isStarStation = !stationId;

  return (
    <div
      className={`bg-background rounded-xl border border-border overflow-hidden ${className}`}
    >
      {/* 헤더 */}
      <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                isStarStation ? 'bg-yellow-500/10' : 'bg-primary/10'
              }`}
            >
              {isStarStation ? (
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              ) : (
                <Fuel className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {stationName}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-primary/10 rounded text-primary font-medium">
                  {stationDetail.POLL_DIV_CD || '주유소'}
                </span>
                <span className="hidden md:inline">
                  ID: {stationDetail.UNI_ID}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="hidden md:flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span>마지막 업데이트</span>
            </div>
            <div className="font-medium hidden md:block">
              {lastUpdated || '로딩 중...'}
            </div>
            <Button
              onClick={refreshData}
              variant="ghost"
              size="sm"
              className="mt-2"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              기본 정보
            </h3>

            {/* 주소 */}
            <div className="space-y-3">
              {newAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-foreground mb-1">
                      도로명주소
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {newAddress}
                    </div>
                  </div>
                </div>
              )}

              {oldAddress && oldAddress !== newAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-foreground mb-1">
                      지번주소
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {oldAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 전화번호 */}
            {phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-foreground mb-1">
                    전화번호
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {phoneNumber}
                  </div>
                </div>
              </div>
            )}

            {/* 편의시설 */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                편의시설
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {FACILITIES.map((facility) => {
                  const available =
                    stationDetail[
                      facility.key as keyof typeof stationDetail
                    ] === 'Y';
                  const Icon = facility.icon;

                  return (
                    <div
                      key={facility.key}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        available
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-50 dark:bg-gray-950/30 text-gray-500'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          available ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {facility.name}
                        </div>
                        <div className="text-xs">
                          {available ? '이용가능' : '미운영'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 연료 가격 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              연료 가격
            </h3>

            {oilPrices.length > 0 ? (
              <div className="space-y-3">
                {oilPrices.map((fuel) => {
                  const config = FUEL_UI_CONFIG[fuel.PRODCD] || {
                    name: fuel.PRODNM,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-500',
                  };

                  return (
                    <div
                      key={fuel.PRODCD}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md ${config.bgColor} text-white`}
                        >
                          {getFuelIcon(fuel.PRODCD)}
                        </div>
                        <div>
                          <div className={`font-medium ${config.color}`}>
                            {config.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            리터당
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${config.color}`}>
                          {formatPrice(fuel.PRICE)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                가격 정보가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 위치 및 길찾기 */}
        {hasLocation && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              위치 및 길찾기
            </h3>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={() => {
                  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
                    stationName
                  )}`;
                  window.open(naverMapUrl, '_blank');
                }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                네이버맵에서 보기
              </Button>

              {phoneNumber && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={
                          !supportsTelephone()
                            ? 'opacity-60 cursor-not-allowed'
                            : ''
                        }
                        onClick={() => {
                          if (supportsTelephone()) {
                            window.location.href = `tel:${phoneNumber}`;
                          }
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        전화걸기
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {supportsTelephone()
                        ? `${phoneNumber}로 전화걸기`
                        : '모바일에서 이용 가능합니다'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
