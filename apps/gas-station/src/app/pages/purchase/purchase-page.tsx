import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { useOrders } from '@starcoex-frontend/orders';
import { usePayments } from '@starcoex-frontend/payments';
import { useProducts } from '@starcoex-frontend/products';
import {
  generatePaymentId,
  usePortOnePayment,
} from '@/hooks/usePortOnePayment';
import { toast } from 'sonner';
import { PaymentResultModal } from '@/components/sections/purchase/components/payment-result-modal';

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

// ✅ DB metadata.fuelType → FUEL_CODES 매핑
// admin-dashboard에서 저장하는 fuelType 문자열과 FUEL_CODES 상수를 연결
const DB_FUEL_TYPE_TO_CODE: Record<string, string> = {
  DIESEL: FUEL_CODES.DIESEL,
  GASOLINE: FUEL_CODES.GASOLINE,
  PREMIUM_GASOLINE: FUEL_CODES.PREMIUM_GASOLINE,
  KEROSENE: FUEL_CODES.KEROSENE,
  LPG: FUEL_CODES.LPG,
  // 오피넷 코드가 키인 경우도 대응
  B034: FUEL_CODES.DIESEL,
  B027: FUEL_CODES.GASOLINE,
  B034E: FUEL_CODES.PREMIUM_GASOLINE,
  C004: FUEL_CODES.KEROSENE,
  K015: FUEL_CODES.LPG,
};

const transformStationPricesToFuelTypes = (
  stationDetail: any,
  dbPrices?: Record<string, number>
): FuelType[] => {
  const fuelTypes: FuelType[] = [];
  const processedCodes = new Set<string>();

  // 1. 우선순위 1: DB 가격 사용
  if (dbPrices) {
    Object.entries(dbPrices).forEach(([rawCode, price]) => {
      // ✅ DB 저장값(예: "DIESEL")을 FUEL_CODES로 정규화
      const code = DB_FUEL_TYPE_TO_CODE[rawCode] ?? rawCode;
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
      const rawCode = priceInfo.PRODCD;
      // ✅ 오피넷 코드도 정규화
      const code = DB_FUEL_TYPE_TO_CODE[rawCode] ?? rawCode;
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
  const navigate = useNavigate();
  const { starStationDetail, isLoading, isInitialized } = useFuelData();
  const { currentUser } = useAuth();
  const { createOrder, fetchOrders, orders } = useOrders();
  const { createPayment, completePayment } = usePayments();
  const { products, fetchProducts } = useProducts();
  const { requestPayment } = usePortOnePayment();

  // 결제 처리 상태
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    status: 'IDLE' | 'SUCCESS' | 'FAILED' | 'RESERVED';
    message?: string;
    orderId?: number;
    isDuplicate?: boolean; // ✅ 추가
  }>({ status: 'IDLE' });

  // 제품 목록 로드 (연료 제품 productId 가져오기)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // DB에서 연료 제품 가격 추출
  const dbPrices: Record<string, number> | undefined = useMemo(() => {
    const fuelProducts = products.filter(
      (p) => p.isActive && p.isAvailable && p.metadata?.fuelType // FUEL 타입 제품만
    );

    if (fuelProducts.length === 0) return undefined;

    return fuelProducts.reduce((acc, p) => {
      const fuelCode = p.metadata?.fuelType as string;
      if (fuelCode) {
        // ProductInventory의 storePrice 우선, 없으면 basePrice
        const price =
          p.inventories?.[0]?.storePrice ?? p.salePrice ?? p.basePrice;
        if (price > 0) acc[fuelCode] = price;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  // ✅ DB에서 연료 제품 찾기 - metadata.fuelType을 FUEL_CODES로 정규화하여 비교
  const findFuelProduct = useCallback(
    (fuelCode: string) => {
      return products.find((p) => {
        if (!p.isActive || !p.isAvailable || !p.metadata?.fuelType)
          return false;
        // DB 저장값(예: "DIESEL")을 정규화하여 비교
        const normalizedCode =
          DB_FUEL_TYPE_TO_CODE[p.metadata.fuelType as string] ??
          p.metadata.fuelType;
        return normalizedCode === fuelCode;
      });
    },
    [products]
  );

  // 동적으로 연료 타입 생성
  const fuelTypes = useMemo(() => {
    return transformStationPricesToFuelTypes(starStationDetail, dbPrices);
  }, [starStationDetail, dbPrices]);

  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [quantityMode, setQuantityMode] = useState<QuantityMode>('amount');
  const [liter, setLiter] = useState<number>(0);
  const [amount, setAmount] = useState<number>(30000);
  const [isFullTank, setIsFullTank] = useState<boolean>(false);

  useEffect(() => {
    if (fuelTypes.length > 0 && !selectedFuel) {
      setSelectedFuel(fuelTypes[0]);
    }
  }, [fuelTypes, selectedFuel]);

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

  const fuelConfig = useMemo(() => {
    return selectedFuel
      ? getFuelConfig(selectedFuel.code)
      : GENERAL_FUEL_CONFIG;
  }, [selectedFuel]);

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
      basePrice = fuelConfig.FULL_AMOUNT;
      estimatedLiter = fuelConfig.FULL_LITER;
    } else if (quantityMode === 'liter') {
      basePrice = selectedFuel.price * liter;
      estimatedLiter = liter;
    } else {
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

  const handleFullTankSelect = () => setIsFullTank(true);
  const handleQuantityChange = (value: number, mode: QuantityMode) => {
    setIsFullTank(false);
    if (mode === 'liter') setLiter(value);
    else setAmount(value);
  };

  // ── 로그인 확인 ──────────────────────────────────────────────────────────────
  const checkAuth = (): boolean => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return false;
    }
    return true;
  };
  // ── 온라인 결제 처리 ─────────────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    if (!checkAuth() || !selectedFuel) return;
    if (paymentInfo.totalPrice <= 0) {
      toast.error('결제 금액을 확인해주세요.');
      return;
    }

    const fuelProduct = findFuelProduct(selectedFuel.code);
    if (!fuelProduct) {
      toast.error(
        '해당 연료 제품이 등록되지 않았습니다. 관리자에게 문의하세요.'
      );
      return;
    }

    // inventory에서 storeId 확인
    const inventory = fuelProduct.inventories?.[0];
    if (!inventory?.storeId) {
      toast.error('연료 제품의 매장 정보가 없습니다. 관리자에게 문의하세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderName = `${selectedFuel.name} ${
        isFullTank
          ? '가득'
          : quantityMode === 'liter'
          ? `${liter}L`
          : `${amount.toLocaleString()}원`
      }`;

      // ── 1단계: 주문 생성 ──────────────────────────────────────────────────
      const orderRes = await createOrder({
        storeId: inventory.storeId,
        storeName: APP_CONFIG.app.name,
        fulfillmentType: 'ON_SITE',
        totalAmount: paymentInfo.totalPrice,
        deliveryAmount: paymentInfo.deliveryFee,
        customerInfo: JSON.stringify({
          userId: currentUser!.id,
          name: currentUser!.name,
          phone: currentUser!.phoneNumber ?? '',
        }),
        items: [
          {
            productId: fuelProduct.id,
            storeId: inventory.storeId,
            productSnapshot: JSON.stringify({
              name: fuelProduct.name,
              price: inventory.storePrice ?? fuelProduct.basePrice,
              fuelType: selectedFuel.code,
              estimatedLiter: paymentInfo.estimatedLiter,
              isFullTank,
            }),
            quantity: quantityMode === 'liter' ? liter : 1,
            unitPrice:
              quantityMode === 'liter'
                ? selectedFuel.price
                : paymentInfo.totalPrice,
          },
        ],
      });

      // ✅ createOrder → res.data.order.id
      if (!orderRes.success || !orderRes.data?.order?.id) {
        toast.error(orderRes.error?.message ?? '주문 생성에 실패했습니다.');
        return;
      }

      const orderId = orderRes.data.order.id;
      const portOneId = generatePaymentId();

      // ── 2단계: 결제 레코드 생성 (PENDING) ───────────────────────────────
      const paymentRes = await createPayment({
        portOneId,
        orderName,
        amount: paymentInfo.totalPrice,
        currency: 'KRW',
        orderId,
        userId: currentUser!.id,
        customData: {
          orderId,
          userId: currentUser!.id,
          fuelType: selectedFuel.code,
          estimatedLiter: paymentInfo.estimatedLiter,
          isFullTank,
        },
      });

      // ✅ createPayment → res.success 체크 (data.payment 불필요)
      if (!paymentRes.success) {
        toast.error(paymentRes.error?.message ?? '결제 준비에 실패했습니다.');
        return;
      }

      // ── 3단계: PortOne 결제창 호출 ────────────────────────────────────────
      const portOneResult = await requestPayment({
        paymentId: portOneId,
        orderName,
        totalAmount: paymentInfo.totalPrice,
        currency: 'KRW',
        // ✅ payMethod 제거 - usePortOnePayment 내부에서 'CARD'로 고정
        // ✅ KCP 필수 customer 정보
        customer: {
          customerId: String(currentUser!.id),
          fullName: currentUser!.name ?? undefined,
          phoneNumber: currentUser!.phoneNumber ?? undefined,
          email: currentUser!.email ?? undefined,
        },
        customData: {
          orderId,
          userId: currentUser!.id,
          fuelType: selectedFuel.code,
        },
      });

      if (!portOneResult.success) {
        if (portOneResult.code === 'USER_CANCEL') {
          toast.info('결제가 취소되었습니다.');
        } else {
          toast.error(portOneResult.message ?? '결제에 실패했습니다.');
          setPaymentResult({
            status: 'FAILED',
            message: portOneResult.message,
          });
        }
        return;
      }

      // ── 4단계: 결제 완료 처리 (백엔드 PortOne 검증) ─────────────────────
      const completeRes = await completePayment({
        portOneId, // ✅ portOneId만 전달 (orderId 제거)
      });

      // ✅ 에러 상세 로그 추가
      console.log('[completePayment 결과]', completeRes);

      // ✅ completePayment → res.success 체크
      if (completeRes.success) {
        setPaymentResult({
          status: 'SUCCESS',
          orderId,
        });
      } else {
        toast.error(
          completeRes.error?.message ?? '결제 완료 처리에 실패했습니다.'
        );
        setPaymentResult({
          status: 'FAILED',
          message: completeRes.error?.message,
        });
      }
    } catch (error) {
      toast.error('결제 처리 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── 현장 결제 예약 처리 ───────────────────────────────────────────────────────
  const handleOnsiteReservation = async () => {
    if (!checkAuth() || !selectedFuel) return;

    const fuelProduct = findFuelProduct(selectedFuel.code);
    if (!fuelProduct) {
      toast.error('해당 연료 제품이 등록되지 않았습니다.');
      return;
    }

    const inventory = fuelProduct.inventories?.[0];
    if (!inventory?.storeId) {
      toast.error('연료 제품의 매장 정보가 없습니다.');
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ 중복 주문 확인: 오늘 날짜 + 동일 유저 + PENDING 상태 주문 조회
      await fetchOrders(50, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const duplicateOrder = orders.find((o) => {
        // 오늘 생성된 주문인지
        const createdAt = new Date(o.createdAt);
        if (createdAt < today) return false;

        // ON_SITE + PENDING 상태인지
        if (o.fulfillmentType !== 'ON_SITE') return false;
        if (o.status !== 'PENDING') return false;

        // 동일 연료 제품 포함 여부
        return o.items?.some((item) => item.productId === fuelProduct.id);
      });

      if (duplicateOrder) {
        toast.warning(
          `오늘 이미 동일한 주문이 있습니다. (주문번호: #${duplicateOrder.id})\n현장에서 해당 주문으로 결제해주세요.`,
          { duration: 5000 }
        );
        setPaymentResult({
          status: 'RESERVED',
          orderId: duplicateOrder.id,
          isDuplicate: true,
        });
        return;
      }

      // 중복 없으면 주문 생성
      const orderRes = await createOrder({
        storeId: inventory.storeId,
        storeName: APP_CONFIG.app.name,
        fulfillmentType: 'ON_SITE',
        totalAmount: paymentInfo.totalPrice,
        deliveryAmount: paymentInfo.deliveryFee,
        customerInfo: JSON.stringify({
          userId: currentUser!.id,
          name: currentUser!.name,
          phone: currentUser!.phoneNumber ?? '',
        }),
        items: [
          {
            productId: fuelProduct.id,
            storeId: inventory.storeId,
            productSnapshot: JSON.stringify({
              name: fuelProduct.name,
              price: inventory.storePrice ?? fuelProduct.basePrice,
              fuelType: selectedFuel.code,
              isFullTank,
            }),
            quantity: quantityMode === 'liter' ? liter : 1,
            unitPrice:
              quantityMode === 'liter'
                ? selectedFuel.price
                : paymentInfo.totalPrice,
          },
        ],
      });

      if (orderRes.success && orderRes.data?.order?.id) {
        setPaymentResult({
          status: 'RESERVED',
          orderId: orderRes.data.order.id,
          isDuplicate: false,
        });
      } else {
        toast.error(orderRes.error?.message ?? '주문 예약에 실패했습니다.');
      }
    } catch {
      toast.error('주문 예약 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <PageHead
        title="스마트 연료 구매 - 별표주유소"
        description="실시간 가격으로 경제적인 주유를 하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/store/purchase`}
      />

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">스마트 연료 구매</h1>
            <p className="text-muted-foreground">
              투명한 실시간 가격과 간편 결제로 경제적이고 편리하게 주유하세요.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
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

            <div className="lg:col-span-5">
              <PaymentCard
                selectedFuel={selectedFuel}
                quantityMode={quantityMode}
                paymentInfo={paymentInfo}
                onOnlinePayment={handleOnlinePayment}
                onOnsiteReservation={handleOnsiteReservation}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      <BenefitsSection />
      <MembershipSection />

      {/* 결제 결과 모달 */}
      <PaymentResultModal
        result={paymentResult}
        onClose={() => setPaymentResult({ status: 'IDLE' })}
      />
    </>
  );
};
