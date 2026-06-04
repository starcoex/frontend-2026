import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Car, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ── 타입 & 상수 ──────────────────────────────────────────────────────────────────

export type VehicleCategory = 'small' | 'mid' | 'large' | 'suv' | 'van';

export interface VehicleInfo {
  plateNumber: string;
  modelName: string;
  category: VehicleCategory;
  priceRate: number;
  year?: number;
}

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  small: '소형',
  mid: '중형',
  large: '대형',
  suv: 'SUV',
  van: '승합',
};

const PRICE_RATE_BADGES: Record<
  VehicleCategory,
  { label: string; className: string }
> = {
  small: {
    label: '기본 요금',
    className:
      'border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10',
  },
  mid: {
    label: '+20%',
    className:
      'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
  },
  large: {
    label: '+40%',
    className:
      'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  suv: {
    label: '+30%',
    className:
      'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
  van: {
    label: '+50%',
    className:
      'border-orange-500/40 text-orange-600 dark:text-orange-400 bg-orange-500/10',
  },
};

// ── Mock API (실제 구현 시 국토부 차량 정보 API 교체) ────────────────────────────

const mockLookupVehicle = async (plate: string): Promise<VehicleInfo> => {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    plateNumber: plate,
    modelName: '현대 아이오닉6',
    category: 'mid',
    priceRate: 1.2,
    year: 2023,
  };
};

// ── Props ────────────────────────────────────────────────────────────────────────

interface VehicleInputFormProps {
  onVehicleFound?: (vehicle: VehicleInfo) => void;
  className?: string;
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────────

export const VehicleInputForm: React.FC<VehicleInputFormProps> = ({
  onVehicleFound,
  className,
}) => {
  const [plate, setPlate] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>(
    'idle'
  );
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidPlate = plate.trim().length >= 7;

  const handleLookup = async () => {
    if (!isValidPlate) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await mockLookupVehicle(plate.trim());
      setVehicle(result);
      setStatus('found');
      onVehicleFound?.(result);
    } catch {
      setStatus('error');
      setErrorMsg('차량 정보를 찾을 수 없습니다. 번호를 확인해 주세요.');
    }
  };

  const handleReset = () => {
    setPlate('');
    setVehicle(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
    if (status === 'found' || status === 'error') {
      setStatus('idle');
      setVehicle(null);
    }
  };

  const rateBadge = vehicle ? PRICE_RATE_BADGES[vehicle.category] : null;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 스텝 헤더 */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-cyan-500/50 text-cyan-600 dark:text-cyan-400"
        >
          3
        </Badge>
        <Label
          htmlFor="plate-input"
          className="text-sm font-semibold text-foreground cursor-pointer"
        >
          차량 확인
        </Label>
      </div>

      {/* 입력 + 버튼 */}
      <div className="flex gap-2">
        <Input
          id="plate-input"
          value={plate}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          placeholder="예: 12가 3456"
          maxLength={10}
          disabled={status === 'loading'}
          className={cn(
            'flex-1 tracking-widest text-base font-medium h-11',
            status === 'found' &&
              'border-green-500 focus-visible:ring-green-500/30',
            status === 'error' &&
              'border-destructive focus-visible:ring-destructive/30'
          )}
        />
        <Button
          onClick={handleLookup}
          disabled={!isValidPlate || status === 'loading'}
          className="h-11 px-5 bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="ml-1.5 text-sm font-semibold">조회</span>
        </Button>
      </div>

      {/* 결과 영역 */}
      <AnimatePresence mode="wait">
        {status === 'found' && vehicle && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <Card className="border border-green-500/30 bg-green-500/5">
              <CardContent className="flex items-center gap-4 py-3 px-4">
                <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-sm font-bold text-foreground">
                      {vehicle.modelName}
                    </p>
                    {vehicle.year && (
                      <span className="text-xs text-muted-foreground">
                        {vehicle.year}년식
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {CATEGORY_LABELS[vehicle.category]}
                    </Badge>
                    {rateBadge && (
                      <Badge
                        variant="outline"
                        className={cn('text-xs', rateBadge.className)}
                      >
                        요금 {rateBadge.label}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="shrink-0 text-muted-foreground hover:text-foreground text-xs h-7"
                >
                  변경
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <Card className="border border-destructive/30 bg-destructive/5">
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{errorMsg}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === 'idle' && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground px-1"
          >
            차량번호 입력 시 차종에 따라 정확한 요금이 자동 적용됩니다
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
