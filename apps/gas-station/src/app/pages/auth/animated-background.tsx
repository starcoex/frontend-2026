import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Fuel,
  Droplets,
  Zap,
  Star,
  TrendingDown,
  TrendingUp,
  Minus,
  Loader2,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import {
  useFuelData,
  FUEL_CODES,
  FUEL_UI_CONFIG,
  JEJU_SIGUN_CODES,
} from '@starcoex-frontend/vehicles';

// === 타입 정의 ===
interface FloatingIconProps {
  icon: React.ReactNode;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

interface PriceTickerProps {
  price: number;
  change: number;
  label: string;
  city: string;
  isLoading?: boolean;
  error?: boolean;
}

interface JejuFuelData {
  fuelCode: string;
  fuelName: string;
  jejuPrice: number;
  jejuChange: number;
  seogwipoPrice: number;
  seogwipoChange: number;
}

// === 커스텀 훅: 데스크톱 감지 ===
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
};

// === 유틸리티 함수 ===
const getTrendIcon = (change: number) => {
  if (change > 0) {
    return <TrendingUp className="w-3 h-3 text-red-500" />;
  }
  if (change < 0) {
    return <TrendingDown className="w-3 h-3 text-green-500" />;
  }
  return <Minus className="w-3 h-3 text-gray-400" />;
};

const getTrendColorClass = (change: number): string => {
  if (change > 0) return 'text-red-500';
  if (change < 0) return 'text-green-500';
  return 'text-gray-400';
};

// === 서브 컴포넌트 ===
const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  delay,
  duration,
  x,
  y,
}) => (
  <motion.div
    className="absolute text-primary/30 dark:text-primary/20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      y: [y, y - 100, y - 200, y - 300],
      x: [x, x + 20, x - 20, x],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {icon}
  </motion.div>
);

const PriceTicker: React.FC<PriceTickerProps> = ({
  price,
  change,
  label,
  city,
  isLoading = false,
  error = false,
}) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-lg min-w-[180px]"
      initial={{ opacity: 0, x: city === '제주시' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 지역 표시 */}
      <div className="flex items-center gap-1 mb-1">
        <MapPin className="w-3 h-3 text-primary" />
        <span className="text-xs font-medium text-primary">{city}</span>
      </div>

      {/* 연료 종류 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>

      {/* 가격 정보 */}
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          <span className="text-sm text-gray-400">로딩중...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-500">일시적 오류</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            {price > 0 ? `${price.toLocaleString()}원` : '-'}
          </span>
          {price > 0 && change !== 0 && (
            <span
              className={`text-xs flex items-center font-medium ${getTrendColorClass(
                change
              )}`}
            >
              {getTrendIcon(change)}
              <span className="ml-0.5">
                {change > 0 ? '+' : ''}
                {change.toFixed(0)}원
              </span>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

// === 유가 티커 컴포넌트 (분리) ===
const FuelPriceTickers: React.FC = () => {
  const { jejuSigunPrices, isLoading, error } = useFuelData();

  // 제주도 시군별 유가 데이터 변환
  const jejuFuelData = useMemo((): JejuFuelData[] => {
    if (!jejuSigunPrices || jejuSigunPrices.length === 0) return [];

    const jejuCityData = jejuSigunPrices.filter(
      (price) => price.AREA_CD === JEJU_SIGUN_CODES.JEJU_CITY
    );
    const seogwipoCityData = jejuSigunPrices.filter(
      (price) => price.AREA_CD === JEJU_SIGUN_CODES.SEOGWIPO_CITY
    );

    const targetFuels = [FUEL_CODES.GASOLINE, FUEL_CODES.DIESEL];
    const result: JejuFuelData[] = [];

    targetFuels.forEach((fuelCode) => {
      const jejuFuel = jejuCityData.find((item) => item.PRODCD === fuelCode);
      const seogwipoFuel = seogwipoCityData.find(
        (item) => item.PRODCD === fuelCode
      );

      if (jejuFuel || seogwipoFuel) {
        const config = FUEL_UI_CONFIG[fuelCode];
        result.push({
          fuelCode,
          fuelName: config?.name || fuelCode,
          jejuPrice: jejuFuel?.PRICE ?? 0,
          jejuChange: jejuFuel?.DIFF ?? 0,
          seogwipoPrice: seogwipoFuel?.PRICE ?? 0,
          seogwipoChange: seogwipoFuel?.DIFF ?? 0,
        });
      }
    });

    return result;
  }, [jejuSigunPrices]);

  const hasError = !!error && jejuFuelData.length === 0;
  const showLoading = isLoading && jejuFuelData.length === 0;

  if (!showLoading && jejuFuelData.length === 0 && !hasError) {
    return null;
  }

  return (
    <>
      {/* 왼쪽 제주시 가격 티커 - container 기준 left-0 */}
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 left-0 space-y-3 pointer-events-auto">
        {hasError ? (
          <PriceTicker
            price={0}
            change={0}
            label="유가 정보"
            city="제주시"
            error
          />
        ) : showLoading ? (
          <>
            <PriceTicker
              price={0}
              change={0}
              label="휘발유"
              city="제주시"
              isLoading
            />
            <PriceTicker
              price={0}
              change={0}
              label="경유"
              city="제주시"
              isLoading
            />
          </>
        ) : (
          jejuFuelData.map((fuel, index) => (
            <motion.div
              key={`jeju-${fuel.fuelCode}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
            >
              <PriceTicker
                price={fuel.jejuPrice}
                change={fuel.jejuChange}
                label={fuel.fuelName}
                city="제주시"
              />
            </motion.div>
          ))
        )}
      </div>

      {/* 오른쪽 서귀포시 가격 티커 - container 기준 right-0 */}
      <div className="hidden lg:flex flex-col absolute top-1/2 -translate-y-1/2 right-0 space-y-3 pointer-events-auto">
        {hasError ? (
          <PriceTicker
            price={0}
            change={0}
            label="유가 정보"
            city="서귀포시"
            error
          />
        ) : showLoading ? (
          <>
            <PriceTicker
              price={0}
              change={0}
              label="휘발유"
              city="서귀포시"
              isLoading
            />
            <PriceTicker
              price={0}
              change={0}
              label="경유"
              city="서귀포시"
              isLoading
            />
          </>
        ) : (
          jejuFuelData.map((fuel, index) => (
            <motion.div
              key={`seogwipo-${fuel.fuelCode}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
            >
              <PriceTicker
                price={fuel.seogwipoPrice}
                change={fuel.seogwipoChange}
                label={fuel.fuelName}
                city="서귀포시"
              />
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

// === 메인 컴포넌트 ===
export const AnimatedBackground: React.FC = () => {
  const isDesktop = useIsDesktop();

  // 플로팅 아이콘 설정
  const leftFloatingIcons = [
    {
      icon: <Fuel className="w-8 h-8" />,
      delay: 0,
      duration: 8,
      x: 30,
      y: 400,
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      delay: 2,
      duration: 10,
      x: 80,
      y: 450,
    },
    {
      icon: <Star className="w-5 h-5" />,
      delay: 1,
      duration: 11,
      x: 50,
      y: 480,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      delay: 3,
      duration: 9,
      x: 100,
      y: 420,
    },
  ];

  const rightFloatingIcons = [
    {
      icon: <Fuel className="w-6 h-6" />,
      delay: 1,
      duration: 9,
      x: -80,
      y: 420,
    },
    {
      icon: <Droplets className="w-7 h-7" />,
      delay: 3,
      duration: 8,
      x: -30,
      y: 460,
    },
    {
      icon: <Star className="w-6 h-6" />,
      delay: 0,
      duration: 10,
      x: -100,
      y: 400,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      delay: 2,
      duration: 11,
      x: -60,
      y: 490,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />

      {/* 왼쪽 애니메이션 원형 그라데이션 */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 오른쪽 애니메이션 원형 그라데이션 */}
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
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

      {/* 플로팅 아이콘들 - container 내부 배치 */}
      <div className="absolute inset-0 flex justify-center">
        <div className="container relative h-full">
          {/* 왼쪽 플로팅 아이콘들 */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4">
            {leftFloatingIcons.map((item, index) => (
              <FloatingIcon key={`left-${index}`} {...item} />
            ))}
          </div>

          {/* 오른쪽 플로팅 아이콘들 */}
          <div className="absolute right-0 top-0 bottom-0 w-1/4">
            {rightFloatingIcons.map((item, index) => (
              <FloatingIcon key={`right-${index}`} {...item} x={item.x + 200} />
            ))}
          </div>
        </div>
      </div>

      {/* 데스크톱에서만 유가 티커 렌더링 - container 내부 배치 */}
      {isDesktop && (
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="container relative h-full">
            <FuelPriceTickers />
          </div>
        </div>
      )}
    </div>
  );
};
