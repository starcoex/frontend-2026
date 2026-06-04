import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, ChevronRight } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';
import { cn } from '@/lib/utils';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

type VehicleType = 'sedan' | 'sedan_large' | 'suv' | 'suv_large' | 'staria';

const VEHICLE_TYPES: { id: VehicleType; label: string; emoji: string }[] = [
  { id: 'sedan', label: '승용차', emoji: '🚗' },
  { id: 'sedan_large', label: '승용차 대형', emoji: '🚙' },
  { id: 'suv', label: 'SUV', emoji: '🚐' },
  { id: 'suv_large', label: 'SUV 대형', emoji: '🚌' },
  { id: 'staria', label: '스타리아급 특대형', emoji: '🚎' },
];

type CourseId = 'basic' | 'star' | 'shine';

interface Course {
  id: CourseId;
  number: string;
  label: string;
  duration: string;
  badge: string | null;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  prices: Record<VehicleType, number>;
  steps: string[];
  highlight: string | null;
  pros: string | null;
  cons: string | null;
}

const COURSES: Course[] = [
  {
    id: 'basic',
    number: '01',
    label: '기본 외부 손세차',
    duration: '8–9분',
    badge: null,
    accentColor: 'from-rose-500 to-rose-600',
    accentBg: 'bg-rose-50 dark:bg-rose-950/30',
    accentBorder: 'border-rose-200 dark:border-rose-800',
    accentText: 'text-rose-500',
    prices: {
      sedan: 15000,
      sedan_large: 17000,
      suv: 17000,
      suv_large: 20000,
      staria: 25000,
    },
    steps: [
      '예비세정 : 온수고압 꼼꼼세차',
      '풍성풍성 버블도포',
      '양모미트 작업',
      '아주 쎈 고압물 분사',
      '전용타월 건조',
    ],
    highlight: '극세사 타월로 잔물기제거 마무리',
    pros: '빠르고 깨끗함 (8–9분)',
    cons: '틈새에 물기 남아 있음',
  },
  {
    id: 'star',
    number: '02',
    label: '별표 외부 손세차',
    duration: '12분',
    badge: 'Best 추천',
    accentColor: 'from-green-500 to-green-600',
    accentBg: 'bg-green-50 dark:bg-green-950/30',
    accentBorder: 'border-green-200 dark:border-green-800',
    accentText: 'text-green-500',
    prices: {
      sedan: 20000,
      sedan_large: 22000,
      suv: 22000,
      suv_large: 25000,
      staria: 30000,
    },
    steps: [
      '코팅왁스 분사',
      '아주 쎈 고압물 분사',
      '온풍 에어건조',
      '극세사 타월로 잔물기제거 마무리',
    ],
    highlight: null,
    pros: null,
    cons: null,
  },
  {
    id: 'shine',
    number: '03',
    label: '반짝반짝 외부 손세차',
    duration: '15분',
    badge: null,
    accentColor: 'from-orange-500 to-orange-600',
    accentBg: 'bg-orange-50 dark:bg-orange-950/30',
    accentBorder: 'border-orange-200 dark:border-orange-800',
    accentText: 'text-orange-500',
    prices: {
      sedan: 25000,
      sedan_large: 27000,
      suv: 27000,
      suv_large: 30000,
      staria: 35000,
    },
    steps: [
      '예비세정 : 버블분사 휠세척 온수고압세척',
      '별표외부손세차',
      '타이어 드레싱',
    ],
    highlight: null,
    pros: null,
    cons: null,
  },
];

const NOTICES = [
  'PPF 차량은 쎈고압분사로 비닐이 벗겨질 수 있습니다.',
  '도장불량이나 돌빵이 있으면 차량페인트가 벗겨질 수 있습니다.',
  '위 두가지 사항은 책임지지 않습니다.',
  '오염도가 심할 경우(새똥, 벌레, 진흙 등) 추가 1–3만원 있습니다.',
  '세차만 하시는 고객님은 2천원 추가됩니다.',
];

const ease = [0.22, 1, 0.36, 1] as const;

// ─── 차종 선택기 ──────────────────────────────────────────────────────────────

function VehicleSelector({
  selected,
  onChange,
}: {
  selected: VehicleType;
  onChange: (v: VehicleType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {VEHICLE_TYPES.map((v) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200',
            selected === v.id
              ? 'border-cyan-500 bg-cyan-500 text-white shadow-sm shadow-cyan-500/25'
              : 'border-border bg-background text-muted-foreground hover:border-cyan-300 hover:text-foreground'
          )}
        >
          <span>{v.emoji}</span>
          <span>{v.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── 코스 카드 ────────────────────────────────────────────────────────────────

function CourseCard({
  course,
  vehicle,
  selected,
  onSelect,
  index,
}: {
  course: Course;
  vehicle: VehicleType;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const price = course.prices[vehicle];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.5, delay: index * 0.08, ease },
        },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative cursor-pointer"
      onClick={onSelect}
    >
      {/* Best 추천 뱃지 */}
      {course.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
            ⭐ {course.badge}
          </span>
        </div>
      )}

      <div
        className={cn(
          'rounded-2xl border-2 p-6 transition-all duration-200',
          selected
            ? `${course.accentBorder} ${course.accentBg}`
            : 'border-border bg-card hover:border-muted-foreground/30'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className={cn(
                'font-mono text-[0.625rem] font-medium tracking-wider',
                course.accentText
              )}
            >
              {course.number}
            </span>
            <h3 className="text-lg font-bold mt-0.5">{course.label}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              작업시간: {course.duration} 소요
            </p>
          </div>
          {/* 선택 체크 */}
          <div
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
              selected
                ? `border-transparent bg-gradient-to-br ${course.accentColor}`
                : 'border-border'
            )}
          >
            {selected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>

        {/* 가격 — 애니메이션 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${course.id}-${vehicle}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease }}
            className="mb-5"
          >
            <span
              className={cn(
                'text-4xl font-extrabold tracking-tight',
                course.accentText
              )}
            >
              {price.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm ml-1">원</span>
          </motion.div>
        </AnimatePresence>

        {/* 공정 목록 */}
        <ul className="space-y-1.5">
          {course.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span
                className={cn(
                  'shrink-0 font-mono text-[10px] font-bold mt-0.5',
                  course.accentText
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  course.highlight === step
                    ? 'font-semibold text-foreground'
                    : ''
                )}
              >
                {step}
              </span>
            </li>
          ))}
        </ul>

        {/* 장단점 */}
        {(course.pros || course.cons) && (
          <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2">
            {course.pros && (
              <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                ✓ {course.pros}
              </span>
            )}
            {course.cons && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                △ {course.cons}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function PricingPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleType>('sedan');
  const [selectedCourse, setSelectedCourse] = useState<CourseId | null>('star');

  const selected = COURSES.find((c) => c.id === selectedCourse);

  return (
    <>
      <PageHead
        title={`가격표 - ${APP_CONFIG.seo.siteName}`}
        description="제라게 카케어 외부 손세차 가격표. 기본·별표·반짝 3가지 코스, 차종별 요금 안내."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/pricing`}
        robots="index, follow"
      />

      <div className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ hidden: {}, visible: {} }}
          >
            {/* ── 헤더 */}
            <motion.div
              className="mb-12 md:mb-20 md:flex md:items-end md:justify-between gap-8"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease }}
            >
              <div>
                <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
                  가격표 · 세차전용카드 결제 기준
                </span>
                <h1 className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl">
                  내 차에 맞는{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    코스 선택
                  </span>
                </h1>
                <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
                  주유 3만원 이상 또는 세차 전용 카드 결제 기준.
                  <br className="hidden md:block" />
                  세차만 이용 시 2천원이 추가됩니다.
                </p>
              </div>

              {/* 앞유리 유막제거 배지 */}
              <motion.div
                className="mt-6 md:mt-0 shrink-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease }}
              >
                <div className="rounded-2xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-5 py-4 text-right">
                  <p className="text-red-500 font-mono text-[10px] font-bold tracking-wider uppercase mb-1">
                    추가 서비스
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight">
                    앞유리 유막제거
                  </p>
                  <p className="text-red-500 font-bold text-xl">1만원 ★★★★</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── 차종 선택기 */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            >
              <p className="text-muted-foreground font-mono text-[0.625rem] tracking-wider uppercase mb-3">
                차종 선택 → 요금 자동 계산
              </p>
              <VehicleSelector selected={vehicle} onChange={setVehicle} />
            </motion.div>

            {/* ── 코스 카드 3개 */}
            <motion.div
              className="grid md:grid-cols-3 gap-5 mb-12"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {COURSES.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  vehicle={vehicle}
                  selected={selectedCourse === course.id}
                  onSelect={() => setSelectedCourse(course.id)}
                  index={i}
                />
              ))}
            </motion.div>

            {/* ── 선택된 코스 CTA */}
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease }}
                  className={cn(
                    'rounded-2xl border-2 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12',
                    selected.accentBorder,
                    selected.accentBg
                  )}
                >
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">
                      선택한 코스
                    </p>
                    <p className="text-xl font-bold">
                      {selected.label}
                      <span className="text-muted-foreground font-normal text-base ml-2">
                        ({VEHICLE_TYPES.find((v) => v.id === vehicle)?.label})
                      </span>
                    </p>
                    <p
                      className={cn(
                        'text-3xl font-extrabold mt-1',
                        selected.accentText
                      )}
                    >
                      {selected.prices[vehicle].toLocaleString()}원
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25 shrink-0"
                    onClick={() => navigate(APP_CONFIG.routes.speed)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    지금 접수하기
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── 구분선 */}
            <div className="bg-foreground/10 h-px mb-12" />

            {/* ── 하단 2컬럼: 주의사항 + 카드 혜택 */}
            <motion.div
              className="grid sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              {/* 주의사항 */}
              <div className="rounded-2xl border bg-muted/30 p-6">
                <p className="text-muted-foreground font-mono text-[0.625rem] font-medium tracking-wider uppercase mb-4">
                  주의사항
                </p>
                <ol className="space-y-2">
                  {NOTICES.map((note, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="shrink-0 font-mono text-[10px] font-bold text-foreground/40 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {note}
                    </li>
                  ))}
                </ol>
              </div>

              {/* 카드 혜택 */}
              <div className="rounded-2xl border bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-cyan-500 font-mono text-[0.625rem] font-medium tracking-wider uppercase mb-4">
                    💳 세차 전용 카드 혜택
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight">
                    5만원 결제 시<br />
                    <span className="text-cyan-500">59,000원 적립!</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (환불불가)
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-cyan-200 dark:border-cyan-800">
                  <p className="text-sm font-semibold">💡 TIP</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    세차 전용 카드 이용 시 5만원 결제로 59,000원 적립.
                    단골일수록 더 이득입니다.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
