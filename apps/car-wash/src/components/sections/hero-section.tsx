import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';
import { getCardStyle, useCardStack } from '@/hooks/use-card-stack';
import { cn } from '@/lib/utils';
import { useStoreQueue } from '@/hooks/use-store-queue';
import { StoreStatusCard } from '@/components/queue/store-status-card';

const HERO_FEATURES = [
  '예약 없이 즉시',
  '실시간 대기 현황',
  '주유 연계 할인',
  '전문 디테일러',
] as const;

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { storeMeta, getStatsById } = useStoreQueue();

  const { cards, activeIndex, progress, setPaused, goTo } = useCardStack(
    storeMeta,
    4000
  );

  // ✅ storeMeta 또는 cards 로딩 전 — 카드 영역만 스켈레톤으로 대체
  const isReady = storeMeta.length > 0 && cards.length > 0;

  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-36 px-4">
      <motion.div
        className="relative container"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
          },
        }}
      >
        {/* 헤드라인 */}
        <motion.div
          className="text-center mb-4"
          variants={{
            hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <h1 className="font-extrabold tracking-tighter leading-none">
            <span className="block text-5xl md:text-7xl lg:text-8xl text-foreground">
              빠르게.
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              깨끗하게.
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-foreground">
              제라게.
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-muted-foreground tracking-normal">
            10분 완성 제라게 카케어
          </p>
        </motion.div>

        {/* 구분선 */}
        <motion.div
          className="via-border my-10 h-px bg-linear-to-r from-transparent to-transparent md:my-14"
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: {
              scaleX: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        />

        {/* 2컬럼 그리드 */}
        <motion.div
          className="grid items-start gap-x-12 gap-y-16 md:grid-cols-2"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Left */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed md:max-w-lg">
              예약 없이 바로 접수, 실시간 대기 현황 확인.
              <br />
              전문 디테일링부터 10분 손세차까지 한 곳에서.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25"
                onClick={() => navigate(APP_CONFIG.routes.speed)}
              >
                <Zap className="w-4 h-4 mr-2" />
                10분 세차 시작
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="group/link"
                onClick={() => navigate(APP_CONFIG.routes.premium)}
              >
                프리미엄 예약
                <ChevronRight className="size-4 ml-1 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              </Button>
            </div>

            <div className="text-muted-foreground mt-10 flex flex-wrap gap-6 font-mono text-xs">
              {HERO_FEATURES.map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span className="bg-cyan-400 size-1.5 shrink-0 rounded-full" />
                  {f}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-8 mt-10">
              {[
                { value: '2,400+', label: '누적 시공' },
                { value: '4.9', label: '고객 평점' },
                { value: '87%', label: '재방문율' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: 카드 스택 + 타임라인 */}
          <motion.div
            className="flex lg:justify-end"
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className="w-full md:max-w-md">
              {/* ✅ 데이터 준비 전 스켈레톤 */}
              {!isReady ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border bg-card animate-pulse h-48 w-full" />
                  <div className="space-y-2 mt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 size-2 rounded-full bg-border animate-pulse shrink-0" />
                        <div className="space-y-1 flex-1">
                          <div className="h-3 bg-border rounded animate-pulse w-24" />
                          <div className="h-3 bg-border rounded animate-pulse w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* 카드 스택 */}
                  <div
                    className="relative rotate-1 transition-transform duration-500 hover:-translate-y-1 hover:rotate-0"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    {/* 높이 확보 스페이서 */}
                    <div className="invisible grid">
                      {storeMeta.map((meta) => (
                        <div
                          key={meta.storeId}
                          className="col-start-1 row-start-1"
                        >
                          <StoreStatusCard
                            meta={meta}
                            stats={getStatsById(meta.storeId)}
                          />
                        </div>
                      ))}
                    </div>

                    {cards.map((meta, index) => (
                      <motion.div
                        key={meta.storeId}
                        className={cn(
                          'absolute inset-x-0 top-0',
                          index !== 0 && 'pointer-events-none'
                        )}
                        style={{ transformOrigin: 'top center' }}
                        animate={getCardStyle(index)}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 25,
                        }}
                      >
                        <StoreStatusCard
                          meta={meta}
                          stats={getStatsById(meta.storeId)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* 타임라인 */}
                  <div className="mt-4">
                    {storeMeta.map((item, i) => (
                      <div
                        key={item.storeId}
                        className="flex cursor-pointer gap-3"
                        onClick={() => goTo(i)}
                      >
                        <div className="flex flex-col items-center pt-1">
                          <span className="relative shrink-0">
                            <span
                              className={cn(
                                'block size-2 rounded-full border-2 transition-[transform,background-color] duration-300',
                                item.filled
                                  ? 'border-cyan-400 bg-cyan-400'
                                  : 'border-border',
                                i === activeIndex && 'scale-150'
                              )}
                            />
                            {i === storeMeta.length - 1 &&
                              i === activeIndex && (
                                <svg
                                  className="absolute -inset-1.5 size-5 -rotate-90"
                                  viewBox="0 0 20 20"
                                >
                                  <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    fill="none"
                                    stroke="rgb(34 211 238)"
                                    strokeWidth="1.5"
                                    strokeDasharray="50.27"
                                    strokeDashoffset={
                                      50.27 - (progress / 100) * 50.27
                                    }
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            {item.live && (
                              <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-50" />
                            )}
                          </span>

                          {i < storeMeta.length - 1 && (
                            <div className="bg-border relative my-1 w-0.5 flex-1 overflow-hidden min-h-[2rem]">
                              {i === activeIndex && (
                                <div
                                  className="bg-cyan-400 absolute inset-0 origin-top"
                                  style={{
                                    transform: `scaleY(${progress / 100})`,
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-muted-foreground pb-4 text-xs leading-snug">
                          <strong
                            className={cn(
                              'block font-mono text-xs transition-colors duration-300',
                              i === activeIndex
                                ? 'text-cyan-400'
                                : 'text-foreground'
                            )}
                          >
                            {item.label}
                          </strong>
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
