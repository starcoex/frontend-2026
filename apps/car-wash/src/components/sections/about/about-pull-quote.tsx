import { motion } from 'motion/react';

const QUOTE =
  '주유하고 나오면 차가 반짝이고 있어요. 제주에서 이런 세차장을 만날 줄 몰랐습니다. 이제 단골이 됐어요.';

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutPullQuote() {
  const words = QUOTE.split(' ');

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16">
          {/* 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-cyan-800" />
          <img
            src="/images/about/quote-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
          />

          <div className="relative z-10">
            {/* 따옴표 */}
            <motion.span
              className="text-white/20 text-6xl leading-none select-none md:text-7xl font-serif"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease }}
            >
              &ldquo;
            </motion.span>

            {/* 단어별 reveal — pull-quote.tsx 동일 패턴 */}
            <p className="-mt-6 max-w-3xl text-2xl leading-snug tracking-tight font-medium text-white md:text-3xl lg:text-4xl">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, filter: 'blur(4px)', y: 8 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </p>

            {/* 작성자 */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: words.length * 0.03 + 0.2,
                ease,
              }}
            >
              <p className="text-white text-sm font-semibold">김민준</p>
              <p className="text-white/50 font-mono text-xs tracking-wider uppercase">
                제주시 거주 · 기본 손세차 단골
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
