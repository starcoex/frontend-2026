import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const WASH_ITEMS = [
  {
    id: 'basic',
    number: '01',
    label: '기본 손세차',
    duration: '8–9분',
    badge: null,
    accentColor: 'from-rose-500 to-rose-600',
    accentLight: 'bg-rose-50 dark:bg-rose-950/30',
    accentText: 'text-rose-500',
    accentBorder: 'border-rose-200 dark:border-rose-800',
    // 실제 이미지로 교체하세요
    image: '/images/wash/basic-wash.webp',
    prices: [
      { type: '승용차', price: '15,000원' },
      { type: '승용차 대형', price: '17,000원' },
      { type: 'SUV', price: '17,000원' },
      { type: 'SUV 대형', price: '20,000원' },
      { type: '스타리아급 특대형', price: '25,000원' },
    ],
    pros: '빠르고 깨끗함 (8–9분)',
    cons: '틈새에 물기 남아 있음',
    steps: [
      '예비세정 : 온수고압 꼼꼼세차',
      '풍성풍성 버블도포',
      '양모미트 작업',
      '아주 쎈 고압물 분사',
      '전용타월 건조',
    ],
    highlight: '극세사 타월로 잔물기제거 마무리',
    caption: '빠르고 깨끗한 기본 외부 손세차. 예약 없이 즉시 시작.',
  },
  {
    id: 'star',
    number: '02',
    label: '별표 손세차',
    duration: '12분',
    badge: 'Best 추천',
    accentColor: 'from-green-500 to-green-600',
    accentLight: 'bg-green-50 dark:bg-green-950/30',
    accentText: 'text-green-500',
    accentBorder: 'border-green-200 dark:border-green-800',
    image: '/images/wash/star-wash.webp',
    prices: [
      { type: '승용차', price: '20,000원' },
      { type: '승용차 대형', price: '22,000원' },
      { type: 'SUV', price: '22,000원' },
      { type: 'SUV 대형', price: '25,000원' },
      { type: '스타리아급 특대형', price: '30,000원' },
    ],
    pros: null,
    cons: null,
    steps: [
      '코팅왁스 분사',
      '아주 쎈 고압물 분사',
      '온풍 에어건조',
      '극세사 타월로 잔물기제거 마무리',
    ],
    highlight: null,
    caption: '기본 세차에 코팅왁스와 에어건조까지. 한 단계 위의 광택.',
  },
  {
    id: 'shine',
    number: '03',
    label: '반짝 손세차',
    duration: '15분',
    badge: null,
    accentColor: 'from-orange-500 to-orange-600',
    accentLight: 'bg-orange-50 dark:bg-orange-950/30',
    accentText: 'text-orange-500',
    accentBorder: 'border-orange-200 dark:border-orange-800',
    image: '/images/wash/shine-wash.webp',
    prices: [
      { type: '승용차', price: '25,000원' },
      { type: '승용차 대형', price: '27,000원' },
      { type: 'SUV', price: '27,000원' },
      { type: 'SUV 대형', price: '30,000원' },
      { type: '스타리아급 특대형', price: '35,000원' },
    ],
    pros: null,
    cons: null,
    steps: [
      '예비세정 : 버블분사 휠세척 온수고압세척',
      '별표외부손세차',
      '타이어 드레싱',
    ],
    highlight: null,
    caption: '반짝반짝 완성. 타이어 드레싱까지 디테일이 다릅니다.',
  },
] as const;

const CASCADE_DESKTOP = [
  { rotate: -6, y: 20 },
  { rotate: 0, y: 0 },
  { rotate: 6, y: 20 },
];
const CASCADE_MOBILE = [
  { rotate: -2, y: 10 },
  { rotate: 0.5, y: 0 },
  { rotate: 2, y: 15 },
];

// ─── 모바일 카드 ──────────────────────────────────────────────────────────────

function MobileWashCard({
  item,
  index,
  cascade,
}: {
  item: (typeof WASH_ITEMS)[number];
  index: number;
  cascade: typeof CASCADE_MOBILE;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 50%'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index === 1 ? '0%' : index === 0 ? '30%' : '-30%', '0%']
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index === 1 ? 40 : 0, cascade[index].y]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, cascade[index].rotate]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.div ref={ref} style={{ x, y, rotate, opacity }}>
      <WashCard item={item} index={index} active />
    </motion.div>
  );
}

// ─── 세차 카드 UI ─────────────────────────────────────────────────────────────

function WashCard({
  item,
  index,
  active,
  dimmed,
}: {
  item: (typeof WASH_ITEMS)[number];
  index: number;
  active: boolean;
  dimmed?: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-[260px]"
    >
      {/* 폰 목업 영역 */}
      <div
        className={cn(
          'relative rounded-[2rem] overflow-hidden border-4 shadow-2xl aspect-[9/19]',
          item.accentBorder
        )}
      >
        {/* 배경 그라데이션 (이미지 없을 때 폴백) */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b',
            item.accentColor,
            'opacity-10'
          )}
        />

        {/* 실제 세차 목업 이미지 */}
        <img
          src={item.image}
          alt={item.label}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 이미지 없을 때 폴백 UI
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* 이미지 위 오버레이 정보 */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-b from-black/40 via-transparent to-black/60">
          {/* 상단: 배지 + 소요시간 */}
          <div className="flex items-start justify-between">
            {item.badge ? (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ⭐ {item.badge}
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-mono">
                {item.duration}
              </span>
            </div>
          </div>

          {/* 하단: 가격 미리보기 */}
          <div className="space-y-0.5">
            {item.prices.slice(0, 3).map((p) => (
              <div key={p.type} className="flex justify-between items-center">
                <span className="text-white/80 text-[9px]">{p.type}</span>
                <span className="text-white text-[10px] font-bold">
                  {p.price}
                </span>
              </div>
            ))}
            {item.prices.length > 3 && (
              <p className="text-white/50 text-[9px] text-right">
                +{item.prices.length - 3}개 차종 더보기
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 카드 하단 텍스트 */}
      <div className="mt-5 text-center">
        <span
          className={cn(
            'font-mono text-[0.625rem] font-medium tracking-wider',
            item.accentText
          )}
        >
          {item.number}
        </span>
        <h3 className="text-lg font-bold tracking-tight mt-0.5">
          {item.label}
        </h3>
        <p className="text-muted-foreground mx-auto mt-1 max-w-48 text-xs leading-relaxed">
          {item.caption}
        </p>
      </div>
    </motion.div>
  );
}

// ─── 세부 정보 패널 ───────────────────────────────────────────────────────────

function WashDetailPanel({ item }: { item: (typeof WASH_ITEMS)[number] }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-6 mt-10',
        item.accentLight,
        item.accentBorder
      )}
    >
      <div className="grid sm:grid-cols-2 gap-6">
        {/* 가격표 */}
        <div>
          <p
            className={cn(
              'text-xs font-mono font-semibold uppercase tracking-wider mb-3',
              item.accentText
            )}
          >
            차종별 가격
          </p>
          <div className="space-y-2">
            {item.prices.map((p) => (
              <div key={p.type} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{p.type}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 작업 공정 */}
        <div>
          <p
            className={cn(
              'text-xs font-mono font-semibold uppercase tracking-wider mb-3',
              item.accentText
            )}
          >
            작업 공정
          </p>
          <ol className="space-y-1.5">
            {item.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span
                  className={cn(
                    'shrink-0 font-mono text-xs font-bold mt-0.5',
                    item.accentText
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    item.highlight === step
                      ? 'font-semibold text-foreground'
                      : ''
                  )}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
          {item.highlight && (
            <p className={cn('mt-2 text-xs font-semibold', item.accentText)}>
              ✓ {item.highlight}
            </p>
          )}
        </div>
      </div>

      {/* 장단점 (기본 손세차만) */}
      {(item.pros || item.cons) && (
        <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3">
          {item.pros && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full font-medium">
              <Star className="w-3 h-3" />
              장점: {item.pros}
            </span>
          )}
          {item.cons && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-medium">
              단점: {item.cons}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function WashShowcase() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollDone, setScrollDone] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1); // 별표(Best) 기본 선택
  const reduced = useReducedMotion();

  const isMobile = useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia('(max-width: 767px)');
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const cascade = isMobile ? CASCADE_MOBILE : CASCADE_DESKTOP;

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 90%', 'start 40%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollDone(reduced ? true : v >= 0.98);
  });

  const easeOut = [0, 0.3, 0.7, 0.85, 1];
  const fin = reduced ? [1, 1, 1, 1, 1] : easeOut;

  const scrollX0 = useTransform(
    scrollYProgress,
    fin,
    isMobile
      ? ['30%', '12%', '3%', '0.5%', '0%']
      : ['100%', '40%', '10%', '2%', '0%']
  );
  const scrollX2 = useTransform(
    scrollYProgress,
    fin,
    isMobile
      ? ['-30%', '-12%', '-3%', '-0.5%', '0%']
      : ['-100%', '-40%', '-10%', '-2%', '0%']
  );
  const scrollY0 = useTransform(scrollYProgress, fin, [
    0,
    cascade[0].y * 0.4,
    cascade[0].y * 0.8,
    cascade[0].y * 0.95,
    cascade[0].y,
  ]);
  const scrollY1 = useTransform(scrollYProgress, fin, [
    8,
    8 + (cascade[1].y - 8) * 0.4,
    8 + (cascade[1].y - 8) * 0.8,
    cascade[1].y * 0.98,
    cascade[1].y,
  ]);
  const scrollY2 = useTransform(scrollYProgress, fin, [
    16,
    16 + (cascade[2].y - 16) * 0.4,
    16 + (cascade[2].y - 16) * 0.8,
    cascade[2].y * 0.98,
    cascade[2].y,
  ]);
  const scrollR0 = useTransform(scrollYProgress, fin, [
    0,
    cascade[0].rotate * 0.4,
    cascade[0].rotate * 0.8,
    cascade[0].rotate * 0.95,
    cascade[0].rotate,
  ]);
  const scrollR1 = useTransform(scrollYProgress, fin, [
    0,
    cascade[1].rotate * 0.4,
    cascade[1].rotate * 0.8,
    cascade[1].rotate * 0.95,
    cascade[1].rotate,
  ]);
  const scrollR2 = useTransform(scrollYProgress, fin, [
    0,
    cascade[2].rotate * 0.4,
    cascade[2].rotate * 0.8,
    cascade[2].rotate * 0.95,
    cascade[2].rotate,
  ]);

  const scrollX = [scrollX0, 0, scrollX2];
  const scrollY = [scrollY0, scrollY1, scrollY2];
  const scrollRotate = [scrollR0, scrollR1, scrollR2];

  const activeItem = WASH_ITEMS[selectedIndex];

  return (
    <section className="py-20 md:py-28 overflow-x-clip">
      <div className="container">
        {/* ── 헤더 (showcase.tsx 패턴) */}
        <div className="mb-12 gap-4 md:mb-20 md:flex md:items-end md:justify-between">
          <div>
            <motion.h2
              className="text-4xl leading-none tracking-tighter md:text-5xl lg:text-6xl font-extrabold"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              10분 완성{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                빠른 외부 손세차
              </span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed"
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              예약 없이 바로 시작. 3가지 코스 중 내 차에 맞는 세차를 선택하세요.
              <br className="hidden md:block" />
              주유 3만원 이상 또는 세차 전용 카드 결제 기준.
            </motion.p>
          </div>

          {/* 우측: 바로 시작 버튼 */}
          <motion.div
            className="mt-8 shrink-0 md:mt-0"
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-muted-foreground mb-3 font-mono text-[0.625rem] tracking-wider uppercase md:text-right">
              예약 없이 즉시 접수
            </p>
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25 w-full md:w-auto"
              onClick={() => navigate(APP_CONFIG.routes.speed)}
            >
              <Zap className="w-4 h-4 mr-2" />
              10분 세차 시작
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>

        {/* ── 모바일: 개별 카드 */}
        <div className="grid grid-cols-1 gap-10 md:hidden">
          {WASH_ITEMS.map((item, i) => (
            <MobileWashCard
              key={item.id}
              item={item}
              index={i}
              cascade={cascade}
            />
          ))}
        </div>

        {/* ── 데스크톱: 스크롤 드리븐 카드 스택 */}
        <div
          ref={gridRef}
          className="hidden md:grid md:grid-cols-3 md:gap-0"
          onMouseLeave={() => {
            setHovered(null);
          }}
        >
          {WASH_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              className={cn('cursor-pointer', i === 1 && 'md:-mx-6')}
              onMouseEnter={() => {
                setHovered(i);
                setSelectedIndex(i);
              }}
              onClick={() => setSelectedIndex(i)}
              style={{
                x: scrollX[i],
                y: scrollY[i],
                rotate: scrollRotate[i],
                zIndex: hovered === i ? 10 : i === 1 ? 2 : 1,
              }}
            >
              <motion.div
                animate={{
                  y: scrollDone && hovered === i ? -12 : 0,
                  rotate: scrollDone && hovered === i ? -cascade[i].rotate : 0,
                  scale: scrollDone
                    ? hovered === i
                      ? 1.05
                      : hovered !== null
                      ? 0.97
                      : 1
                    : 1,
                  opacity: scrollDone
                    ? hovered === null || hovered === i
                      ? 1
                      : 0.4
                    : 1,
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              >
                <WashCard
                  item={item}
                  index={i}
                  active={selectedIndex === i}
                  dimmed={scrollDone && hovered !== null && hovered !== i}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── 세부 정보 패널 (데스크톱 호버/클릭 시) */}
        <div className="hidden md:block">
          <WashDetailPanel item={activeItem} />
        </div>

        {/* ── 모바일 세부 정보 (항상 표시) */}
        <div className="md:hidden mt-4 space-y-6">
          {WASH_ITEMS.map((item) => (
            <WashDetailPanel key={item.id} item={item} />
          ))}
        </div>

        {/* ── 하단: 주의사항 + 카드 혜택 */}
        <motion.div
          className="mt-16 grid sm:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 주의사항 */}
          <div className="rounded-2xl border bg-muted/30 p-6">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              주의사항
            </p>
            <ol className="space-y-2">
              {[
                'PPF 차량은 쎈고압분사로 비닐이 벗겨질 수 있습니다.',
                '도장불량이나 돌빵이 있으면 차량페인트가 벗겨질 수 있습니다.',
                '오염도가 심할 경우 (새똥, 벌레, 진흙 등) 추가 1–3만원.',
                '세차만 하시는 고객님은 2천원 추가됩니다.',
              ].map((note, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="shrink-0 font-mono text-xs font-bold text-foreground/40 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {note}
                </li>
              ))}
            </ol>
          </div>

          {/* 카드 혜택 */}
          <div className="rounded-2xl border bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800 p-6">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 mb-4">
              💡 세차 전용 카드 혜택
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-foreground">
              5만원 결제 시<br />
              <span className="text-cyan-500">59,000원 적립!</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">(환불불가)</p>
            <div className="mt-4 pt-4 border-t border-cyan-200 dark:border-cyan-800">
              <p className="text-sm font-semibold text-foreground">
                🌟 앞유리 유막제거 1만원
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                세차와 함께 앞유리 유막까지 깨끗하게.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
