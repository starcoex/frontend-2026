// apps/car-wash/src/components/sections/car-wash-testimonials.tsx
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCardStyle, useCardStack } from '@/hooks/use-card-stack';
import { cn } from '@/lib/utils';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 0,
    quote:
      '제주 살면서 세차 때문에 스트레스 받은 적이 많았는데, 여기는 정말 달라요. 10분도 안 걸렸는데 차가 반짝반짝해졌어요. 주유하면서 같이 할 수 있어서 시간 낭비도 없고, 이제 단골이 됐습니다.',
    rating: 5,
    author: {
      name: '김민준',
      role: '제주시 거주 · 기본 손세차',
      vehicle: 'SUV',
      visits: '월 3회 방문',
      avatar: '',
    },
  },
  {
    id: 1,
    quote:
      '별표 외부 손세차 받았는데 코팅왁스 효과가 확실히 느껴져요. 비 온 뒤에도 물방울이 또르르 굴러가더라고요. 다른 세차장이랑 비교가 안 되는 퀄리티예요. 제주에서 이 정도 퀄리티를 기대 못 했는데.',
    rating: 5,
    author: {
      name: '이서연',
      role: '서귀포시 거주 · 별표 손세차',
      vehicle: '승용차',
      visits: '2주마다 방문',
      avatar: '',
    },
  },
  {
    id: 2,
    quote:
      '반짝반짝 코스 했는데 타이어 드레싱까지 해주니까 차 전체가 새 차처럼 보여요. 작업자분들이 꼼꼼하게 하나하나 신경 써주는 게 느껴지더라고요. 앞유리 유막제거도 같이 했는데 야간 운전이 훨씬 편해졌어요.',
    rating: 5,
    author: {
      name: '박준혁',
      role: '제주시 거주 · 반짝 손세차',
      vehicle: 'SUV 대형',
      visits: '주 1회 방문',
      avatar: '',
    },
  },
  {
    id: 3,
    quote:
      '렌터카 반납 전에 급하게 들렀는데 대기 없이 바로 들어갔어요. 10분 만에 깨끗하게 나와서 반납 했더니 직원도 깜짝 놀라더라고요. 제주 여행 오실 분들 꼭 들르세요. 앱에서 대기 현황 확인되는 것도 너무 편해요.',
    rating: 5,
    author: {
      name: '최유진',
      role: '제주 여행객 · 기본 손세차',
      vehicle: '렌터카',
      visits: '여행 중 방문',
      avatar: '',
    },
  },
  {
    id: 4,
    quote:
      '세차 전용 카드 만들어서 쓰고 있는데 정말 이득이에요. 5만원 결제하면 59,000원 적립되니까 거의 공짜로 세차하는 느낌이에요. 한 달에 몇 번씩 오는데 카드 하나로 해결되니까 너무 좋아요.',
    rating: 5,
    author: {
      name: '강도현',
      role: '제주시 거주 · 세차 전용 카드 회원',
      vehicle: '승용차 대형',
      visits: '주 2회 방문',
      avatar: '',
    },
  },
] as const;

// ─── 별점 ────────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-cyan-400 stroke-cyan-400" />
      ))}
    </div>
  );
}

// ─── 개별 카드 ────────────────────────────────────────────────────────────────

function TestimonialCard({ card }: { card: (typeof TESTIMONIALS)[number] }) {
  const initials = card.author.name.split('').slice(0, 2).join('');

  return (
    <Card className="h-full shadow-md">
      <CardContent className="flex-1 px-8 pt-8 md:px-10 md:pt-10">
        {/* 별점 */}
        <StarRating rating={card.rating} />

        {/* 인용 부호 */}
        <span className="text-cyan-400/20 text-5xl leading-none select-none md:text-6xl font-serif block mt-2">
          &ldquo;
        </span>
        <p className="mt-1 text-lg leading-snug tracking-tight md:text-xl lg:text-2xl font-medium">
          {card.quote}
        </p>
      </CardContent>

      <CardFooter className="gap-2 border-0 bg-transparent px-8 pt-4 pb-8 md:px-10 md:pb-10">
        <div data-author-link className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-cyan-200 dark:border-cyan-800">
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{card.author.name}</p>
            <p className="text-muted-foreground font-mono text-xs tracking-wider">
              {card.author.role}
            </p>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-cyan-500 font-mono text-xs font-medium">
            {card.author.vehicle}
          </p>
          <p className="text-muted-foreground font-mono text-[10px] mt-0.5">
            {card.author.visits}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

// ─── 카드 스택 ────────────────────────────────────────────────────────────────

function TestimonialCardStack() {
  const { cards, setPaused, goTo, activeIndex, progress } =
    useCardStack(TESTIMONIALS);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{
    clientX: number;
    clientY: number;
    zone: 'top' | 'bottom';
    visible: boolean;
  }>({ clientX: 0, clientY: 0, zone: 'bottom', visible: false });

  const goPrev = () =>
    goTo((activeIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => goTo((activeIndex + 1) % TESTIMONIALS.length);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const target = e.target as HTMLElement;
    const isOverLink = target.closest('[data-author-link]') !== null;
    const relY = e.clientY - rect.top;
    const zone = relY < rect.height / 2 ? 'top' : 'bottom';
    setCursor({
      clientX: e.clientX,
      clientY: e.clientY,
      zone,
      visible: !isOverLink,
    });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-author-link]')) return;
    if (cursor.zone === 'top') goPrev();
    else goNext();
  };

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* 카드 스택 */}
      <div
        ref={containerRef}
        className={cn(
          'relative w-full max-w-xl',
          cursor.visible && 'cursor-none'
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setPaused(false);
          setCursor((prev) => ({ ...prev, visible: false }));
        }}
        onClick={handleClick}
      >
        {/* 높이 확보 스페이서 */}
        <div className="invisible grid">
          {TESTIMONIALS.map((card) => (
            <div key={card.id} className="col-start-1 row-start-1">
              <TestimonialCard card={card} />
            </div>
          ))}
        </div>

        {/* 애니메이션 스택 */}
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={cn(
              'absolute inset-x-0 top-0 bottom-0',
              index !== 0 && 'pointer-events-none'
            )}
            style={{ transformOrigin: 'top center' }}
            animate={getCardStyle(index)}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <TestimonialCard card={card} />
          </motion.div>
        ))}

        {/* 블러 전환 오버레이 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="pointer-events-none absolute inset-0 z-10 rounded-xl backdrop-blur-md"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* 플로팅 커서 */}
        {typeof window !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {cursor.visible && (
                <motion.div
                  className="pointer-events-none fixed z-50"
                  style={{
                    left: cursor.clientX - 20,
                    top: cursor.clientY - 20,
                  }}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                  transition={{
                    opacity: { duration: 0.15 },
                    filter: { duration: 0.15 },
                    scale: { type: 'spring', stiffness: 400, damping: 25 },
                  }}
                >
                  <div className="bg-cyan-500 text-black flex size-10 items-center justify-center rounded-full shadow-lg shadow-cyan-500/30">
                    {cursor.zone === 'top' ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>

      {/* 세로 네비게이션 점 */}
      <div className="flex flex-col items-center gap-3">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => goTo(i)}
            className="relative flex cursor-pointer items-center justify-center"
            aria-label={`${t.author.name} 후기 보기`}
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-200',
                activeIndex === i
                  ? 'bg-cyan-500 size-2.5'
                  : 'bg-foreground/20 hover:bg-foreground/40 size-2'
              )}
            />
            {activeIndex === i && (
              <svg className="absolute size-5 -rotate-90" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  fill="none"
                  stroke="rgb(6 182 212)"
                  strokeWidth="1.5"
                  strokeDasharray={44}
                  strokeDashoffset={44 - (44 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-none"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function CarWashTestimonials() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <section className="py-20 md:py-28 relative overflow-x-clip">
      {/* 배경 그라데이션 블롭 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="grid items-end gap-16 md:grid-cols-12">
          {/* 좌측: 헤딩 */}
          <motion.div
            ref={headingRef}
            className="md:order-1 md:col-span-4"
            initial="hidden"
            animate={headingInView ? 'visible' : 'hidden'}
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.span
              className="text-cyan-500 mb-6 block font-mono text-xs font-medium tracking-wider uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              실제 고객 후기
            </motion.span>

            <motion.h2
              className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={
                headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}
              }
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              직접 경험한
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                이야기들
              </span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed md:text-base"
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={
                headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}
              }
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              제주도 곳곳에서 찾아오는 고객분들의 솔직한 경험담입니다. 매일
              쌓아온 신뢰가 제라게의 가장 큰 자산입니다.
            </motion.p>

            {/* 총계 카드 */}
            <motion.div
              className="mt-8 rounded-xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-cyan-400 stroke-cyan-400"
                  />
                ))}
              </div>
              <p className="text-2xl font-extrabold tracking-tight">
                4.9{' '}
                <span className="text-muted-foreground text-base font-normal">
                  / 5.0
                </span>
              </p>
              <p className="text-muted-foreground text-xs mt-1 font-mono">
                누적 리뷰 · 재방문율 87%
              </p>
            </motion.div>
          </motion.div>

          {/* 우측: 카드 스택 */}
          <motion.div
            className="flex md:order-2 md:col-span-8 lg:justify-end"
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            animate={
              headingInView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 24, filter: 'blur(4px)' }
            }
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TestimonialCardStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
