import React from 'react';
import { Loader2 } from 'lucide-react';
import type { FuelType } from '@/app/pages/purchase/purchase-page';

interface FuelSelectionSectionProps {
  fuelTypes: FuelType[];
  selectedFuel: FuelType | null;
  onFuelSelect: (fuel: FuelType) => void;
  isLoading: boolean;
}

export const FuelSelectionSection: React.FC<FuelSelectionSectionProps> = ({
  fuelTypes,
  selectedFuel,
  onFuelSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">1. 연료 선택</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            연료 정보를 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  if (fuelTypes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">1. 연료 선택</h2>
        <div className="p-8 text-center text-muted-foreground border rounded-xl">
          연료 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">1. 연료 선택</h2>
      <div className="grid gap-3">
        {fuelTypes.map((fuel) => (
          <div
            key={fuel.id}
            onClick={() => onFuelSelect(fuel)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              selectedFuel?.id === fuel.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${fuel.bg} ${fuel.color}`}>
                <fuel.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">{fuel.name}</div>
                <div className="text-xs text-muted-foreground">{fuel.desc}</div>
              </div>
            </div>
            <div className="font-bold text-lg">
              {fuel.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
