import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── 타입 & 상수 ──────────────────────────────────────────────────────────────────

export interface AddonOption {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  emoji: string;
}

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'tire_shine',
    name: '타이어 광택',
    description: '4개 타이어 전용 광택제 도포',
    price: 3000,
    durationMin: 3,
    emoji: '🔵',
  },
  {
    id: 'mat_cleaning',
    name: '실내 매트 클리닝',
    description: '앞뒤 매트 전체 세정',
    price: 5000,
    durationMin: 5,
    emoji: '🪣',
  },
  {
    id: 'water_repellent',
    name: '유리막 발수코팅',
    description: '전면 유리 발수 강화 코팅',
    price: 15000,
    durationMin: 5,
    emoji: '💧',
  },
  {
    id: 'trunk_clean',
    name: '트렁크 청소',
    description: '트렁크 내부 간단 클리닝',
    price: 4000,
    durationMin: 4,
    emoji: '🗄️',
  },
  {
    id: 'interior_vacuum',
    name: '실내 진공청소',
    description: '시트 및 바닥 진공 흡입',
    price: 6000,
    durationMin: 7,
    emoji: '🌀',
  },
];

// ── Props ────────────────────────────────────────────────────────────────────────

interface AddonSelectorProps {
  selectedAddons: string[];
  onToggle: (addonId: string) => void;
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────────

export const AddonSelector: React.FC<AddonSelectorProps> = ({
  selectedAddons,
  onToggle,
}) => {
  const selectedTotal = ADDON_OPTIONS.filter((a) =>
    selectedAddons.includes(a.id)
  ).reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="space-y-3">
      {/* 스텝 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-cyan-500/50 text-cyan-600 dark:text-cyan-400"
          >
            2
          </Badge>
          <h3 className="text-sm font-semibold text-foreground">애드온 선택</h3>
          <span className="text-xs text-muted-foreground">(선택사항)</span>
        </div>

        {/* 선택된 애드온 합계 */}
        {selectedAddons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge
              variant="outline"
              className="border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
            >
              +₩{selectedTotal.toLocaleString()}
            </Badge>
          </motion.div>
        )}
      </div>

      {/* 애드온 카드 리스트 */}
      <Card className="border border-border">
        <CardContent className="p-0">
          {ADDON_OPTIONS.map((addon, idx) => {
            const isSelected = selectedAddons.includes(addon.id);
            const isLast = idx === ADDON_OPTIONS.length - 1;

            return (
              <React.Fragment key={addon.id}>
                <motion.button
                  onClick={() => onToggle(addon.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 text-left',
                    'transition-colors duration-150',
                    isSelected ? 'bg-cyan-500/5' : 'hover:bg-muted/50'
                  )}
                >
                  {/* 토글 아이콘 */}
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-muted text-muted-foreground border border-border'
                    )}
                  >
                    {isSelected ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </div>

                  {/* 이모지 */}
                  <span className="text-xl shrink-0">{addon.emoji}</span>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isSelected
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-foreground'
                      )}
                    >
                      {addon.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {addon.description} · +{addon.durationMin}분
                    </p>
                  </div>

                  {/* 가격 */}
                  <span
                    className={cn(
                      'text-sm font-bold shrink-0',
                      isSelected
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-foreground'
                    )}
                  >
                    +₩{addon.price.toLocaleString()}
                  </span>
                </motion.button>

                {!isLast && <Separator />}
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
