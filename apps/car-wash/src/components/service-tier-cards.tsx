import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── 타입 & 상수 ──────────────────────────────────────────────────────────────────

export type ServiceTier = 'basic' | 'star' | 'sparkle';

export interface TierOption {
  id: ServiceTier;
  label: string;
  emoji: string;
  description: string;
  durationMin: number;
  basePrice: number;
  features: string[];
  recommended?: boolean;
}

export const SERVICE_TIERS: TierOption[] = [
  {
    id: 'basic',
    label: '기본 세차',
    emoji: '🚿',
    description: '빠른 외부 기본 세차',
    durationMin: 10,
    basePrice: 8000,
    features: ['외부 전체 세차', '도어 테두리 닦기', '타이어 린스'],
  },
  {
    id: 'star',
    label: '별표 세차',
    emoji: '⭐',
    description: '유리 세정 포함 프리미엄',
    durationMin: 12,
    basePrice: 12000,
    features: ['기본 세차 전체', '유리면 전체 세정', '크롬 광택'],
    recommended: true,
  },
  {
    id: 'sparkle',
    label: '반짝 세차',
    emoji: '✨',
    description: '광택 마감 최상위 케어',
    durationMin: 15,
    basePrice: 18000,
    features: ['별표 세차 전체', '보디 광택 마감', '휠 전용 세정'],
  },
];

// ── Props ────────────────────────────────────────────────────────────────────────

interface ServiceTierCardsProps {
  selectedTier: ServiceTier | null;
  vehiclePriceRate?: number;
  onSelect: (tier: ServiceTier) => void;
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────────

export const ServiceTierCards: React.FC<ServiceTierCardsProps> = ({
  selectedTier,
  vehiclePriceRate = 1.0,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {/* 스텝 헤더 */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-cyan-500/50 text-cyan-600 dark:text-cyan-400"
        >
          1
        </Badge>
        <h3 className="text-sm font-semibold text-foreground">
          세차 티어 선택
        </h3>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SERVICE_TIERS.map((tier, idx) => {
          const isSelected = selectedTier === tier.id;
          const finalPrice = Math.round(tier.basePrice * vehiclePriceRate);

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              {/* 추천 뱃지 */}
              {tier.recommended && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-cyan-500 text-black text-[10px] font-bold px-2.5 py-0.5 shadow-sm">
                    추천
                  </Badge>
                </div>
              )}

              <Card
                className={cn(
                  'cursor-pointer border-2 transition-all duration-200 h-full',
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/5 shadow-md shadow-cyan-500/10'
                    : tier.recommended
                    ? 'border-cyan-200 dark:border-cyan-900 hover:border-cyan-400 dark:hover:border-cyan-600'
                    : 'border-border hover:border-muted-foreground/40'
                )}
                onClick={() => onSelect(tier.id)}
              >
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl">{tier.emoji}</span>
                      <p className="font-bold text-sm text-foreground mt-1">
                        {tier.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.description}
                      </p>
                    </div>
                    {/* 선택 체크 */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* 소요 시간 */}
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      약 {tier.durationMin}분
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-3">
                  <Separator className="mb-3" />
                  <ul className="space-y-1.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0">
                  <div className="w-full">
                    <span className="text-lg font-bold text-foreground">
                      ₩{finalPrice.toLocaleString()}
                    </span>
                    {vehiclePriceRate !== 1.0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (차종 적용)
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
