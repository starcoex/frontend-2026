import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Droplets, Banknote, Fuel } from 'lucide-react';
import { QuantityMode } from '@/app/pages/purchase/purchase-page';

interface FuelConfig {
  MIN_LITER: number;
  MAX_LITER: number;
  STEP_LITER: number;
  LITER_OPTIONS: (number | 'full')[];
  MIN_AMOUNT: number;
  MAX_AMOUNT: number;
  STEP_AMOUNT: number;
  AMOUNT_OPTIONS: (number | 'full')[];
  FULL_LITER: number;
  FULL_AMOUNT: number;
}

interface QuantitySelectionSectionProps {
  quantityMode: QuantityMode;
  onModeChange: (mode: QuantityMode) => void;
  liter: number;
  amount: number;
  onQuantityChange: (value: number, mode: QuantityMode) => void;
  onFullTankSelect: () => void;
  isFullTank: boolean;
  fuelConfig: FuelConfig;
  fuelPrice: number;
  isKerosene: boolean;
  isMinimumOrder: boolean;
}

export const QuantitySelectionSection: React.FC<
  QuantitySelectionSectionProps
> = ({
  quantityMode,
  onModeChange,
  liter,
  amount,
  onQuantityChange,
  onFullTankSelect,
  isFullTank,
  fuelConfig,
  fuelPrice,
  isKerosene,
  isMinimumOrder,
}) => {
  // 현재 값 가져오기
  const currentValue = quantityMode === 'liter' ? liter : amount;
  const minValue =
    quantityMode === 'liter' ? fuelConfig.MIN_LITER : fuelConfig.MIN_AMOUNT;
  const maxValue =
    quantityMode === 'liter' ? fuelConfig.MAX_LITER : fuelConfig.MAX_AMOUNT;
  const step =
    quantityMode === 'liter' ? fuelConfig.STEP_LITER : fuelConfig.STEP_AMOUNT;
  const options =
    quantityMode === 'liter'
      ? fuelConfig.LITER_OPTIONS
      : fuelConfig.AMOUNT_OPTIONS;

  // 예상 값 계산
  const estimatedLiter =
    quantityMode === 'amount' && fuelPrice > 0
      ? Math.floor((amount / fuelPrice) * 10) / 10
      : liter;
  const estimatedAmount =
    quantityMode === 'liter' && fuelPrice > 0
      ? Math.round(liter * fuelPrice)
      : amount;

  // 버튼 클릭 핸들러
  const handleOptionClick = (option: number | 'full') => {
    if (option === 'full') {
      onFullTankSelect();
    } else {
      onQuantityChange(option, quantityMode);
    }
  };

  // 현재 선택 확인
  const isOptionSelected = (option: number | 'full') => {
    if (option === 'full') {
      return isFullTank;
    }
    if (isFullTank) return false;
    return currentValue === option;
  };

  // 옵션 라벨
  const getOptionLabel = (option: number | 'full') => {
    if (option === 'full') {
      return '가득';
    }
    if (quantityMode === 'liter') {
      return `${option}L`;
    }
    return `${(option / 10000).toFixed(0)}만`;
  };

  // 현재 표시 값
  const getDisplayValue = () => {
    if (isFullTank) {
      return quantityMode === 'liter'
        ? `${fuelConfig.FULL_LITER}L (가득)`
        : `${(fuelConfig.FULL_AMOUNT / 10000).toFixed(0)}만원 (가득)`;
    }
    return quantityMode === 'liter'
      ? `${liter}L`
      : `${amount.toLocaleString()}원`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        2. {isKerosene ? '배달량 선택' : '주유량 선택'}
      </h2>

      <div className="bg-muted/10 p-6 rounded-xl border border-border space-y-6">
        {/* 모드 선택 탭 */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={quantityMode === 'amount' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => onModeChange('amount')}
          >
            <Banknote className="w-4 h-4 mr-2" />
            금액
          </Button>
          <Button
            variant={quantityMode === 'liter' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => onModeChange('liter')}
          >
            <Droplets className="w-4 h-4 mr-2" />
            리터
          </Button>
        </div>

        {/* 현재 선택량 표시 */}
        <div className="text-center py-4 bg-primary/5 rounded-lg">
          <div className="text-3xl font-bold text-primary">
            {getDisplayValue()}
          </div>
          {!isFullTank && (
            <div className="text-sm text-muted-foreground mt-1">
              {quantityMode === 'liter'
                ? `약 ${estimatedAmount.toLocaleString()}원`
                : `약 ${estimatedLiter}L`}
            </div>
          )}
          {isFullTank && (
            <div className="text-sm text-muted-foreground mt-1">
              부족 시 현장 추가결제 / 남으면 부분취소
            </div>
          )}
        </div>

        {/* 슬라이더 */}
        {!isFullTank && (
          <div className="space-y-2">
            <input
              type="range"
              min={minValue}
              max={maxValue}
              step={step}
              value={currentValue}
              onChange={(e) =>
                onQuantityChange(Number(e.target.value), quantityMode)
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {quantityMode === 'liter'
                  ? `${minValue}L`
                  : `${(minValue / 10000).toFixed(0)}만원`}
              </span>
              <span className="text-primary font-medium">세밀 조절 가능</span>
              <span>
                {quantityMode === 'liter'
                  ? `${maxValue}L`
                  : `${(maxValue / 10000).toFixed(0)}만원`}
              </span>
            </div>
          </div>
        )}

        {/* 빠른 선택 버튼 */}
        <div className="grid grid-cols-6 gap-2">
          {options.map((option) => (
            <Button
              key={String(option)}
              variant={isOptionSelected(option) ? 'default' : 'secondary'}
              onClick={() => handleOptionClick(option)}
              size="sm"
              className={`${
                option === 'full'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              } ${isOptionSelected(option) && option !== 'full' ? '' : ''}`}
            >
              {getOptionLabel(option)}
            </Button>
          ))}
        </div>

        {/* 가득 안내 */}
        {isFullTank && (
          <Alert>
            <Fuel className="h-4 w-4" />
            <AlertDescription>
              <strong>가득 결제 안내</strong>
              <br />
              {isKerosene ? (
                <>
                  50만원 선결제 후, 실제 배달량에 따라 정산됩니다.
                  <br />
                  부족 시 현장에서 추가 결제, 남으면 부분 취소됩니다.
                </>
              ) : (
                <>
                  15만원 선결제 후, 실제 주유량에 따라 정산됩니다.
                  <br />
                  부족 시 현장에서 추가 결제, 남으면 부분 취소됩니다.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* 등유 배달료 안내 */}
        {isKerosene && !isFullTank && (
          <Alert variant={isMinimumOrder ? 'destructive' : 'default'}>
            <Truck className="h-4 w-4" />
            <AlertDescription>
              {isMinimumOrder ? (
                <>
                  <strong>배달료 10,000원이 부과됩니다.</strong>
                  <br />
                  기본 배달량은 200리터(한 드럼)입니다.
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
