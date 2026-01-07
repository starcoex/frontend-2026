import React, { useEffect, useMemo, useState } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import {
  useFuelData,
  FUEL_CODES,
  FUEL_ORDER,
  getFuelUIConfig,
  type FuelProductCode,
} from '@starcoex-frontend/vehicles';
import { APP_CONFIG } from '@/app/config/app.config';
import { Car, Fuel, Truck } from 'lucide-react';
import { FuelSelectionSection } from '@/components/sections/purchase/fuel-selection-section';
import { QuantitySelectionSection } from '@/components/sections/purchase/quantity-selection-section';
import { PaymentCard } from '@/components/sections/purchase/components/payment-card';
import { BenefitsSection } from '@/components/sections/purchase/benefits-section';
import { MembershipSection } from '@/components/sections/purchase/membership-section';

// ==============================================================================
// 타입 정의
// ==============================================================================

export interface FuelType {
  id: string;
  name: string;
  code: FuelProductCode;
  price: number;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export type QuantityMode = 'liter' | 'amount';

export interface PaymentInfo {
  basePrice: number;
  deliveryFee: number;
  totalPrice: number;
  starReward: number;
  isKerosene: boolean;
  isMinimumOrder: boolean;
  isFullTank: boolean;
  estimatedLiter: number;
}

// ==============================================================================
// 상수 정의
// ==============================================================================

// 연료별 아이콘 매핑
const FUEL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [FUEL_CODES.GASOLINE]: Car,
  [FUEL_CODES.PREMIUM_GASOLINE]: Car,
  [FUEL_CODES.DIESEL]: Truck,
  [FUEL_CODES.KEROSENE]: Fuel,
  [FUEL_CODES.LPG]: Fuel,
};

// 연료별 추가 설명
const FUEL_DESCRIPTIONS: Record<string, string> = {
  [FUEL_CODES.GASOLINE]: '경제적인 일상 드라이빙',
  [FUEL_CODES.PREMIUM_GASOLINE]: '고성능 엔진 최적화',
  [FUEL_CODES.DIESEL]: '강력한 힘과 효율',
  [FUEL_CODES.KEROSENE]: '난방 및 산업용 배달',
  [FUEL_CODES.LPG]: '경제적인 대안 연료',
};

// 등유 설정
const KEROSENE_CONFIG = {
  MIN_LITER: 100,
  MAX_LITER: 1000,
  STEP_LITER: 10,
  STANDARD_DRUM: 200,
  DELIVERY_FEE: 10000,
  LITER_OPTIONS: [100, 200, 300, 400, 600, 'full'] as (number | 'full')[],
  MIN_AMOUNT: 100000,
  MAX_AMOUNT: 1000000,
  STEP_AMOUNT: 10000,
  AMOUNT_OPTIONS: [100000, 200000, 300000, 400000, 'full'] as (
    | number
    | 'full'
  )[],
  FULL_LITER: 400, // 가득 = 400L 기준
  FULL_AMOUNT: 500000, // 가득 결제 금액 = 50만원
};

// 일반 연료 설정 (휘발유, 경유 등)
const GENERAL_FUEL_CONFIG = {
  MIN_LITER: 10,
  MAX_LITER: 100,
  STEP_LITER: 5,
  LITER_OPTIONS: [10, 20, 30, 50, 70, 'full'] as (number | 'full')[],
  MIN_AMOUNT: 10000,
  MAX_AMOUNT: 200000,
  STEP_AMOUNT: 5000,
  AMOUNT_OPTIONS: [20000, 30000, 50000, 100000, 'full'] as (number | 'full')[],
  FULL_LITER: 100, // 가득 = 100L 기준 (실제 주유량에 따라 정산)
  FULL_AMOUNT: 150000, // 가득 결제 금액 = 15만원
};

// 별 적립 설정
const STAR_REWARD_CONFIG = {
  AMOUNT_PER_STAR: 5000,
};

// DB 기본 가격 (API 장애 시 폴백)
const FALLBACK_PRICES: Record<string, number> = {
  [FUEL_CODES.GASOLINE]: 1650,
  [FUEL_CODES.PREMIUM_GASOLINE]: 1850,
  [FUEL_CODES.DIESEL]: 1550,
  [FUEL_CODES.KEROSENE]: 1320,
  [FUEL_CODES.LPG]: 950,
};

// ==============================================================================
// 유틸리티 함수
// ==============================================================================

const transformStationPricesToFuelTypes = (
  stationDetail: any,
  dbPrices?: Record<string, number>
): FuelType[] => {
  const fuelTypes: FuelType[] = [];
  const processedCodes = new Set<string>();

  // 1. 우선순위 1: DB 가격 사용
  if (dbPrices) {
    Object.entries(dbPrices).forEach(([code, price]) => {
      const uiConfig = getFuelUIConfig(code);
      if (uiConfig && price > 0) {
        fuelTypes.push({
          id: code.toLowerCase(),
          name: uiConfig.name,
          code: code as FuelProductCode,
          price: price,
          desc: FUEL_DESCRIPTIONS[code] || uiConfig.description,
          icon: FUEL_ICONS[code] || Fuel,
          color: uiConfig.color,
          bg: uiConfig.bgColor + '/10',
        });
        processedCodes.add(code);
      }
    });
  }

  // 2. 우선순위 2: Opinet API 데이터 사용
  if (stationDetail?.OIL_PRICE && Array.isArray(stationDetail.OIL_PRICE)) {
    stationDetail.OIL_PRICE.forEach((priceInfo: any) => {
      const code = priceInfo.PRODCD;
      const price = priceInfo.PRICE;
      const uiConfig = getFuelUIConfig(code);

      if (code && price && uiConfig && !processedCodes.has(code)) {
        fuelTypes.push({
          id: code.toLowerCase(),
          name: uiConfig.name,
          code: code as FuelProductCode,
          price: price,
          desc: FUEL_DESCRIPTIONS[code] || uiConfig.description,
          icon: FUEL_ICONS[code] || Fuel,
          color: uiConfig.color,
          bg: uiConfig.bgColor + '/10',
        });
        processedCodes.add(code);
      }
    });
  }

  // 3. 우선순위 3: 폴백 가격 사용
  if (fuelTypes.length === 0) {
    Object.entries(FALLBACK_PRICES).forEach(([code, price]) => {
      const uiConfig = getFuelUIConfig(code);
      if (uiConfig) {
        fuelTypes.push({
          id: code.toLowerCase(),
          name: uiConfig.name,
          code: code as FuelProductCode,
          price: price,
          desc: FUEL_DESCRIPTIONS[code] || uiConfig.description,
          icon: FUEL_ICONS[code] || Fuel,
          color: uiConfig.color,
          bg: uiConfig.bgColor + '/10',
        });
      }
    });
  }

  // FUEL_ORDER 기준으로 정렬
  return fuelTypes.sort((a, b) => {
    const indexA = FUEL_ORDER.indexOf(a.code);
    const indexB = FUEL_ORDER.indexOf(b.code);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
};

// 등유 여부 확인
const isKerosene = (fuelCode: string): boolean => {
  return fuelCode === FUEL_CODES.KEROSENE;
};

// 연료별 설정 가져오기
const getFuelConfig = (fuelCode: string) => {
  if (isKerosene(fuelCode)) {
    return KEROSENE_CONFIG;
  }
  return GENERAL_FUEL_CONFIG;
};

// 배달료 계산
const calculateDeliveryFee = (fuelCode: string, liter: number): number => {
  if (isKerosene(fuelCode) && liter < KEROSENE_CONFIG.STANDARD_DRUM) {
    return KEROSENE_CONFIG.DELIVERY_FEE;
  }
  return 0;
};

// 별 적립 계산
const calculateStarReward = (totalAmount: number): number => {
  return Math.floor(totalAmount / STAR_REWARD_CONFIG.AMOUNT_PER_STAR);
};

// ==============================================================================
// 메인 컴포넌트
// ==============================================================================

export const PurchasePage: React.FC = () => {
  const { starStationDetail, isLoading, isInitialized } = useFuelData();

  // TODO: DB에서 가격 가져오는 로직 추가
  const dbPrices: Record<string, number> | undefined = undefined;

  // 동적으로 연료 타입 생성
  const fuelTypes = useMemo(() => {
    return transformStationPricesToFuelTypes(starStationDetail, dbPrices);
  }, [starStationDetail, dbPrices]);

  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [quantityMode, setQuantityMode] = useState<QuantityMode>('amount'); // 기본: 금액
  const [liter, setLiter] = useState<number>(0);
  const [amount, setAmount] = useState<number>(30000);
  const [isFullTank, setIsFullTank] = useState<boolean>(false);

  // 연료 타입이 로드되면 첫 번째 항목 자동 선택
  useEffect(() => {
    if (fuelTypes.length > 0 && !selectedFuel) {
      setSelectedFuel(fuelTypes[0]);
    }
  }, [fuelTypes, selectedFuel]);

  // 연료 변경 시 기본값 설정
  useEffect(() => {
    if (selectedFuel) {
      const config = getFuelConfig(selectedFuel.code);
      setIsFullTank(false);

      if (quantityMode === 'liter') {
        if (liter < config.MIN_LITER || liter > config.MAX_LITER) {
          setLiter(config.LITER_OPTIONS[0] as number);
        }
      } else {
        if (amount < config.MIN_AMOUNT || amount > config.MAX_AMOUNT) {
          setAmount(config.AMOUNT_OPTIONS[0] as number);
        }
      }
    }
  }, [selectedFuel]);

  // 현재 연료 설정
  const fuelConfig = useMemo(() => {
    return selectedFuel
      ? getFuelConfig(selectedFuel.code)
      : GENERAL_FUEL_CONFIG;
  }, [selectedFuel]);

  // 결제 정보 계산
  const paymentInfo: PaymentInfo = useMemo(() => {
    if (!selectedFuel) {
      return {
        basePrice: 0,
        deliveryFee: 0,
        totalPrice: 0,
        starReward: 0,
        isKerosene: false,
        isMinimumOrder: false,
        isFullTank: false,
        estimatedLiter: 0,
      };
    }

    const isKeroseneType = isKerosene(selectedFuel.code);
    let basePrice: number;
    let estimatedLiter: number;

    if (isFullTank) {
      // 가득 결제
      basePrice = fuelConfig.FULL_AMOUNT;
      estimatedLiter = fuelConfig.FULL_LITER;
    } else if (quantityMode === 'liter') {
      // 리터 기준
      basePrice = selectedFuel.price * liter;
      estimatedLiter = liter;
    } else {
      // 금액 기준
      basePrice = amount;
      estimatedLiter = Math.floor((amount / selectedFuel.price) * 10) / 10;
    }

    const deliveryFee = isKeroseneType
      ? calculateDeliveryFee(selectedFuel.code, estimatedLiter)
      : 0;
    const totalPrice = basePrice + deliveryFee;
    const starReward = calculateStarReward(totalPrice);
    const isMinimumOrder =
      isKeroseneType && estimatedLiter < KEROSENE_CONFIG.STANDARD_DRUM;

    return {
      basePrice,
      deliveryFee,
      totalPrice,
      starReward,
      isKerosene: isKeroseneType,
      isMinimumOrder,
      isFullTank,
      estimatedLiter,
    };
  }, [selectedFuel, quantityMode, liter, amount, isFullTank, fuelConfig]);

  // 가득 선택 핸들러
  const handleFullTankSelect = () => {
    setIsFullTank(true);
  };

  // 리터/금액 변경 핸들러
  const handleQuantityChange = (value: number, mode: QuantityMode) => {
    setIsFullTank(false);
    if (mode === 'liter') {
      setLiter(value);
    } else {
      setAmount(value);
    }
  };

  return (
    <>
      <PageHead
        title="스마트 연료 구매 - 별표주유소"
        description="실시간 가격으로 경제적인 주유를 하세요. 보통휘발유, 경유, 등유 중 선택하여 간편하게 구매하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/store/purchase`}
      />

      {/* 메인 주문 섹션 */}
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">스마트 연료 구매</h1>
            <p className="text-muted-foreground">
              투명한 실시간 가격과 간편 결제로 경제적이고 편리하게 주유하세요.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* 좌측: 선택 폼 */}
            <div className="lg:col-span-7 space-y-8">
              <FuelSelectionSection
                fuelTypes={fuelTypes}
                selectedFuel={selectedFuel}
                onFuelSelect={setSelectedFuel}
                isLoading={isLoading && !isInitialized}
              />

              <QuantitySelectionSection
                quantityMode={quantityMode}
                onModeChange={setQuantityMode}
                liter={liter}
                amount={amount}
                onQuantityChange={handleQuantityChange}
                onFullTankSelect={handleFullTankSelect}
                isFullTank={isFullTank}
                fuelConfig={fuelConfig}
                fuelPrice={selectedFuel?.price ?? 0}
                isKerosene={paymentInfo.isKerosene}
                isMinimumOrder={paymentInfo.isMinimumOrder}
              />
            </div>

            {/* 우측: 결제 패널 */}
            <div className="lg:col-span-5">
              <PaymentCard
                selectedFuel={selectedFuel}
                quantityMode={quantityMode}
                paymentInfo={paymentInfo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 구매 혜택 섹션 */}
      <BenefitsSection />

      {/* 멤버십 안내 섹션 */}
      <MembershipSection />
    </>
  );
};
