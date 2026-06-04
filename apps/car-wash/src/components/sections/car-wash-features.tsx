import { Droplets, Star, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

// 시간대별 대기 시간 (분) - 평균 데이터
const WAIT_TIME_DATA = [
  { hour: '08시', wait: 3, vehicles: 4 },
  { hour: '09시', wait: 8, vehicles: 11 },
  { hour: '10시', wait: 18, vehicles: 24 },
  { hour: '11시', wait: 22, vehicles: 29 },
  { hour: '12시', wait: 15, vehicles: 20 },
  { hour: '13시', wait: 12, vehicles: 16 },
  { hour: '14시', wait: 10, vehicles: 13 },
  { hour: '15시', wait: 14, vehicles: 19 },
  { hour: '16시', wait: 20, vehicles: 27 },
  { hour: '17시', wait: 25, vehicles: 33 },
  { hour: '18시', wait: 16, vehicles: 21 },
  { hour: '19시', wait: 6, vehicles: 8 },
] as const;

const waitChartConfig = {
  wait: {
    label: '평균 대기(분)',
    color: 'var(--color-cyan-500, oklch(0.715 0.143 215.09))',
  },
} satisfies ChartConfig;

// 4베이 운영 현황
const BAY_FEATURES = [
  {
    id: 'basic',
    name: '기본 손세차 베이',
    count: 2,
    duration: '8–9분',
    detail: '2개 베이 동시 운영으로 대기 시간 최소화. 가장 빠른 회전율.',
    accentColor: 'text-rose-500',
    trend: '일 평균 80대 처리',
  },
  {
    id: 'star',
    name: '별표 손세차 베이',
    count: 1,
    duration: '12분',
    detail: '코팅왁스 + 에어건조 전용 베이. Best 추천 코스.',
    accentColor: 'text-green-500',
    trend: '일 평균 35대 처리',
  },
  {
    id: 'shine',
    name: '반짝 손세차 베이',
    count: 1,
    duration: '15분',
    detail: '타이어 드레싱까지 완성. 디테일링 전용 베이 운영.',
    accentColor: 'text-orange-500',
    trend: '일 평균 25대 처리',
  },
  {
    id: 'window',
    name: '앞유리 유막제거',
    count: 4,
    duration: '5분',
    detail: '모든 베이에서 추가 가능. 1만원. 세차와 함께 진행.',
    accentColor: 'text-cyan-500',
    trend: '전 베이 동시 가능',
  },
] as const;

// 핵심 지표
const STATS = [
  {
    value: '4',
    label: '운영 베이',
    accent: false,
    detail: '4개 베이 동시 운영으로 주말 피크도 빠르게 소화합니다.',
    milestone: '최대 동시 처리: 4대',
    progress: 100,
  },
  {
    value: '10분',
    label: '평균 세차 시간',
    accent: true,
    detail: '기본 외부 손세차 기준 8–9분. 예약 없이도 10분 내 완성.',
    milestone: '최단 기록: 7분 30초',
    progress: 85,
  },
  {
    value: '4.9',
    label: '고객 평점',
    accent: false,
    detail: '재방문율 87%. 누적 시공 2,400대 이상의 검증된 품질.',
    milestone: '목표: 5,000대 달성',
    progress: 48,
  },
] as const;

// 시간대별 방문 분포
const TIME_SLOTS = [
  { label: '08–09시', pct: 8, vehicles: 15, tip: '여유로운 아침 방문 추천' },
  { label: '09–10시', pct: 15, vehicles: 28, tip: '비교적 쾌적한 시간대' },
  {
    label: '10–12시',
    pct: 38,
    vehicles: 72,
    peak: true,
    tip: '피크타임 — 대기 15분 내외',
  },
  { label: '12–14시', pct: 20, vehicles: 38, tip: '점심 이후 중간 혼잡' },
  { label: '14–16시', pct: 12, vehicles: 23, tip: '오후 황금 시간대' },
  {
    label: '16–18시',
    pct: 25,
    vehicles: 47,
    peak: true,
    tip: '퇴근 피크 — 대기 20분 내외',
  },
  { label: '18–20시', pct: 10, vehicles: 19, tip: '저녁 방문 가능' },
] as const;

// ─── 통계 행 ──────────────────────────────────────────────────────────────────

function StatsRow() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      className="flex flex-wrap items-start gap-y-8"
      onMouseLeave={() => setHovered(null)}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          className={cn(
            'w-1/3 cursor-pointer',
            i === 0 && 'pr-8',
            i === 1 && 'border-l border-dashed px-6 sm:px-8',
            i === 2 && 'border-l border-dashed pl-6 sm:pl-8'
          )}
          onMouseEnter={() => setHovered(i)}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          animate={{
            opacity: hovered === null || hovered === i ? 1 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className={cn(
              'block text-6xl font-extrabold tracking-tight md:text-7xl',
              stat.accent && 'text-cyan-500'
            )}
            animate={{ x: hovered === i ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {stat.value}
          </motion.span>
          <span className="text-muted-foreground mt-1 block font-mono text-xs tracking-wider uppercase">
            {stat.label}
          </span>
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.12 },
                  },
                }}
                transition={{
                  height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2 },
                }}
              >
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {stat.detail}
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-mono text-[0.625rem]">
                      {stat.milestone}
                    </span>
                    <span className="text-cyan-500 font-mono text-[0.625rem]">
                      {stat.progress}%
                    </span>
                  </div>
                  <AnimatedProgress
                    target={stat.progress}
                    className="bg-cyan-500/10 **:data-[slot=progress-indicator]:bg-cyan-500 mt-1.5 h-1 **:data-[slot=progress-indicator]:duration-600 **:data-[slot=progress-indicator]:ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── 시간대별 대기 시간 차트 ──────────────────────────────────────────────────

function WaitTimeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-muted-foreground block font-mono text-[0.625rem] font-medium tracking-wider uppercase">
            시간대별 평균 대기 시간 · 평일 기준
          </span>
          <span className="text-muted-foreground mt-1 block text-sm">
            방문 전 실시간 대기 현황을 앱에서 확인하세요
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-[2px] bg-cyan-500" />
          <span className="text-muted-foreground font-mono text-[0.625rem]">
            대기 시간(분)
          </span>
        </div>
      </div>

      <ChartContainer
        config={waitChartConfig}
        className="aspect-auto h-44 w-full"
      >
        <BarChart
          data={WAIT_TIME_DATA as unknown as Record<string, unknown>[]}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof WAIT_TIME_DATA)[number];
              return (
                <div className="bg-background rounded-lg border px-2.5 py-1.5 shadow-xl">
                  <div className="flex flex-col gap-1 font-mono text-[0.625rem]">
                    <span className="text-muted-foreground">{d.hour}</span>
                    <span className="font-medium text-cyan-500">
                      대기 {d.wait}분 · 차량 {d.vehicles}대
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="wait" fill="var(--color-wait)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>

      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[0.625rem] text-muted-foreground">
        <span>
          🟢 추천:{' '}
          <span className="text-cyan-500 font-medium">08–09시, 14–16시</span>
        </span>
        <span>
          🔴 피크: <span className="font-medium">10–12시, 16–18시</span>
        </span>
      </div>
    </motion.div>
  );
}

// ─── 4베이 운영 현황 ──────────────────────────────────────────────────────────

function BayFeatures() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-muted-foreground mb-6 block font-mono text-[0.625rem] font-medium tracking-wider uppercase">
        4베이 운영 현황
      </span>
      <div className="space-y-0" onMouseLeave={() => setHovered(null)}>
        {BAY_FEATURES.map((bay, i) => (
          <motion.div
            key={bay.id}
            className="cursor-pointer border-b border-dashed py-3 first:pt-0 last:border-b-0"
            onMouseEnter={() => setHovered(i)}
            animate={{
              opacity: hovered === null || hovered === i ? 1 : 0.3,
            }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="flex items-baseline justify-between"
              animate={{ x: hovered === i ? 8 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={cn(
                    'text-3xl font-extrabold tracking-tight transition-colors duration-300 md:text-4xl',
                    hovered === i ? bay.accentColor : 'text-foreground'
                  )}
                >
                  {bay.count}베이
                </span>
                <span className="text-muted-foreground text-sm">
                  {bay.name}
                </span>
              </div>
              <span className="text-muted-foreground font-mono text-sm shrink-0 ml-2">
                {bay.duration}
              </span>
            </motion.div>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  className="overflow-hidden pl-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.12 },
                    },
                  }}
                  transition={{
                    height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {bay.detail}
                  </p>
                  <span
                    className={cn(
                      'mt-1.5 inline-block font-mono text-[0.625rem]',
                      bay.accentColor
                    )}
                  >
                    {bay.trend}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 방문 인사이트 + 시간대별 분포 ───────────────────────────────────────────

function VisitInsight() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      className="h-full md:border-l md:border-dashed md:pl-12"
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 인사이트 카드 */}
      <div className="mb-3 flex items-center gap-1.5">
        <Star className="fill-cyan-500 stroke-cyan-500 size-2.5" />
        <span className="text-cyan-500 font-mono text-[0.625rem] font-medium tracking-wider uppercase">
          스마트 방문 가이드
        </span>
      </div>
      <p className="text-lg leading-relaxed">
        <strong>오전 8–9시</strong> 또는 <strong>오후 2–4시</strong>가
        최적입니다. 4베이 동시 운영으로 피크타임도{' '}
        <span className="text-cyan-500 font-medium">평균 20분 이내</span>에
        처리됩니다. 실시간 대기 현황은 앱에서 확인하세요.
      </p>

      {/* 차별화 포인트 */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          {
            icon: <Droplets className="w-3.5 h-3.5" />,
            title: '온수 고압 세차',
            desc: '꼼꼼한 예비세정',
          },
          {
            icon: <Zap className="w-3.5 h-3.5" />,
            title: '에어 건조',
            desc: '잔물기 없는 마무리',
          },
          {
            icon: <Star className="w-3.5 h-3.5" />,
            title: '코팅왁스',
            desc: '별표 코스 기본 포함',
          },
          {
            icon: <Droplets className="w-3.5 h-3.5" />,
            title: '타이어 드레싱',
            desc: '반짝 코스 전용',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-muted/30 p-3 flex items-start gap-2"
          >
            <span className="text-cyan-500 mt-0.5 shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs font-semibold">{item.title}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 시간대별 방문 분포 */}
      <div className="mt-8">
        <span className="text-muted-foreground mb-4 block font-mono text-[0.625rem] font-medium tracking-wider uppercase">
          시간대별 방문 분포
        </span>
        <div className="space-y-2.5" onMouseLeave={() => setHovered(null)}>
          {TIME_SLOTS.map((slot, i) => (
            <motion.div
              key={slot.label}
              className="flex cursor-pointer items-center gap-3"
              onMouseEnter={() => setHovered(i)}
              animate={{
                opacity: hovered === null || hovered === i ? 1 : 0.3,
                x: hovered === i ? 4 : 0,
              }}
              transition={{
                opacity: { duration: 0.25 },
                x: { type: 'spring', stiffness: 300, damping: 30 },
              }}
            >
              <span
                className={cn(
                  'w-16 shrink-0 font-mono text-[0.625rem] transition-colors duration-300',
                  hovered === i || slot.pct
                    ? 'text-cyan-500 font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {slot.label}
              </span>
              <div className="bg-foreground/5 relative h-2 flex-1 overflow-hidden rounded-full">
                <motion.div
                  className={cn(
                    'h-full rounded-full transition-colors duration-300',
                    hovered === i || slot.pct ? 'bg-cyan-500' : 'bg-cyan-500/35'
                  )}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${slot.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span
                className={cn(
                  'w-8 text-right font-mono text-[0.625rem] transition-colors duration-300',
                  hovered === i ? 'text-cyan-500' : 'text-muted-foreground'
                )}
              >
                {slot.vehicles}대
              </span>
              <AnimatePresence>
                {hovered === i && (
                  <motion.span
                    className="text-cyan-500 font-mono text-[0.625rem] font-medium"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {slot.pct}%
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {hovered !== null ? (
            <motion.p
              key={hovered}
              className="text-muted-foreground mt-3 text-xs"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {TIME_SLOTS[hovered].tip}
              {TIME_SLOTS[hovered].pct && (
                <span className="text-cyan-500 font-medium"> — 피크타임</span>
              )}
            </motion.p>
          ) : (
            <motion.p
              key="default"
              className="text-muted-foreground mt-3 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              최적 방문:{' '}
              <span className="text-cyan-500 font-medium">
                08–09시, 14–16시
              </span>{' '}
              · 대기 5분 이내
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── AnimatedProgress ────────────────────────────────────────────────────────

function AnimatedProgress({
  target,
  className,
}: {
  target: number;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setValue(target), 100);
    return () => clearTimeout(t);
  }, [target]);
  return <Progress value={value} className={className} />;
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function CarWashFeatures() {
  return (
    <section
      id="features"
      className="py-20 md:py-28 relative scroll-mt-20 overflow-hidden"
    >
      {/* 점 그리드 패턴 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        }}
      />

      <div className="relative container">
        {/* ── 헤더 */}
        <motion.div
          className="mb-12 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: {} }}
        >
          <motion.span
            className="text-cyan-500 mb-6 block font-mono text-xs font-medium tracking-wider uppercase"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            제라게 카케어
          </motion.span>
          <motion.h2
            className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            4베이로 더 빠르게,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              스마트하게
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            4개 베이 동시 운영, 실시간 대기 현황 확인, 전문 디테일링까지.
            <br className="hidden md:block" />
            제라게는 당신의 시간을 아낍니다.
          </motion.p>
        </motion.div>

        {/* ── 핵심 지표 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { delayChildren: 0.2 } },
          }}
        >
          <StatsRow />
        </motion.div>

        {/* 구분선 */}
        <div className="bg-foreground/10 my-16 h-px" />

        {/* ── 시간대별 대기 차트 */}
        <WaitTimeChart />

        {/* 구분선 */}
        <div className="bg-foreground/10 my-16 h-px" />

        {/* ── 4베이 + 방문 인사이트 */}
        <div className="grid items-start gap-12 md:grid-cols-2">
          <BayFeatures />
          <VisitInsight />
        </div>
      </div>
    </section>
  );
}
