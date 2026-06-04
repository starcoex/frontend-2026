import React from 'react';
import { motion } from 'motion/react';
import {
  Droplets,
  Sparkles,
  Wind,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { ZeragaeLogo } from '@starcoex-frontend/common';

// ─── 애니메이션 상수 (각 페이지에서 import해서 재사용) ────────────────────────

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// ─── 서비스 피처 카드 데이터 ──────────────────────────────────────────────────

const SERVICE_FEATURES = [
  {
    icon: <Clock className="w-4 h-4" />,
    title: '실시간 대기 현황',
    description: '지금 바로 확인하세요',
    badge: 'LIVE',
  },
  {
    icon: <Droplets className="w-4 h-4" />,
    title: '프리미엄 세차',
    description: '전문 케어 서비스',
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    title: '간편 예약',
    description: '빠른 온라인 예약',
  },
  {
    icon: <Star className="w-4 h-4" />,
    title: '멤버십 혜택',
    description: '별 적립으로 무료 세차',
  },
] as const;

// ─── 플로팅 물방울 ────────────────────────────────────────────────────────────

interface FloatingDropProps {
  size: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
}

const FloatingDrop: React.FC<FloatingDropProps> = ({
  size,
  delay,
  duration,
  x,
  y,
}) => (
  <motion.div
    className={`absolute ${size} rounded-full bg-white/10`}
    style={{ left: x, top: y }}
    animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ─── 좌측 Editorial 패널 ──────────────────────────────────────────────────────

export const AuthEditorialPanel: React.FC = () => (
  <div className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-800">
    {/* 배경 이미지 오버레이 */}
    <div className="absolute inset-0 bg-[url('/images/auth/car-wash-bg.webp')] bg-cover bg-center opacity-10 mix-blend-overlay" />

    {/* 블롭 */}
    <motion.div
      className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"
      animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl"
      animate={{ scale: [1.1, 1, 1.1], y: [0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* 플로팅 물방울 */}
    <FloatingDrop size="w-3 h-3" delay={0} duration={4} x="20%" y="30%" />
    <FloatingDrop size="w-5 h-5" delay={1.5} duration={6} x="75%" y="20%" />
    <FloatingDrop size="w-2 h-2" delay={0.8} duration={5} x="60%" y="60%" />
    <FloatingDrop size="w-4 h-4" delay={2} duration={7} x="35%" y="75%" />

    {/* 콘텐츠 */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative z-10 flex h-full flex-col justify-between"
    >
      {/* 상단: 브랜드 */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <ZeragaeLogo width={40} height={40} />
          {/*<Droplets className="w-5 h-5 text-white" />*/}
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">제라게</p>
          <p className="text-white/60 text-xs">CarCare Service</p>
        </div>
      </motion.div>

      {/* 중간: 서비스 카드 그리드 */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        {SERVICE_FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            custom={i}
            className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                {feature.icon}
              </div>
              {'badge' in feature && feature.badge && (
                <span className="text-[9px] font-bold text-cyan-200 bg-white/20 rounded-full px-1.5 py-0.5">
                  {feature.badge}
                </span>
              )}
            </div>
            <p className="text-white text-sm font-semibold">{feature.title}</p>
            <p className="text-white/60 text-xs mt-0.5">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 하단: 슬로건 */}
      <div>
        <motion.p
          className="text-white/80 text-2xl leading-snug tracking-tight xl:text-3xl font-light"
          variants={fadeUp}
        >
          &ldquo;깨끗한 차, 상쾌한 하루&mdash;
          <br />
          제라게와 함께 시작하세요.&rdquo;
        </motion.p>
        <motion.div className="mt-6 h-px w-10 bg-white/40" variants={fadeUp} />
        <motion.div className="flex items-center gap-2 mt-4" variants={fadeUp}>
          {[Wind, Sparkles, Star].map((Icon, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Icon className="w-3 h-3 text-white/60" />
            </div>
          ))}
          <p className="text-white/40 font-mono text-[10px] tracking-wider uppercase ml-2">
            Premium Car Care
          </p>
        </motion.div>
      </div>
    </motion.div>
  </div>
);
