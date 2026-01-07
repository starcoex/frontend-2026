import React, { useState } from 'react';
import {
  CreditCard,
  Fuel,
  Car,
  ArrowRight,
  Star,
  Crown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // cn 유틸리티가 있다고 가정 (없으면 className 문자열 조합)

// 1. 데이터 구조 변경: '가입비' 제거, '달성 조건' 추가
interface FuelType {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  gradient: string;
  description: string;
}

interface LoyaltyTier {
  id: string;
  name: string; // WELCOME, GREEN, GOLD
  condition: string; // 예: 회원가입 즉시, 별 50개
  discountPerLiter: number; // 리터당 할인
  earnRate: number; // 포인트/별 적립률 (예: 1.0 -> 10000원당 1개)
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}

const fuelTypes: FuelType[] = [
  {
    id: 'premium',
    name: '프리미엄 휘발유',
    price: 1750,
    icon: <Fuel className="w-6 h-6" />,
    gradient: 'from-yellow-500 to-orange-500',
    description: '고성능 엔진 보호 및 출력 향상',
  },
  {
    id: 'gasoline',
    name: '일반 휘발유',
    price: 1650,
    icon: <Car className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500',
    description: '경제적이고 부드러운 주행',
  },
  {
    id: 'diesel',
    name: '파워 디젤',
    price: 1550,
    icon: <Fuel className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    description: '강력한 힘과 뛰어난 연비',
  },
];

// 등급제 데이터 (앞서 정의한 WELCOME/GREEN/GOLD 모델 반영)
const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'welcome',
    name: 'WELCOME',
    condition: '회원가입 즉시',
    discountPerLiter: 10,
    earnRate: 1, // 1만원당 1개
    icon: <Star className="w-5 h-5" />,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/20',
  },
  {
    id: 'green',
    name: 'GREEN',
    condition: '별 50개 적립',
    discountPerLiter: 50,
    earnRate: 1,
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    id: 'gold',
    name: 'GOLD (VIP)',
    condition: '별 200개 적립',
    discountPerLiter: 100,
    earnRate: 2, // 이벤트 가정 (2배) or 혜택 강화
    icon: <Crown className="w-5 h-5" />,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
];

export const PurchaseSection: React.FC = () => {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>(fuelTypes[0]);
  // '구매할 멤버십'이 아니라 '시뮬레이션 해볼 등급'
  const [simulatedTier, setSimulatedTier] = useState<LoyaltyTier>(
    loyaltyTiers[1]
  ); // 기본값 GREEN
  const [liter, setLiter] = useState<number>(50); // 주유량 (L)

  // 계산 로직
  const basePrice = selectedFuel.price * liter;
  const totalDiscount = simulatedTier.discountPerLiter * liter;
  const finalPrice = basePrice - totalDiscount;

  // 별 적립 예상 (10,000원당 1개 * 등급별 가중치)
  const estimatedStars = Math.floor(
    (finalPrice / 10000) * simulatedTier.earnRate
  );

  return (
    <section className="bg-background py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            스마트 연료 주문
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            원하는 연료와 주유량을 선택하세요.
            <br />
            회원 등급에 따라{' '}
            <span className="text-primary font-bold">리터당 최대 100원</span>
            까지 즉시 할인됩니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* 왼쪽: 선택 폼 */}
          <div className="space-y-10">
            {/* 1. 연료 선택 */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  1
                </span>
                연료 선택
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {fuelTypes.map((fuel) => (
                  <div
                    key={fuel.id}
                    onClick={() => setSelectedFuel(fuel)}
                    className={cn(
                      'cursor-pointer relative p-4 rounded-xl border-2 transition-all hover:bg-accent/50',
                      selectedFuel.id === fuel.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border'
                    )}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br ${fuel.gradient} text-white`}
                    >
                      {fuel.icon}
                    </div>
                    <h4 className="font-bold">{fuel.name}</h4>
                    <div className="text-lg font-bold mt-1 text-foreground">
                      {fuel.price.toLocaleString()}원
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        / L
                      </span>
                    </div>
                    {selectedFuel.id === fuel.id && (
                      <div className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 주유량 설정 (슬라이더) */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  2
                </span>
                주유량 설정
              </h3>
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-muted-foreground font-medium">
                    얼마나 주유할까요?
                  </span>
                  <div className="text-3xl font-bold text-primary">
                    {liter}L
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={liter}
                  onChange={(e) => setLiter(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mb-6"
                />
                <div className="flex gap-2 justify-end">
                  {[30, 50, 70, '가득(100)'].map((v) => (
                    <Button
                      key={v}
                      variant="outline"
                      size="sm"
                      onClick={() => setLiter(typeof v === 'string' ? 100 : v)}
                      className={
                        liter === (typeof v === 'string' ? 100 : v)
                          ? 'border-primary text-primary'
                          : ''
                      }
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 등급별 할인 시뮬레이션 (핵심 변경) */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    3
                  </span>
                  등급별 할인 미리보기
                </h3>
                <span className="text-xs text-muted-foreground">
                  * 등급을 클릭하여 혜택 차이를 확인하세요
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {loyaltyTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSimulatedTier(tier)}
                    className={cn(
                      'cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden',
                      simulatedTier.id === tier.id
                        ? `${tier.border} ${tier.bg}`
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    {simulatedTier.id === tier.id && (
                      <div className="absolute top-2 right-2 text-xs font-bold bg-background/80 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm">
                        적용 중
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-2 mb-2 ${tier.color}`}
                    >
                      {tier.icon}
                      <span className="font-bold">{tier.name}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">할인</span>
                        <span className="font-bold text-foreground">
                          -{tier.discountPerLiter}원/L
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">조건</span>
                        <span className="text-xs">{tier.condition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 계산기 사이드바 */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border border-primary/20 bg-background shadow-2xl overflow-hidden">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  결제 예상 금액
                </h3>
              </div>

              {/* 내용 */}
              <div className="p-6 space-y-6">
                {/* 요약 정보 */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>선택 연료</span>
                    <span className="font-medium text-foreground">
                      {selectedFuel.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>주유량</span>
                    <span className="font-medium text-foreground">
                      {liter}L
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>적용 등급</span>
                    <span className={`font-bold ${simulatedTier.color}`}>
                      {simulatedTier.name}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* 금액 계산 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">정상가</span>
                    <span className="line-through text-muted-foreground">
                      {basePrice.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-red-500">
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <TrendingDown className="w-4 h-4" /> 할인 금액
                    </span>
                    <span className="font-bold">
                      -{totalDiscount.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-bold text-lg">최종 결제가</span>
                    <span className="text-3xl font-bold text-primary">
                      {finalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* 혜택 박스 (포인트/별) */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-yellow-500/20 rounded-full shrink-0">
                      <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                        적립 예정 별 (Star)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        결제 완료 시{' '}
                        <span className="font-bold text-foreground">
                          {estimatedStars}개
                        </span>
                        가 적립됩니다.
                        <br />
                        (다음 등급까지 더 빠르게!)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 주문 버튼 */}
                <Button size="lg" className="w-full h-14 text-lg font-bold">
                  연료 주문하기 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  * 실제 주유소 방문 시 가격 변동이 있을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function TrendingDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
