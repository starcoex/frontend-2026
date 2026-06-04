import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';

const BASE = 0.2;
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease },
});

export function AboutCta() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16 md:py-24 bg-gradient-to-br from-cyan-600 via-blue-700 to-cyan-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* 배경 사진 */}
          <img
            src="/images/about/cta-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          />

          <div className="relative z-10">
            <motion.p
              className="text-white/50 mb-6 font-mono text-xs tracking-wider uppercase"
              {...fadeUp(BASE)}
            >
              제주 별표주유소 · 제라게 카케어
            </motion.p>

            <motion.h2
              className="text-white mx-auto max-w-2xl text-3xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
              {...fadeUp(BASE + 0.1)}
            >
              더러운 차를 맡겨두고{' '}
              <span className="text-cyan-300">주유하세요.</span>
            </motion.h2>

            <motion.p
              className="text-white/50 mx-auto mt-6 max-w-md text-sm leading-relaxed md:text-base"
              {...fadeUp(BASE + 0.2)}
            >
              주유하는 10분 동안 세차가 완성됩니다. 예약 없이 즉시 접수, 4베이
              동시 운영.
            </motion.p>

            <motion.div
              className="mt-10 mx-auto flex w-[min(100%,28rem)] flex-col gap-3 sm:flex-row sm:justify-center"
              {...fadeUp(BASE + 0.3)}
            >
              <Button
                size="lg"
                className="flex-1 bg-white hover:bg-white/90 text-cyan-700 font-bold"
                onClick={() => navigate(APP_CONFIG.routes.speed)}
              >
                <Zap className="w-4 h-4 mr-2" />
                10분 세차 시작
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate(APP_CONFIG.routes.premium)}
              >
                <Droplets className="w-4 h-4 mr-2" />
                프리미엄 예약
              </Button>
            </motion.div>

            <motion.p
              className="text-white/30 mt-6 font-mono text-[0.625rem] tracking-wider"
              {...fadeUp(BASE + 0.4)}
            >
              예약 불필요 &middot; 실시간 대기 확인 &middot; 주유 3만원 이상
              기본 요금 적용
            </motion.p>
          </div>

          {/* 브랜드 워터마크 */}
          <div
            className="absolute right-6 bottom-6 z-10 flex items-center gap-2 opacity-20"
            aria-hidden
          >
            <Droplets className="w-3 h-3 text-white" />
            <span className="text-white text-sm font-bold">제라게</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
