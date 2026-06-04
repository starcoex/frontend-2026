import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/app/config/app.config';
import { useQueue } from '@starcoex-frontend/queue';
import { useQueueTicketSocket } from '@starcoex-frontend/queue';
import { toast } from 'sonner';
import { QueueSessionStatus } from '@starcoex-frontend/queue';

const STATUS_CONFIG = {
  [QueueSessionStatus.WAITING]: {
    label: '대기 중',
    color: 'text-amber-500',
    icon: Clock,
  },
  [QueueSessionStatus.CALLED]: {
    label: '입고해 주세요!',
    color: 'text-cyan-500',
    icon: CheckCircle2,
  },
  [QueueSessionStatus.IN_SERVICE]: {
    label: '서비스 진행 중',
    color: 'text-blue-500',
    icon: CheckCircle2,
  },
  [QueueSessionStatus.COMPLETED]: {
    label: '완료',
    color: 'text-green-500',
    icon: CheckCircle2,
  },
  [QueueSessionStatus.CANCELLED]: {
    label: '취소됨',
    color: 'text-red-500',
    icon: XCircle,
  },
  [QueueSessionStatus.NO_SHOW]: {
    label: '노쇼',
    color: 'text-gray-500',
    icon: XCircle,
  },
};

export const QueueStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketId = searchParams.get('ticket');
  const { currentSession } = useQueue();

  // ✅ WebSocket으로 실시간 티켓 상태 구독
  useQueueTicketSocket({
    ticketId,
    onTicketReady: (payload) => {
      toast.success(payload.message, {
        duration: 10000,
        description: '지금 바로 입고해 주세요!',
      });
    },
    onTicketStatus: (payload) => {
      if (payload.status === QueueSessionStatus.COMPLETED) {
        toast.success('세차가 완료되었습니다!');
      }
    },
    enabled: !!ticketId,
  });

  if (!currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">대기 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/')}>홈으로</Button>
        </div>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[currentSession.status] ??
    STATUS_CONFIG[QueueSessionStatus.WAITING];
  const StatusIcon = statusConfig.icon;
  const isActive = [
    QueueSessionStatus.WAITING,
    QueueSessionStatus.CALLED,
    QueueSessionStatus.IN_SERVICE,
  ].includes(currentSession.status);

  return (
    <>
      <PageHead
        title={`대기 현황 - ${APP_CONFIG.seo.siteName}`}
        description="실시간 대기 현황을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/queue-status`}
        robots="noindex"
      />

      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm space-y-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 티켓 카드 */}
          <Card className="border-2">
            <CardHeader className="text-center pb-2">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                대기 티켓
              </p>
              <CardTitle className="text-4xl font-bold font-mono tracking-wider">
                {currentSession.ticketNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 상태 */}
              <div className="flex flex-col items-center gap-2 py-4">
                <StatusIcon
                  className={`w-12 h-12 ${statusConfig.color} ${
                    currentSession.status === QueueSessionStatus.CALLED
                      ? 'animate-bounce'
                      : ''
                  }`}
                />
                <p className={`text-xl font-bold ${statusConfig.color}`}>
                  {statusConfig.label}
                </p>
              </div>

              {/* 대기 정보 */}
              {isActive && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold tabular-nums">
                      {currentSession.position}번
                    </p>
                    <p className="text-xs text-muted-foreground">내 순번</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold tabular-nums">
                      약{' '}
                      {Math.round(
                        (new Date(currentSession.estimatedEntryAt).getTime() -
                          Date.now()) /
                          60000
                      )}
                      분
                    </p>
                    <p className="text-xs text-muted-foreground">예상 대기</p>
                  </div>
                </div>
              )}

              {/* 호출 알림 */}
              {currentSession.status === QueueSessionStatus.CALLED && (
                <motion.div
                  className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <p className="text-cyan-600 dark:text-cyan-400 font-bold">
                    🚗 입고해 주세요!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    세차 구역으로 이동해 주세요
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
