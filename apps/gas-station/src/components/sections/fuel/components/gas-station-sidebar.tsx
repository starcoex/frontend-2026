import React from 'react';
import {
  Zap,
  Car,
  Truck,
  Fuel,
  Star,
  Crown,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import {
  formatPrice,
  ProcessedPriceData,
  FUEL_CODES,
} from '@starcoex-frontend/vehicles';
import { Button } from '@/components/ui/button';

// 별표주유소 유가 정보 컴포넌트
interface StarStationPricesProps {
  processedPrices: ProcessedPriceData[];
  showTitle?: boolean;
}

// 연료 코드에 따른 아이콘 반환
const getFuelIcon = (productCode: string) => {
  switch (productCode) {
    case FUEL_CODES.PREMIUM_GASOLINE:
      return <Zap className="w-4 h-4" />;
    case FUEL_CODES.GASOLINE:
      return <Car className="w-4 h-4" />;
    case FUEL_CODES.DIESEL:
      return <Truck className="w-4 h-4" />;
    case FUEL_CODES.KEROSENE:
      return <Fuel className="w-4 h-4" />;
    default:
      return <Fuel className="w-4 h-4" />;
  }
};

export const StarStationPrices: React.FC<StarStationPricesProps> = ({
  processedPrices,
  showTitle = true,
}) => {
  const handleOrderFuel = () => {
    // 연료 주문 페이지로 이동 (실제 경로로 변경 필요)
    window.location.href = '/fuel';
  };

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500 rounded-full">
          <Star className="w-5 h-5 text-white fill-current" />
        </div>
        {showTitle && (
          <h3 className="text-foreground text-xl lg:text-2xl font-semibold text-left">
            별표주유소 유가
          </h3>
        )}
      </div>
      <div className="space-y-4 py-4">
        {processedPrices
          .filter((p) => p.hasData)
          .map((price) => (
            <div key={price.id} className="flex justify-between items-center">
              <span
                className={`text-sm font-medium flex items-center gap-2 ${price.textColor}`}
              >
                <span
                  className={`p-1.5 rounded-md bg-gradient-to-r ${price.gradient} text-white [&>svg]:w-4 [&>svg]:h-4`}
                >
                  {getFuelIcon(price.productCode)}
                </span>
                {price.fuelType}
              </span>
              <span className={`font-bold ${price.textColor}`}>
                {formatPrice(price.currentPrice)}
              </span>
            </div>
          ))}
      </div>

      {/* 구매하기 버튼 추가 */}
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={handleOrderFuel}
      >
        연료 주문하기
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

// 멤버십 등급 간소화 컴포넌트
interface GasStationSidebarProps {
  showTitle?: boolean;
}

// const membershipTiers = [
//   {
//     name: 'WELCOME',
//     condition: '가입 즉시',
//     benefit: '리터당 10원 할인',
//     icon: Star,
//     color: 'text-gray-500',
//   },
//   {
//     name: 'GREEN',
//     condition: 'Star 50+',
//     benefit: '리터당 50원 할인',
//     icon: Sparkles,
//     color: 'text-emerald-500',
//   },
//   {
//     name: 'GOLD',
//     condition: 'Star 200+',
//     benefit: '리터당 100원 할인',
//     icon: Crown,
//     color: 'text-yellow-500',
//   },
// ];

export const GasStationSidebar: React.FC<GasStationSidebarProps> = ({
  showTitle = true,
}) => {
  const handleViewMembership = () => {
    window.location.href = '/membership';
  };

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-full">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
          {showTitle && (
            <h3 className="text-lg font-bold text-foreground mb-2">
              별표 멤버십 등급제
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            가입만 해도 즉시 혜택!
            <br />
            주유할수록 더 큰 할인
          </p>
        </div>

        {/*<div className="space-y-3">*/}
        {/*  {membershipTiers.map((tier) => (*/}
        {/*    <div*/}
        {/*      key={tier.name}*/}
        {/*      className="bg-background/60 dark:bg-background/30 rounded-lg p-3 border border-border/50"*/}
        {/*    >*/}
        {/*      <div className="flex items-center justify-between mb-1">*/}
        {/*        <div className="flex items-center gap-2">*/}
        {/*          <tier.icon className={`w-4 h-4 ${tier.color}`} />*/}
        {/*          <Badge*/}
        {/*            variant="outline"*/}
        {/*            className="text-xs font-bold border-primary/50 text-primary"*/}
        {/*          >*/}
        {/*            {tier.name}*/}
        {/*          </Badge>*/}
        {/*          <span className="text-xs text-muted-foreground">*/}
        {/*            {tier.condition}*/}
        {/*          </span>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*      <div className="flex items-center gap-1.5 text-sm pl-6">*/}
        {/*        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />*/}
        {/*        <span className="font-medium text-foreground">*/}
        {/*          {tier.benefit}*/}
        {/*        </span>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}

        <div className="mt-4 p-3 bg-background/40 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Lightbulb className="w-4 h-4 shrink-0 text-primary" />
            <div>
              <p>결제 금액 1만원당 1 Star 적립</p>
              <p>세차 이용 시 2배 적립!</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleViewMembership}
        >
          멤버십 혜택 자세히 보기
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
