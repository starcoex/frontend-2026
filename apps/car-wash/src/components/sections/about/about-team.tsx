import { motion } from 'motion/react';

const TEAM = [
  {
    name: '김현진',
    role: '대표 · 수석 디테일러',
    avatar: '/images/about/team/owner.webp',
    description: '세차 전문 과정 이수. 직접 작업하는 현장 대표.',
  },
  {
    name: '전문 디테일러',
    role: '외부 손세차 전담',
    avatar: '/images/about/team/detailer.webp',
    description: '기본·별표·반짝 3개 코스 전담 작업.',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function TeamCard({
  name,
  role,
  avatar,
  description,
}: {
  name: string;
  role: string;
  avatar: string;
  description: string;
}) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, filter: 'blur(3px)' }}
          whileInView={{ scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
        {/* 하단 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="text-base leading-tight text-white font-bold md:text-lg">
            {name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/60 md:text-sm">
            {role}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-xs mt-3 leading-relaxed px-1">
        {description}
      </p>
    </div>
  );
}

export function AboutTeam() {
  return (
    <section id="team" className="py-20 md:py-28 scroll-mt-20">
      <div className="container">
        {/* 헤더 */}
        <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
              팀 소개
            </span>
            <h2 className="text-3xl leading-none tracking-tighter font-extrabold md:text-4xl lg:text-5xl">
              작은 팀, <span className="text-muted-foreground">큰 기준.</span>
            </h2>
          </motion.div>
          <motion.p
            className="text-muted-foreground self-end text-sm leading-relaxed md:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            대표가 직접 작업합니다. 중간 관리자 없이 고객과 직접 소통하고, 매
            차량 동일한 기준으로 마무리합니다.
          </motion.p>
        </div>

        {/* 팀 그리드 */}
        <motion.div
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {TEAM.map((member) => (
            <motion.div
              key={member.name}
              variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease },
                },
              }}
            >
              <TeamCard {...member} />
            </motion.div>
          ))}

          {/* 비어있는 슬롯 2개 — 세차 코스 홍보 */}
          {(['기본 손세차', '반짝 손세차'] as const).map((label) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease },
                },
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-dashed border-cyan-200 dark:border-cyan-800 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-cyan-500 text-2xl font-extrabold">
                    {label}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    베이 운영 중
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
