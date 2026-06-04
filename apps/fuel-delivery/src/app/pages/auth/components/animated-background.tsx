import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, Flame, MapPin, Shield, Clock, CheckCircle } from 'lucide-react';

// ── 타입 ─────────────────────────────────────────────────────────────────────

interface FloatingIconProps {
  icon: React.ReactNode;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  side: 'left' | 'right';
  delay: number;
}

// ── 데스크톱 감지 ─────────────────────────────────────────────────────────────

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

// ── 플로팅 아이콘 ─────────────────────────────────────────────────────────────

const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  delay,
  duration,
  x,
  y,
}) => (
  <motion.div
    className="absolute text-orange-400/30 dark:text-orange-300/20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      y: [y, y - 100, y - 200, y - 300],
      x: [x, x + 20, x - 20, x],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {icon}
  </motion.div>
);

// ── 서비스 정보 카드 ──────────────────────────────────────────────────────────

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  badge,
  side,
  delay,
}) => (
  <motion.div
    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-orange-100 dark:border-orange-900/50 rounded-xl px-4 py-3 shadow-lg min-w-[180px]"
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
        {icon}
      </div>
      {badge && (
        <span className="text-[10px] font-bold text-white bg-orange-500 rounded-full px-2 py-0.5">
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

// ── 배달 서비스 카드 패널 ─────────────────────────────────────────────────────

const DeliveryServiceCards: React.FC = () => {
  const leftCards: Omit<ServiceCardProps, 'side'>[] = [
    {
      icon: <MapPin className="w-4 h-4" />,
      title: '실시간 배송 추적',
      description: 'GPS로 위치 직접 확인',
      badge: 'LIVE',
      delay: 0.2,
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: '정량 100% 보장',
      description: '미터기 0부터 시작 확인',
      delay: 0.35,
    },
  ];

  const rightCards: Omit<ServiceCardProps, 'side'>[] = [
    {
      icon: <CheckCircle className="w-4 h-4" />,
      title: '당일 배송',
      description: '오후 2시 전 주문 마감',
      badge: '당일',
      delay: 0.3,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: '웹으로 간편 주문',
      description: '전화 없이 바로 주문',
      delay: 0.45,
    },
  ];

  return (
    <>
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 left-0 space-y-3 pointer-events-auto">
        {leftCards.map((card) => (
          <ServiceCard key={card.title} {...card} side="left" />
        ))}
      </div>
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 right-0 space-y-3 pointer-events-auto">
        {rightCards.map((card) => (
          <ServiceCard key={card.title} {...card} side="right" />
        ))}
      </div>
    </>
  );
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export const AnimatedBackground: React.FC = () => {
  const isDesktop = useIsDesktop();

  const leftIcons = [
    {
      icon: <Truck className="w-8 h-8" />,
      delay: 0,
      duration: 8,
      x: 30,
      y: 400,
    },
    {
      icon: <Flame className="w-6 h-6" />,
      delay: 2,
      duration: 10,
      x: 80,
      y: 450,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      delay: 1,
      duration: 11,
      x: 50,
      y: 480,
    },
    {
      icon: <Shield className="w-7 h-7" />,
      delay: 3,
      duration: 9,
      x: 100,
      y: 420,
    },
  ];

  const rightIcons = [
    {
      icon: <Truck className="w-6 h-6" />,
      delay: 1,
      duration: 9,
      x: -80,
      y: 420,
    },
    {
      icon: <Flame className="w-7 h-7" />,
      delay: 3,
      duration: 8,
      x: -30,
      y: 460,
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      delay: 0,
      duration: 10,
      x: -100,
      y: 400,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      delay: 2,
      duration: 11,
      x: -60,
      y: 490,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 난방유 테마 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-950 dark:to-orange-950/30" />

      {/* 왼쪽 블롭 */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 오른쪽 블롭 */}
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-orange-400/15 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
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
              <FloatingIcon key={`r-${i}`} {...item} x={item.x + 200} />
            ))}
          </div>
        </div>
      </div>

      {/* 서비스 카드 (데스크톱만) */}
      {isDesktop && (
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="container relative h-full">
            <DeliveryServiceCards />
          </div>
        </div>
      )}
    </div>
  );
};
