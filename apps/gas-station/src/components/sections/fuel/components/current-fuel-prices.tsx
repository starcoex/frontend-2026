import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  ProcessedPriceData,
  formatPercentChange,
  formatPrice,
  formatPriceChange,
  getTrendColor,
  getTrendIcon,
} from '@starcoex-frontend/vehicles';
import { Button } from '@/components/ui/button';

// ==============================================================================
// 타입 정의
// ==============================================================================

interface CurrentFuelPricesProps {
  processedPrices: ProcessedPriceData[]; // ✅ [수정] 유틸리티에서 정의된 타입 사용
  onViewDetails: () => void;
  showTitle?: boolean;
}

// ==============================================================================
// 서브 컴포넌트들
// ==============================================================================

interface SectionHeaderProps {
  onViewDetails: () => void;
  show: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  onViewDetails,
  show,
}) => {
  if (!show) return null;
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-foreground text-xl lg:text-2xl font-semibold text-left">
        현재 유가 정보
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewDetails}
        className="text-primary hover:text-primary/80"
      >
        전체 보기 <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

interface PriceTrendIndicatorProps {
  change: number;
}

const PriceTrendIndicator: React.FC<PriceTrendIndicatorProps> = ({
  change,
}) => (
  <div className="flex items-center gap-1">
    {getTrendIcon(change)}
    <span className={`text-xs font-semibold ${getTrendColor(change)}`}>
      {formatPriceChange(change)}
    </span>
  </div>
);

interface FuelIconProps {
  icon: React.ReactElement;
  gradient: string;
}

const FuelIcon: React.FC<FuelIconProps> = ({ icon, gradient }) => (
  <div
    className={`p-2 rounded-lg bg-gradient-to-r ${gradient} group-hover:scale-110 transition-transform duration-300`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, {
      className: 'w-5 h-5 text-white',
    })}
  </div>
);

interface FuelInfoSectionProps {
  fuelType: string;
  description: string;
  textColor: string; // ✅ 추가
}

const FuelInfoSection: React.FC<FuelInfoSectionProps> = ({
  fuelType,
  description,
  textColor, // ✅ 추가
}) => (
  <div className="mb-3">
    <h4 className={`text-sm font-bold ${textColor} mb-1`}>{fuelType}</h4>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

interface PriceDisplaySectionProps {
  hasData: boolean;
  currentPrice: number;
  changePercent: number;
}

const PriceDisplaySection: React.FC<PriceDisplaySectionProps> = ({
  hasData,
  currentPrice,
  changePercent,
}) => {
  if (!hasData) {
    return (
      <div className="text-center">
        <div className="text-sm text-muted-foreground">데이터 없음</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-lg font-bold text-foreground mb-1">
        {formatPrice(currentPrice)}
      </div>
      <div className="flex items-center justify-center gap-1 text-xs">
        <span className={`font-medium ${getTrendColor(changePercent)}`}>
          {formatPercentChange(changePercent)}
        </span>
      </div>
    </div>
  );
};

interface FuelPriceCardProps {
  priceData: ProcessedPriceData;
}

const FuelPriceCard: React.FC<FuelPriceCardProps> = ({ priceData }) => (
  <div className="group relative bg-background rounded-xl p-4 border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${priceData.gradient} opacity-0 group-hover:opacity-[0.03] rounded-xl transition-opacity duration-300`}
    />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <FuelIcon icon={priceData.icon} gradient={priceData.gradient} />
        {priceData.hasData && <PriceTrendIndicator change={priceData.change} />}
      </div>

      <FuelInfoSection
        fuelType={priceData.fuelType}
        description={priceData.description}
        textColor={priceData.textColor}
      />
      <PriceDisplaySection
        hasData={priceData.hasData}
        currentPrice={priceData.currentPrice}
        changePercent={priceData.changePercent}
      />
    </div>
  </div>
);

interface PriceCardGridProps {
  processedPrices: ProcessedPriceData[];
}

const PriceCardGrid: React.FC<PriceCardGridProps> = ({ processedPrices }) => (
  <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
    {processedPrices.map((priceData) => (
      <FuelPriceCard key={priceData.id} priceData={priceData} />
    ))}
  </div>
);

interface EmptyStateProps {
  onViewDetails: () => void;
  showTitle: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onViewDetails,
  showTitle,
}) => (
  <div>
    <SectionHeader onViewDetails={onViewDetails} show={showTitle} />
    <div className="text-center py-8 text-muted-foreground">
      표시할 가격 정보가 없습니다.
    </div>
  </div>
);

// ==============================================================================
// 메인 컴포넌트
// ==============================================================================

export const CurrentFuelPrices: React.FC<CurrentFuelPricesProps> = ({
  processedPrices,
  onViewDetails,
  showTitle = true,
}) => {
  if (!processedPrices || processedPrices.length === 0) {
    return <EmptyState onViewDetails={onViewDetails} showTitle={showTitle} />;
  }

  return (
    <div>
      <SectionHeader onViewDetails={onViewDetails} show={showTitle} />
      <PriceCardGrid processedPrices={processedPrices} />
    </div>
  );
};
