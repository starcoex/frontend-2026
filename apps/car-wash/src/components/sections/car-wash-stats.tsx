import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Award, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';
import { cn } from '@/lib/utils';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const MILESTONES = [
  {
    number: '01',
    icon: <Droplets className="w-4 h-4" />,
    title: '2년, 매일 60대 이상',
    description:
      '2023년 첫 베이를 열고 지금까지 단 하루도 쉬지 않았습니다. 하루 평균 60대 이상, 누적 4만 대를 넘어섰습니다. 빠른 회전율과 꼼꼼한 품질 — 둘 다 포기하지 않았습니다.',
    accentColor: 'text-cyan-500',
    lineColor: 'bg-cyan-500/30 group-hover:bg-cyan-500/60',
  },
  {
    number: '02',
    icon: <Award className="w-4 h-4" />,
    title: '전문 교육 이수, 검증된 기술',
    description:
      '국내 세차 전문 과정을 이수한 디테일러가 직접 작업합니다. 양모미트 핸드워시부터 코팅왁스 분사, 극세사 마무리까지 — 기계가 아닌 사람의 손으로, 매 차량 동일한 기준으로 완성합니다.',
    accentColor: 'text-green-500',
    lineColor: 'bg-green-500/30 group-hover:bg-green-500/60',
  },
  {
    number: '03',
    icon: <MapPin className="w-4 h-4" />,
    title: '제주 유일, 이 퀄리티',
    description:
      '온수 고압 예비세정 → 버블도포 → 핸드워시 → 에어건조 → 극세사 마무리까지 전 공정을 갖춘 외부 손세차 전문점은 제주에서 제라게뿐입니다. 주유소 안에 있어 연계 할인도 받으세요.',
    accentColor: 'text-orange-500',
    lineColor: 'bg-orange-500/30 group-hover:bg-orange-500/60',
  },
  {
    number: '04',
    icon: <Sparkles className="w-4 h-4" />,
    title: '전문 디테일링, 예약제 운영',
    description:
      '실내 크리닝, 유막제거, 광택·PPF 시공이 필요하다면 전문 디테일링 예약을 이용하세요. 외부 손세차와 달리 사전 예약 후 충분한 시간을 확보해 완성도를 높입니다.',
    accentColor: 'text-purple-500',
    lineColor: 'bg-purple-500/30 group-hover:bg-purple-500/60',
  },
] as const;

const STATS = [
  { number: '40,000+', label: '누적 세차 대수' },
  { number: '2년+', label: '운영 경력' },
  { number: '87%', label: '고객 재방문율' },
  { number: '4.9', label: '고객 평점' },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function CarWashStats() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: {} }}
        >
          {/* ── 헤더 */}
          <motion.div
            className="mb-12 md:mb-20"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <motion.span
              className="text-cyan-500 mb-6 block font-mono text-xs font-medium tracking-wider uppercase"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              제라게 카케어 · 제주 별표주유소
            </motion.span>
            <h2 className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl">
              숫자로 증명합니다
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
              말보다 경험이 먼저입니다. 2년간 쌓아온 기록이 제라게의 품질을
              말해줍니다.
            </p>
          </motion.div>

          {/* ── 2컬럼 그리드 */}
          <motion.div
            className="grid gap-16 md:grid-cols-12"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2, delayChildren: 0.3 },
              },
            }}
          >
            {/* ── 좌측: 핵심 지표 */}
            <motion.div
              className="md:col-span-5"
              variants={{
                hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease },
                },
              }}
            >
              {/* 히어로 스탯 */}
              <motion.div
                className="mb-12"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="text-cyan-500 text-7xl font-extrabold leading-none tracking-tighter md:text-8xl lg:text-[9rem]">
                  40,000
                  <span className="text-5xl md:text-6xl lg:text-7xl">+</span>
                </span>
                <span className="text-muted-foreground mt-2 block font-mono text-sm tracking-wider uppercase">
                  누적 세차 대수
                </span>
                <span className="text-muted-foreground mt-1 block font-mono text-xs">
                  하루 평균 60대 이상 · 2년 연속 무휴
                </span>
              </motion.div>

              {/* 보조 지표 */}
              <div className="grid grid-cols-3 gap-6 border-t border-dashed pt-8">
                {STATS.slice(1).map((stat) => (
                  <div key={stat.label} className="group/stat">
                    <div className="transition-transform duration-300 group-hover/stat:-translate-y-1">
                      <span className="text-3xl font-extrabold leading-none tracking-tight md:text-4xl">
                        {stat.number}
                      </span>
                      <span className="text-muted-foreground mt-1 block font-mono text-xs tracking-wider uppercase">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 에디토리얼 카드 */}
              <motion.div
                className="mt-10 rounded-xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="text-cyan-500 font-mono text-[0.625rem] font-medium tracking-wider uppercase">
                    지금 바로
                  </span>
                </div>
                <p className="text-base leading-snug tracking-tight md:text-lg font-semibold">
                  예약 없이 즉시 접수.
                  <br />
                  10분이면 깨끗해집니다.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-sm shadow-cyan-500/25"
                    onClick={() => navigate(APP_CONFIG.routes.speed)}
                  >
                    10분 세차 시작
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(APP_CONFIG.routes.premium)}
                  >
                    디테일링 예약
                  </Button>
                </div>
              </motion.div>

              {/* 주의사항 미니 카드 */}
              <motion.div
                className="mt-4 rounded-xl border bg-muted/30 p-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="font-mono text-[0.625rem] text-muted-foreground tracking-wider uppercase mb-2">
                  세차 전용 카드 혜택
                </p>
                <p className="text-sm font-semibold">
                  5만원 결제 시{' '}
                  <span className="text-cyan-500">59,000원 적립</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  앞유리 유막제거 1만원 · 환불불가
                </p>
              </motion.div>
            </motion.div>

            {/* ── 우측: 마일스톤 */}
            <motion.div
              className="space-y-12 md:col-span-6 md:col-start-7 md:border-l md:border-dashed md:pl-12"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={milestone.number}
                  className="group"
                  variants={{
                    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.5, ease },
                    },
                  }}
                >
                  <div className="flex items-baseline gap-4">
                    {/* 번호 + 아이콘 */}
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          'text-3xl font-extrabold leading-none tracking-tight transition-transform duration-300 group-hover:scale-110 md:text-4xl',
                          milestone.accentColor
                        )}
                      >
                        {milestone.number}
                      </span>
                      <span
                        className={cn(
                          'transition-colors duration-300',
                          milestone.accentColor
                        )}
                      >
                        {milestone.icon}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        'text-xl leading-snug tracking-tight transition-colors duration-300 md:text-2xl font-bold',
                        `group-hover:${milestone.accentColor}`
                      )}
                    >
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground/70 mt-3 text-sm leading-relaxed transition-colors duration-300">
                    {milestone.description}
                  </p>
                  {i < MILESTONES.length - 1 && (
                    <div
                      className={cn(
                        'mt-12 h-px w-12 transition-[width,background-color] duration-300 group-hover:w-20',
                        milestone.lineColor
                      )}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
