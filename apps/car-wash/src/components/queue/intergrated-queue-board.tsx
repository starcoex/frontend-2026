import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useStoreQueue } from '@/hooks/use-store-queue';

interface IntegratedQueueBoardProps {
  className?: string;
  onStoreClick?: (storeId: number) => void; // ← 추가
}

export const IntegratedQueueBoard: React.FC<IntegratedQueueBoardProps> = ({
  className,
  onStoreClick, // ← 추가
}) => {
  const { storeMeta, getStatsById } = useStoreQueue();

  const fastestMeta =
    storeMeta.length > 0
      ? storeMeta.reduce<(typeof storeMeta)[0] | null>((min, s) => {
          const stats = getStatsById(s.storeId);
          if (!stats?.isOpen) return min;
          if (!min) return s;
          const minStats = getStatsById(min.storeId);
          return stats.waitingCount < (minStats?.waitingCount ?? Infinity)
            ? s
            : min;
        }, null)
      : null;

  return (
    <Card className={cn('border border-border', className)}>
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
              전체 지점 실시간 현황
            </span>
          </div>
          {fastestMeta && (
            <Badge
              variant="outline"
              className="text-xs border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10 gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              {fastestMeta.label}{' '}
              {(getStatsById(fastestMeta.storeId)?.waitingCount ?? 0) === 0
                ? '즉시 가능'
                : '대기 최소'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 space-y-3">
        {storeMeta.map((store, idx) => {
          const stats = getStatsById(store.storeId);
          const isFastest = fastestMeta?.storeId === store.storeId;

          return (
            <React.Fragment key={store.storeId}>
              {idx > 0 && <Separator />}
              <div
                className={cn(
                  'flex items-center justify-between gap-3 py-1 rounded-lg px-2 transition-colors',
                  isFastest && 'bg-green-500/5',
                  onStoreClick && 'cursor-pointer hover:bg-muted/50' // ← 추가
                )}
                onClick={() => onStoreClick?.(store.storeId)} // ← 추가
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full shrink-0',
                      store.badge.color === 'cyan'
                        ? 'bg-cyan-500'
                        : 'bg-amber-500'
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {store.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {store.badge.label}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {!stats || !stats.isOpen ? (
                    <span className="text-xs text-muted-foreground">마감</span>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={stats.waitingCount}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {stats.waitingCount === 0 ? (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10"
                          >
                            즉시 가능
                          </Badge>
                        ) : (
                          <div className="text-right">
                            <p
                              className={cn(
                                'text-sm font-bold tabular-nums',
                                stats.waitingCount <= 2
                                  ? 'text-amber-500'
                                  : 'text-red-500'
                              )}
                            >
                              대기 {stats.waitingCount}대
                            </p>
                            <p className="text-xs text-muted-foreground">
                              약 {stats.estimatedWaitMin}분
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
