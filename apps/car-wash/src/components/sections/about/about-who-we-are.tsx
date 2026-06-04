import { motion } from 'motion/react';

const STATS = [
  { number: '40,000+', label: '누적 세차 대수', highlight: true },
  { number: '2년+', label: '무휴 운영', highlight: false },
  { number: '4베이', label: '동시 운영', highlight: true },
  { number: '4.9', label: '고객 평점', highlight: false },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutWhoWeAre() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* 헤더 — who-we-are 2컬럼 패턴 */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
              우리는 누구인가
            </span>
            <h2 className="text-3xl leading-none tracking-tighter font-extrabold md:text-4xl lg:text-5xl">
              제주에서 가장{' '}
              <span className="text-muted-foreground">꼼꼼한 손</span>
            </h2>
          </motion.div>

          <motion.div
            className="self-end"
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              세차 전문 과정을 이수한 디테일러가 직접 작업합니다. 주유소 옆 작은
              공간에서 시작했지만, 제주에서 이 수준의 외부 손세차 전문점은
              저희뿐입니다. 브랜드가 아닌 사람이 만드는 신뢰입니다.
            </p>
          </motion.div>
        </div>

        {/* 지표 카드 — who-we-are 프로스트 글라스 패턴 */}
        <div className="relative min-h-72 md:min-h-80 flex items-center overflow-hidden rounded-3xl px-6 py-6 md:px-14 md:py-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50/50 to-cyan-50 dark:from-cyan-950/40 dark:via-blue-950/30 dark:to-cyan-950/40" />
          <img
            src="/images/about/stats-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply dark:opacity-5"
          />
          <div className="relative z-10 grid w-full grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={`rounded-2xl text-center backdrop-blur-xl p-5 sm:p-8 ${
                  stat.highlight
                    ? 'bg-white/60 dark:bg-gray-900/60'
                    : 'bg-white/40 dark:bg-gray-900/40'
                }`}
                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease }}
              >
                <span
                  className={`block leading-none tracking-tight font-extrabold ${
                    stat.highlight
                      ? 'text-cyan-500 text-4xl md:text-5xl'
                      : 'text-3xl md:text-4xl text-foreground'
                  }`}
                >
                  {stat.number}
                </span>
                <span className="text-foreground/60 mt-4 block text-xs md:text-sm">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 카드 혜택 배너 — who-we-are hiring 배너 패턴 */}
        <motion.div
          className="mt-4 rounded-3xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold md:text-base mb-1">
                💳 세차 전용 카드로 더 스마트하게
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
                5만원 결제 시 59,000원 어치 세차. 단골 고객일수록 이득입니다.
              </p>
            </div>
            <div className="shrink-0">
              <span className="text-xl font-extrabold text-cyan-500">
                5만원 → 59,000원 적립
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
