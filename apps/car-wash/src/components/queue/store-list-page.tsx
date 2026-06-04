import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, List, SlidersHorizontal } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { APP_CONFIG } from '@/app/config/app.config';
import { useStoreQueue } from '@/hooks/use-store-queue';
import { IntegratedQueueBoard } from '@/components/queue/intergrated-queue-board';
import { StoreMetaCard } from '@/components/queue/store-meta-card';

type FilterType = 'all' | 'speed' | 'premium';

export const StoreListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const { storeMeta, getStatsById } = useStoreQueue();

  const filteredMeta = storeMeta.filter((s) => {
    if (filter === 'speed')
      return s.services.some((sv) => sv.includes('스피드'));
    if (filter === 'premium')
      return s.services.some((sv) => sv.includes('디테일링'));
    return true;
  });

  return (
    <>
      <PageHead
        title={`지점 찾기 - ${APP_CONFIG.seo.siteName}`}
        description="내 주변 카케어 지점을 찾고 실시간 대기 현황을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/stores`}
      />

      <div className="min-h-screen bg-background">
        {/* 페이지 헤더 */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-[65px] z-10">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-500" />
                  지점 찾기
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  현재 운영 중인 {storeMeta.length}개 지점
                </p>
              </div>

              <ToggleGroup
                type="single"
                value={filter}
                onValueChange={(v) => v && setFilter(v as FilterType)}
                className="bg-muted rounded-lg p-1"
              >
                <ToggleGroupItem
                  value="all"
                  size="sm"
                  className="text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  <List className="w-3.5 h-3.5 mr-1" />
                  전체
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="speed"
                  size="sm"
                  className="text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  ⚡ 스피드
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="premium"
                  size="sm"
                  className="text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  💎 프리미엄
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* 통합 대기 현황판 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <IntegratedQueueBoard />
          </motion.div>

          {/* 가장 빠른 지점 추천 배너 */}
          {storeMeta.length > 0 &&
            (() => {
              const fastest = storeMeta.reduce<(typeof storeMeta)[0] | null>(
                (min, s) => {
                  const stats = getStatsById(s.storeId);
                  if (!stats?.isOpen) return min;
                  if (!min) return s;
                  return stats.waitingCount <
                    (getStatsById(min.storeId)?.waitingCount ?? Infinity)
                    ? s
                    : min;
                },
                null
              );
              if (!fastest) return null;
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                  <span className="text-2xl">🚀</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      지금 가장 빠른 곳: {fastest.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(getStatsById(fastest.storeId)?.waitingCount ?? 0) === 0
                        ? '대기 없이 즉시 입장 가능'
                        : `대기 ${
                            getStatsById(fastest.storeId)?.waitingCount
                          }대`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0 bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => navigate(`/stores/${fastest.storeId}`)}
                  >
                    바로 가기
                  </Button>
                </motion.div>
              );
            })()}

          {/* 지점 카드 리스트 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">
                {filter === 'all'
                  ? '전체 지점'
                  : filter === 'speed'
                  ? '⚡ 스피드 세차 지점'
                  : '💎 프리미엄 지점'}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filteredMeta.length}
                </Badge>
              </p>
              <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                정렬
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredMeta.map((meta, idx) => (
                <StoreMetaCard
                  key={meta.storeId}
                  meta={meta}
                  stats={getStatsById(meta.storeId)}
                  index={idx}
                  onSelect={(id) => navigate(`/stores/${id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
