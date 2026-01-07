import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FuelPricesSectionHeaderProps {
  lastUpdated?: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const FuelPricesSectionHeader: React.FC<
  FuelPricesSectionHeaderProps
> = ({ lastUpdated, isLoading, onRefresh }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
      {/* 좌측: 타이틀 및 설명 */}
      <div className="text-left">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          제주도 <span className="text-primary">실시간 유가</span>
        </h2>
        <p className="text-neutral-400 text-lg max-w-2xl">
          오피넷 공공데이터를 기반으로 제주도 평균 유가와
          <br className="hidden sm:block" />
          별표주유소의 실시간 가격을 확인하세요.
        </p>
      </div>

      {/* 우측: 업데이트 시간 및 새로고침 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>업데이트: {lastUpdated || '로딩 중...'}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
