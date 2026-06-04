import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Clock, Radio, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── 타입 ────────────────────────────────────────────────────────────────────────

interface QueueStatus {
  waitingCount: number;
  currentPlate: string;
  estimatedMinutes: number;
  isOpen: boolean;
}

// ── Mock Hook (WebSocket 교체 예정) ─────────────────────────────────────────────

const useMockQueueStatus = (): QueueStatus => {
  const [status, setStatus] = useState<QueueStatus>({
    waitingCount: 2,
    currentPlate: '제주 23가 4521',
    estimatedMinutes: 8,
    isOpen: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        waitingCount: Math.max(
          0,
          prev.waitingCount + (Math.random() > 0.6 ? 1 : -1)
        ),
        estimatedMinutes: Math.max(
          0,
          Math.round(prev.estimatedMinutes + (Math.random() > 0.6 ? 2 : -2))
        ),
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return status;
};

// ── 대기 카운트 색상 ─────────────────────────────────────────────────────────────

const getWaitColor = (count: number) => {
  if (count === 0) return 'text-green-500';
  if (count <= 3) return 'text-cyan-500';
  return 'text-amber-500';
};

// ── Props ────────────────────────────────────────────────────────────────────────

interface LiveQueueBoardProps {
  className?: string;
  /** 홈에서 사용하는 간략 모드 */
  compact?: boolean;
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────────

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({
  className,
  compact = false,
}) => {
  const status = useMockQueueStatus();
  const waitColor = getWaitColor(status.waitingCount);

  // ── Compact 모드 (홈 페이지 미리보기) ─────────────────────────────────────────

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('w-full', className)}
      >
        <Card className="border border-border bg-card/80 backdrop-blur-sm shadow-md">
          <CardContent className="flex items-center justify-between gap-4 py-3 px-5">
            {/* 라이브 표시 */}
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                Live
              </span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            {/* 운영 상태 */}
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                status.isOpen
                  ? 'border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10'
                  : 'border-red-500/40 text-red-500 bg-red-500/10'
              )}
            >
              {status.isOpen ? '● 운영 중' : '● 마감'}
            </Badge>

            <Separator orientation="vertical" className="h-4" />

            {/* 대기 수 */}
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={cn('text-sm font-bold tabular-nums', waitColor)}>
                {status.waitingCount}대
              </span>
              <span className="text-xs text-muted-foreground">대기 중</span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            {/* 예상 시간 */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-bold tabular-nums text-foreground">
                약 {status.estimatedMinutes}분
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Full 모드 (스피드 존 페이지) ──────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                실시간 대기 현황
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                status.isOpen
                  ? 'border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10'
                  : 'border-red-500/40 text-red-500 bg-red-500/10'
              )}
            >
              {status.isOpen ? '● 운영 중' : '● 마감'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 space-y-4">
          {/* 수치 그리드 */}
          <div className="grid grid-cols-3 gap-3">
            {/* 대기 차량 */}
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl">
              <Car className="w-4 h-4 text-muted-foreground mb-1.5" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={status.waitingCount}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className={cn('text-2xl font-bold tabular-nums', waitColor)}
                >
                  {status.waitingCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-muted-foreground mt-0.5">
                대기 차량
              </span>
            </div>

            {/* 예상 대기 */}
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl">
              <Clock className="w-4 h-4 text-muted-foreground mb-1.5" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={status.estimatedMinutes}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold tabular-nums text-foreground"
                >
                  {status.estimatedMinutes}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-muted-foreground mt-0.5">
                예상(분)
              </span>
            </div>

            {/* 세차 중 */}
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl">
              <div className="relative w-4 h-4 mb-1.5 flex items-center justify-center">
                <span className="absolute w-3 h-3 rounded-full bg-cyan-500/40 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-cyan-500" />
              </div>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                세차 중
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">진행</span>
            </div>
          </div>

          <Separator />

          {/* 현재 세차 중인 차량 */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">
                현재 세차 중인 차량
              </p>
              <p className="text-sm font-semibold text-foreground">
                {status.currentPlate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
