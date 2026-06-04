import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay, ease },
});

export function CarWashCta() {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-24">
      <div className="relative container">
        {/* 장식 — 샘플의 & 기호 패턴 → 물방울 기호 */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute top-8 left-1/2 -translate-x-1/2 -translate-y-2/3 text-[12rem] leading-none tracking-tighter md:text-[20rem] font-extrabold text-cyan-500/[0.06] dark:text-cyan-400/[0.08]"
        >
          💧
        </span>

        {/* 배경 블롭 */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl" />
        </motion.div>

        {/* CTA 본문 */}
        <div className="relative text-center">
          {/* 상단 레이블 */}
          <motion.span
            className="text-cyan-500 mb-8 inline-block font-mono text-xs font-medium tracking-wider uppercase"
            {...fadeUp(0)}
          >
            지금 바로 · 예약 없이 · 10분 완성
          </motion.span>

          {/* 헤드라인 — 샘플 pull-quote 패턴 */}
          <motion.h2
            className="mx-auto max-w-4xl text-4xl leading-none tracking-tighter font-extrabold md:text-6xl lg:text-7xl"
            {...fadeUp(0.08)}
          >
            더러운 차,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              10분이면
            </span>
            <br />
            충분합니다.
          </motion.h2>

          {/* 서브 카피 */}
          <motion.p
            className="text-muted-foreground mx-auto mt-8 max-w-lg text-base leading-relaxed"
            {...fadeUp(0.16)}
          >
            예약 없이 바로 접수, 4개 베이 동시 운영. 제주에서 가장 빠르고 꼼꼼한
            외부 손세차를 지금 경험하세요.
          </motion.p>

          {/* 버튼 그룹 */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            {...fadeUp(0.24)}
          >
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-xl shadow-cyan-500/30 px-8 h-13 text-base"
              onClick={() => navigate(APP_CONFIG.routes.speed)}
            >
              <Zap className="w-5 h-5 mr-2" />
              10분 세차 시작
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 text-base"
              onClick={() => navigate(APP_CONFIG.routes.premium)}
            >
              <Droplets className="w-4 h-4 mr-2" />
              프리미엄 예약
            </Button>
          </motion.div>

          {/* 안심 문구 — 샘플의 "Free forever" 패턴 */}
          <motion.p
            className="text-muted-foreground mt-5 font-mono text-xs"
            {...fadeUp(0.32)}
          >
            예약 불필요&nbsp;&middot;&nbsp;대기 현황 실시간
            확인&nbsp;&middot;&nbsp;주유 3만원 이상 시 세차 할인
          </motion.p>

          {/* 구분선 + 카드 혜택 배너 */}
          <motion.div
            className="mx-auto mt-16 max-w-sm rounded-2xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 px-6 py-5"
            {...fadeUp(0.38)}
          >
            <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase mb-2">
              💳 세차 전용 카드
            </p>
            <p className="text-lg font-extrabold tracking-tight">
              5만원 결제 시 <span className="text-cyan-500">59,000원 적립</span>
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              단골 고객 전용 · 환불불가 · 지금 문의하세요
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
