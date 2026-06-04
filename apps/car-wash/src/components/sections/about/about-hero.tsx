import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/app/config/app.config';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay, ease },
});

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : ['0%', '20%']
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 1.08]
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-20 lg:min-h-[max(60vh,640px)] lg:pt-36"
    >
      {/* 배경 이미지 — 실제 세차장 전경 사진으로 교체 */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src="/images/about/hero-carwash.webp"
          alt=""
          className="w-full h-full object-cover object-center opacity-40"
        />
      </motion.div>

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

      {/* 콘텐츠 */}
      <div className="relative z-10 container">
        <div className="max-w-xl">
          <motion.div {...fadeUp(0.2)}>
            <Badge
              variant="outline"
              className="mb-6 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400"
            >
              제라게 카케어 소개
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
            {...fadeUp(0.3)}
          >
            손으로 직접,
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
            {...fadeUp(0.38)}
          >
            매일 동일하게.
          </motion.p>

          <motion.p
            className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed md:text-lg"
            {...fadeUp(0.46)}
          >
            제주 별표주유소 안에서 시작한 작은 세차장. 2년간 하루도 쉬지 않고
            4만 대를 닦았습니다. 기계가 아닌 사람의 손으로, 매 차량 같은
            기준으로.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            {...fadeUp(0.54)}
          >
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
              variant="outline"
              onClick={() => navigate(APP_CONFIG.routes.premium)}
            >
              <Droplets className="w-4 h-4 mr-2" />
              프리미엄 예약
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
