import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Gem,
  Fuel,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { QueueStats } from '@starcoex-frontend/queue';
import type { StoreCardMeta } from '@/components/queue/store-status-card';

interface StoreMetaCardProps {
  meta: StoreCardMeta;
  stats: QueueStats | null;
  index?: number;
  onSelect: (storeId: number) => void;
}

const getQueueBadge = (stats: QueueStats | null) => {
  if (!stats || !stats.isOpen)
    return {
      label: '● 마감',
      className: 'border-red-500/40 text-red-500 bg-red-500/10',
    };
  if (stats.waitingCount === 0)
    return {
      label: '🟢 즉시 입장 가능',
      className:
        'border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10',
    };
  if (stats.waitingCount <= 2)
    return {
      label: `🟡 대기 ${stats.waitingCount}대 · 예상 ${stats.estimatedWaitMin}분`,
      className:
        'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    };
  return {
    label: `🔴 대기 ${stats.waitingCount}대 · 예상 ${stats.estimatedWaitMin}분`,
    className: 'border-red-500/40 text-red-500 bg-red-500/10',
  };
};

export const StoreMetaCard: React.FC<StoreMetaCardProps> = ({
  meta,
  stats,
  index = 0,
  onSelect,
}) => {
  const queueBadge = getQueueBadge(stats);
  const badgeColorClass =
    meta.badge.color === 'cyan'
      ? 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
      : 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10';
  const cardBorderClass =
    meta.badge.color === 'cyan'
      ? 'hover:border-cyan-400 dark:hover:border-cyan-500'
      : 'hover:border-amber-400 dark:hover:border-amber-500';

  const hasSpeedWash = meta.services.some((s) => s.includes('스피드'));
  const hasPremium = meta.services.some((s) => s.includes('디테일링'));
  const hasGas = meta.services.some((s) => s.includes('주유'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card
        className={cn(
          'group h-full flex flex-col border-2 transition-all duration-200 cursor-pointer',
          cardBorderClass
        )}
        onClick={() => onSelect(meta.storeId)}
      >
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn('text-xs font-semibold', badgeColorClass)}
            >
              {meta.badge.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-xs', queueBadge.className)}
            >
              {queueBadge.label}
            </Badge>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-foreground leading-snug">
              {meta.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {meta.description}
            </p>
          </div>
          {meta.address && (
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {meta.address}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="px-5 pb-4 flex-1 space-y-4">
          <Separator />
          <ul className="space-y-1.5">
            {meta.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm">
                <Sparkles className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{h}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 flex-wrap">
            {hasSpeedWash && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
              >
                <Zap className="w-3 h-3" /> 스피드 세차
              </Badge>
            )}
            {hasPremium && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400"
              >
                <Gem className="w-3 h-3" /> 프리미엄
              </Badge>
            )}
            {hasGas && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-green-500/30 text-green-600 dark:text-green-400"
              >
                <Fuel className="w-3 h-3" /> 주유 연계
              </Badge>
            )}
          </div>
          <div className="flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>평일 {meta.operatingHours.weekday}</p>
              <p>주말 {meta.operatingHours.weekend}</p>
            </div>
          </div>
          {(meta.gasStationNote || meta.carCareNote) && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 {meta.gasStationNote ?? meta.carCareNote}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 gap-2">
          {meta.phone && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${meta.phone}`;
              }}
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            className={cn(
              'flex-1 font-semibold group/btn',
              meta.badge.color === 'cyan'
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(meta.storeId);
            }}
          >
            세차 접수하기
            <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
