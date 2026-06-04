import { Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { QueueStats } from '@starcoex-frontend/queue';
import type { StoreUIMeta } from '@/app/config/stores-meta.config';

export interface StoreCardMeta extends StoreUIMeta {
  storeId: number;
  label: string;
  filled: boolean;
  live: boolean;
}

interface StoreStatusCardProps {
  meta: StoreCardMeta;
  stats: QueueStats | null;
}

export function StoreStatusCard({ meta, stats }: StoreStatusCardProps) {
  const badgeClass =
    meta.badge.color === 'cyan'
      ? 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
      : 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10';

  const isOpen = stats?.isOpen ?? false;
  const isAvailable = isOpen && (stats?.waitingCount ?? 0) === 0;
  const hasWaiting = isOpen && (stats?.waitingCount ?? 0) > 0;

  return (
    <Card className="shadow-md transition-shadow duration-300 select-none hover:shadow-xl">
      <CardHeader className="flex-row items-center justify-between border-b gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isOpen && (
            <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse shrink-0" />
          )}
          <span className="font-mono text-[0.625rem] font-medium tracking-wider uppercase text-muted-foreground truncate">
            실시간 현황
          </span>
        </div>
        <Badge variant="outline" className={cn('text-xs shrink-0', badgeClass)}>
          {meta.badge.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-lg text-foreground leading-tight">
            {meta.label}
          </p>
          {!isOpen ? (
            <Badge
              variant="outline"
              className="text-xs border-muted text-muted-foreground shrink-0"
            >
              마감
            </Badge>
          ) : isAvailable ? (
            <Badge
              variant="outline"
              className="text-xs border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10 shrink-0"
            >
              🟢 즉시 입장
            </Badge>
          ) : hasWaiting ? (
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-amber-500 tabular-nums">
                대기 {stats!.waitingCount}대
              </p>
              <p className="text-xs text-muted-foreground">
                약 {stats!.estimatedWaitMin}분
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          {meta.services.map((svc) => (
            <p
              key={svc}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <span className="bg-accent/20 size-1.5 rounded-full shrink-0" />
              {svc}
            </p>
          ))}
        </div>

        <div className="p-2.5 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 {meta.note}
          </p>
        </div>

        {stats && (
          <div className="flex items-center gap-4 pt-1">
            <div className="text-center">
              <p className="text-sm font-bold text-foreground tabular-nums">
                {stats.todayTotal}
              </p>
              <p className="text-[0.625rem] text-muted-foreground">오늘 처리</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground tabular-nums">
                {Math.round(stats.avgDurationSec / 60)}분
              </p>
              <p className="text-[0.625rem] text-muted-foreground">평균 소요</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-secondary gap-2 flex-wrap">
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          {isOpen ? '운영 중' : '운영 종료'}
        </span>
        {isOpen && (
          <Badge
            variant="outline"
            className={cn('text-xs ml-auto', badgeClass)}
          >
            {isAvailable
              ? '바로 접수 가능'
              : `예상 ${stats?.estimatedWaitMin ?? 0}분`}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
