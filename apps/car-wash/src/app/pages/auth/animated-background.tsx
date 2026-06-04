import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Droplets,
  Sparkles,
  Wind,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface FloatingIconProps {
  icon: React.ReactNode;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

// ─── 데스크톱 감지 ────────────────────────────────────────────────────────────

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isDesktop;
};

// ─── 플로팅 아이콘 ────────────────────────────────────────────────────────────

const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  delay,
  duration,
  x,
  y,
}) => (
  <motion.div
    className="absolute text-cyan-400/30 dark:text-cyan-300/20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      y: [y, y - 80, y - 180, y - 280],
      x: [x, x + 15, x - 15, x],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {icon}
  </motion.div>
);

// ─── 세차 서비스 정보 카드 (유가 티커 역할) ──────────────────────────────────

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  side: 'left' | 'right';
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  badge,
  side,
  delay,
}) => (
  <motion.div
    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-cyan-100 dark:border-cyan-900/50 rounded-xl px-4 py-3 shadow-lg min-w-[180px]"
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
        {icon}
      </div>
      {badge && (
        <span className="text-[10px] font-bold text-white bg-cyan-500 rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </div>
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
      {title}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
      {description}
    </p>
  </motion.div>
);

// ─── 왼쪽/오른쪽 서비스 카드 패널 ────────────────────────────────────────────

const CarWashServiceCards: React.FC = () => {
  const leftCards: Omit<ServiceCardProps, 'side'>[] = [
    {
      icon: <Clock className="w-4 h-4" />,
      title: '실시간 대기 현황',
      description: '지금 바로 확인하세요',
      badge: 'LIVE',
      delay: 0.2,
    },
    {
      icon: <Droplets className="w-4 h-4" />,
      title: '프리미엄 세차',
      description: '전문 케어 서비스',
      delay: 0.35,
    },
  ];

  const rightCards: Omit<ServiceCardProps, 'side'>[] = [
    {
      icon: <CheckCircle className="w-4 h-4" />,
      title: '예약 완료',
      description: '빠른 온라인 예약',
      badge: 'NEW',
      delay: 0.3,
    },
    {
      icon: <Star className="w-4 h-4" />,
      title: '멤버십 혜택',
      description: '별 적립으로 무료 세차',
      delay: 0.45,
    },
  ];

  return (
    <>
      {/* 왼쪽 카드 */}
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 left-0 space-y-3 pointer-events-auto">
        {leftCards.map((card) => (
          <ServiceCard key={card.title} {...card} side="left" />
        ))}
      </div>

      {/* 오른쪽 카드 */}
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 right-0 space-y-3 pointer-events-auto">
        {rightCards.map((card) => (
          <ServiceCard key={card.title} {...card} side="right" />
        ))}
      </div>
    </>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export const AnimatedBackground: React.FC = () => {
  const isDesktop = useIsDesktop();

  const leftIcons = [
    {
      icon: <Droplets className="w-8 h-8" />,
      delay: 0,
      duration: 9,
      x: 40,
      y: 400,
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      delay: 2,
      duration: 11,
      x: 90,
      y: 460,
    },
    {
      icon: <Wind className="w-6 h-6" />,
      delay: 1,
      duration: 8,
      x: 60,
      y: 480,
    },
    {
      icon: <Star className="w-5 h-5" />,
      delay: 3,
      duration: 10,
      x: 110,
      y: 430,
    },
  ];

  const rightIcons = [
    {
      icon: <Droplets className="w-6 h-6" />,
      delay: 1,
      duration: 10,
      x: -70,
      y: 420,
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      delay: 2.5,
      duration: 9,
      x: -30,
      y: 470,
    },
    {
      icon: <Wind className="w-5 h-5" />,
      delay: 0.5,
      duration: 11,
      x: -100,
      y: 400,
    },
    {
      icon: <Star className="w-6 h-6" />,
      delay: 3,
      duration: 8,
      x: -55,
      y: 500,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 세차 테마 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-cyan-950/30" />

      {/* 왼쪽 물방울 그라데이션 블롭 */}
      <motion.div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-cyan-400/25 to-blue-400/25 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 오른쪽 블롭 */}
      <motion.div
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        animate={{ scale: [1.15, 1, 1.15], x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 상단 중앙 물결 효과 */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-300/15 to-transparent rounded-full blur-3xl"
        animate={{ scaleX: [1, 1.2, 1], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* 플로팅 아이콘 */}
      <div className="absolute inset-0 flex justify-center">
        <div className="container relative h-full">
          <div className="absolute left-0 top-0 bottom-0 w-1/4">
            {leftIcons.map((item, i) => (
              <FloatingIcon key={`l-${i}`} {...item} />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4">
            {rightIcons.map((item, i) => (
              <FloatingIcon key={`r-${i}`} {...item} x={item.x + 180} />
            ))}
          </div>
        </div>
      </div>

      {/* 서비스 정보 카드 (데스크톱만) */}
      {isDesktop && (
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="container relative h-full">
            <CarWashServiceCards />
          </div>
        </div>
      )}
    </div>
  );
};
