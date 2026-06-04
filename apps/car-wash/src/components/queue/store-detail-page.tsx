import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Gem, Phone, MapPin } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { APP_CONFIG } from '@/app/config/app.config';
import { useStoreQueue } from '@/hooks/use-store-queue';

export const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { storeMeta, getStatsById } = useStoreQueue();

  const numericId = storeId ? parseInt(storeId, 10) : NaN;
  const meta = storeMeta.find((s) => s.storeId === numericId);
  const stats = getStatsById(numericId);

  // 지점 없을 때
  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">지점 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(APP_CONFIG.routes.stores)}>
            지점 목록으로
          </Button>
        </div>
      </div>
    );
  }

  const badgeColorClass =
    meta.badge.color === 'cyan'
      ? 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
      : 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10';

  const hasSpeedWash = meta.services.some((s) => s.includes('스피드'));
  const hasPremium = meta.services.some((s) => s.includes('디테일링'));
  const hasGas = meta.services.some((s) => s.includes('주유'));

  return (
    <>
      <PageHead
        title={`${meta.label} - ${APP_CONFIG.seo.siteName}`}
        description={meta.description}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/stores/${numericId}`}
      />

      <div className="min-h-screen bg-background">
        {/* 상단 헤더 */}
        <div className="sticky top-[65px] z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base text-foreground leading-none truncate">
                {meta.label}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {meta.badge.label}
              </p>
            </div>
            {meta.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = `tel:${meta.phone}`)}
              >
                <Phone className="w-4 h-4 mr-1.5" />
                전화
              </Button>
            )}
          </div>
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 지점 정보 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border border-border">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-2 flex-wrap">
                  <Badge variant="outline" className={badgeColorClass}>
                    {meta.badge.label}
                  </Badge>
                  {hasGas && (
                    <Badge variant="secondary" className="text-xs">
                      주유 연계 할인
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {meta.description}
                </p>

                {meta.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {meta.address}
                    </p>
                  </div>
                )}

                {(meta.gasStationNote || meta.carCareNote) && (
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      💡 {meta.gasStationNote ?? meta.carCareNote}
                    </p>
                  </div>
                )}

                {/* 실시간 대기 현황 인라인 표시 */}
                {stats && (
                  <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold tabular-nums">
                        {stats.waitingCount}대
                      </p>
                      <p className="text-xs text-muted-foreground">현재 대기</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold tabular-nums">
                        {stats.estimatedWaitMin}분
                      </p>
                      <p className="text-xs text-muted-foreground">예상 대기</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold tabular-nums">
                        {stats.todayTotal}건
                      </p>
                      <p className="text-xs text-muted-foreground">오늘 처리</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <Separator />

          {/* 서비스 선택 */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-foreground">
              서비스 선택
            </h2>

            {/* 스피드 세차 */}
            {hasSpeedWash && (
              <Card
                className="border-2 border-cyan-200 dark:border-cyan-900 hover:border-cyan-400 cursor-pointer transition-all"
                onClick={() =>
                  navigate(`${APP_CONFIG.routes.speed}?storeId=${numericId}`)
                }
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">⚡ 스피드 세차</p>
                    <p className="text-sm text-muted-foreground">
                      {hasGas
                        ? '주유 후 바로 연계, 10분 완료'
                        : '전문 스탭의 10분 손세차'}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-cyan-500/40 text-cyan-600 dark:text-cyan-400"
                  >
                    from ₩8,000
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* 프리미엄 디테일링 */}
            {hasPremium && (
              <Card
                className="border-2 border-amber-200 dark:border-amber-900 hover:border-amber-400 cursor-pointer transition-all"
                onClick={() =>
                  navigate(
                    `${APP_CONFIG.routes.premiumBooking}?storeId=${numericId}`
                  )
                }
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center shrink-0">
                    <Gem className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">
                      💎 프리미엄 디테일링
                    </p>
                    <p className="text-sm text-muted-foreground">
                      코팅 · PPF · 실내 크리닝 · 사전 예약 필수
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  >
                    from ₩60,000
                  </Badge>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};
