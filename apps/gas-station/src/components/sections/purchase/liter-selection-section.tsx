import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Droplets } from 'lucide-react';

interface LiterSelectionSectionProps {
  liter: number;
  onLiterChange: (liter: number) => void;
  minLiter: number;
  maxLiter: number;
  step: number;
  options: (number | 'full')[];
  fullAmount?: number;
  isKerosene: boolean;
  isMinimumOrder: boolean;
}

export const LiterSelectionSection: React.FC<LiterSelectionSectionProps> = ({
  liter,
  onLiterChange,
  minLiter,
  maxLiter,
  step,
  options,
  fullAmount = 1000,
  isKerosene,
  isMinimumOrder,
}) => {
  // 버튼 클릭 핸들러
  const handleOptionClick = (option: number | 'full') => {
    if (option === 'full') {
      onLiterChange(fullAmount);
    } else {
      onLiterChange(option);
    }
  };

  // 현재 선택이 해당 옵션인지 확인
  const isOptionSelected = (option: number | 'full') => {
    if (option === 'full') {
      return liter === fullAmount;
    }
    return liter === option;
  };

  // 옵션 라벨 표시
  const getOptionLabel = (option: number | 'full') => {
    if (option === 'full') {
      return '가득';
    }
    return `${option}L`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        2. {isKerosene ? '배달량 선택' : '주유량 선택'}
      </h2>
      <div className="bg-muted/10 p-6 rounded-xl border border-border">
        {/* 현재 선택량 표시 */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium flex items-center gap-2">
            {isKerosene ? (
              <>
                <Truck className="w-4 h-4" />
                배달량
              </>
            ) : (
              <>
                <Droplets className="w-4 h-4" />
                주유량
              </>
            )}
          </span>
          <span className="text-2xl font-bold text-primary">{liter}L</span>
        </div>

        {/* 슬라이더 - 섬세한 조절 가능 */}
        <div className="space-y-2 mb-6">
          <input
            type="range"
            min={minLiter}
            max={maxLiter}
            step={step}
            value={liter}
            onChange={(e) => onLiterChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minLiter}L</span>
            {isKerosene && (
              <span className="text-primary font-medium">세밀 조절 가능</span>
            )}
            <span>{maxLiter}L</span>
          </div>
        </div>

        {/* 빠른 선택 버튼 */}
        <div
          className={`grid gap-2 ${isKerosene ? 'grid-cols-6' : 'grid-cols-4'}`}
        >
          {options.map((option) => (
            <Button
              key={option}
              variant={isOptionSelected(option) ? 'default' : 'secondary'}
              onClick={() => handleOptionClick(option)}
              size="sm"
              className={
                option === 'full' ? 'bg-primary/80 hover:bg-primary' : ''
              }
            >
              {getOptionLabel(option)}
            </Button>
          ))}
        </div>

        {/* 등유 안내 메시지 */}
        {isKerosene && (
          <Alert
            className="mt-4"
            variant={isMinimumOrder ? 'destructive' : 'default'}
          >
            <Truck className="h-4 w-4" />
            <AlertDescription>
              {isMinimumOrder ? (
                <>
                  <strong>배달료 10,000원이 부과됩니다.</strong>
                  <br />
                  기본 배달량은 200리터(한 드럼)입니다. 100리터 주문 시 배달료가
                  추가됩니다.
                </>
              ) : (
                <>
                  200리터 이상 주문 시 <strong>배달료 무료!</strong>
                  <br />
                  제주시/서귀포시 전 지역 배달 가능합니다.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
