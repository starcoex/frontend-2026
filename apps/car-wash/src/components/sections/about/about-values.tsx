import { motion } from 'motion/react';

const VALUES = [
  {
    title: '손으로 직접, 타협 없이',
    description:
      '기계 세차는 빠르지만 틈새와 몰딩을 놓칩니다. 저희는 양모미트로 직접 닦습니다. 빠르면서도 꼼꼼한 것, 둘 다를 포기하지 않습니다.',
  },
  {
    title: '시간을 아끼는 서비스',
    description:
      '예약 없이 접수, 실시간 대기 현황 앱 확인. 고객이 주유하는 10분 동안 세차가 완성됩니다. 기다리는 시간을 낭비가 아닌 주유 시간으로.',
  },
  {
    title: '제주에서 검증된 퀄리티',
    description:
      '온수 고압 예비세정부터 극세사 마무리까지 5단계 공정. 제주 유일 외부 손세차 전문 5단계 공정. 2년간 4만 대가 증명합니다.',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutValues() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid overflow-hidden rounded-3xl md:grid-cols-2">
          {/* 좌측 — 실제 세차 작업 사진으로 교체 */}
          <div className="relative min-h-72 md:min-h-0 bg-gradient-to-br from-cyan-600 to-blue-800">
            <img
              src="/images/about/values-wash.webp"
              alt="제라게 카케어 작업 현장"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 오버레이 텍스트 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="text-white font-mono text-[10px] tracking-wider uppercase opacity-70">
                실제 작업 현장
              </span>
              <p className="text-white text-lg font-bold mt-1">
                별표주유소 · 제라게 카케어
              </p>
            </div>
          </div>

          {/* 우측 — values */}
          <div className="bg-cyan-50 dark:bg-cyan-950/20 p-8 md:p-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.25 } },
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease },
                  },
                }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 rounded-full px-3 py-1 font-mono tracking-wider uppercase">
                  우리가 믿는 것
                </span>
              </motion.div>

              {VALUES.map((value, i) => (
                <motion.div
                  key={value.title}
                  className="mt-8 first:mt-0"
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.6, ease },
                    },
                  }}
                >
                  <h3 className="text-lg leading-snug tracking-tight font-bold md:text-xl">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {value.description}
                  </p>
                  {i < VALUES.length - 1 && (
                    <div className="bg-cyan-500/20 mt-8 h-px w-12" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
