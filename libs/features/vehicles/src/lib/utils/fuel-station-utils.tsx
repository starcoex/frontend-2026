import {
  Car,
  Truck,
  Fuel,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import React from 'react';
import { FuelPrice } from '@starcoex-frontend/graphql';
import { FUEL_CODES, FUEL_NAMES, FUEL_UI_CONFIG } from '../constants';
import { FuelProductCode } from '../types';

// ============================================================================
// 🛠️ 포맷팅 헬퍼 함수
// ============================================================================

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(price)) + '원';
};

export function formatFullDate(dateString: string): string {
  try {
    if (!dateString?.trim()) return '';

    const date = new Date(dateString.trim());
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  } catch {
    return '';
  }
}

export const formatPercentChange = (percent: number): string => {
  if (percent === 0) return '0.00%';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

export const formatPriceChange = (change: number): string => {
  if (change === 0) return '-';
  const sign = change > 0 ? '+' : '';
  return `${sign}${Math.round(change)}원`;
};

// ============================================================================
// 🎨 UI 스타일 헬퍼 함수
// ============================================================================

export const getTrendColor = (change: number): string => {
  if (change > 0) return 'text-red-500';
  if (change < 0) return 'text-blue-500';
  return 'text-gray-500';
};

export const getTrendIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
  if (change < 0) return <TrendingDown className="w-4 h-4 text-blue-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

// ============================================================================
// 🔄 데이터 변환 함수 (Backend -> Frontend)
// ============================================================================

export interface ProcessedPriceData {
  id: string;
  fuelType: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  icon: React.ReactElement;
  gradient: string;
  bgColor: string;
  textColor: string; // ✅ 추가: 유종별 텍스트 색상
  description: string;
  hasData: boolean;
  productCode: string;
}

/**
 * 백엔드 FuelPrice 배열을 UI용 ProcessedPriceData 배열로 변환
 */
export const createProcessedPrices = (
  prices: FuelPrice[] | null
): ProcessedPriceData[] => {
  // 정의된 연료 순서대로 처리
  const targetFuels: FuelProductCode[] = [
    'B034', // 고급휘발유
    'B027', // 휘발유
    'D047', // 경유
    'C004', // 실내등유
  ];

  return targetFuels.map((code) => {
    const uiConfig = FUEL_UI_CONFIG[code];
    // 백엔드 데이터 매칭 (PRODCD 확인)
    const priceData = prices?.find((p) => p.PRODCD === code);

    // 데이터가 있으면 해당 값 사용, 없으면 기본값(0)
    const currentPrice = priceData?.PRICE ?? 0;
    const change = priceData?.DIFF ?? 0;
    const hasData = !!priceData;

    // 등락률 계산
    const changePercent =
      currentPrice - change !== 0
        ? (change / (currentPrice - change)) * 100
        : 0;

    // 아이콘 결정 (연료 타입별)
    let Icon = Fuel; // 기본 아이콘
    if (code === FUEL_CODES.PREMIUM_GASOLINE) Icon = Zap; // 고급휘발유: 번개
    if (code === FUEL_CODES.GASOLINE) Icon = Car; // 휘발유: 자동차
    if (code === FUEL_CODES.DIESEL) Icon = Truck; // 경유: 트럭
    // 등유는 기본 Fuel 아이콘 사용

    return {
      id: code,
      productCode: code,
      fuelType: FUEL_NAMES[code] || uiConfig.name,
      currentPrice,
      change,
      changePercent,
      icon: <Icon className="w-5 h-5" />,
      gradient: getGradientByColor(uiConfig.color), // 아래 헬퍼 필요
      bgColor: uiConfig.bgColor,
      textColor: uiConfig.color, // ✅ 추가: 유종별 텍스트 색상
      description: uiConfig.description,
      hasData,
    };
  });
};

// 그라디언트 생성 헬퍼 (Tailwind class 조합)
const getGradientByColor = (textColorClass: string): string => {
  if (textColorClass.includes('green')) return 'from-green-400 to-emerald-500'; // 고급휘발유
  if (textColorClass.includes('yellow')) return 'from-yellow-400 to-orange-500'; // 휘발유
  if (textColorClass.includes('blue')) return 'from-blue-400 to-cyan-500'; // 경유
  if (textColorClass.includes('slate')) return 'from-slate-400 to-slate-600'; // 등유
  if (textColorClass.includes('purple')) return 'from-purple-400 to-violet-500'; // LPG
  return 'from-gray-400 to-gray-500';
};
