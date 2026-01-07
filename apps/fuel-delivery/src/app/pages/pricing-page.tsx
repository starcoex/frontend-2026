import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingDown, Clock, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedVolume, setSelectedVolume] = useState(500);

  const pricingTiers = [
    {
      name: '소량 주문',
      volume: '200L - 499L',
      price: 1200,
      deliveryFee: 15000,
      features: ['당일 배송', '기본 품질 보증', '전화 상담 지원'],
      popular: false,
    },
    {
      name: '일반 주문',
      volume: '500L - 999L',
      price: 1150,
      deliveryFee: 10000,
      features: ['당일 배송', '품질 보증서', '전담 상담사', '무료 점검'],
      popular: true,
    },
    {
      name: '대량 주문',
      volume: '1000L 이상',
      price: 1100,
      deliveryFee: 0,
      features: [
        '우선 배송',
        '프리미엄 품질',
        '전담 매니저',
        '정기 점검',
        '특별 할인',
      ],
      popular: false,
    },
  ];

  const additionalServices = [
    { name: '탱크 청소 서비스', price: 50000, unit: '회' },
    { name: '긴급 배송 (24시간 내)', price: 30000, unit: '회' },
    { name: '정기 배송 할인', price: -50, unit: 'L당' },
    { name: '보일러 점검 서비스', price: 80000, unit: '회' },
  ];

  const calculateTotalPrice = (volume: number) => {
    const tier =
      pricingTiers.find((tier) => {
        const [min, max] = tier.volume
          .split(' - ')
          .map((v) => parseInt(v.replace('L', '').replace(' 이상', '')));
        if (tier.volume.includes('이상')) {
          return volume >= min;
        }
        return volume >= min && volume <= max;
      }) || pricingTiers[0];

    const fuelCost = volume * tier.price;
    const deliveryFee = tier.deliveryFee;
    const total = fuelCost + deliveryFee;

    return { tier, fuelCost, deliveryFee, total };
  };

  const { tier, fuelCost, deliveryFee, total } =
    calculateTotalPrice(selectedVolume);

  const handleOrder = () => {
    if (isAuthenticated) {
      navigate('/order');
    } else {
      navigate('/auth/login?redirect=%2Forder');
    }
  };

  return (
    <>
      <Helmet>
        <title>요금 안내 - 난방유 배달 서비스</title>
        <meta
          name="description"
          content="투명하고 합리적인 난방유 배달 요금을 확인하세요. 주문량에 따른 차등 할인과 다양한 부가 서비스를 제공합니다."
        />
      </Helmet>

      <div className="py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">
            💰 요금 안내
          </h1>
          <p className="text-orange-600 max-w-2xl mx-auto">
            투명하고 합리적인 요금제로 고품질 난방유를 제공합니다.
            <br />
            주문량이 많을수록 더 저렴하게 이용하실 수 있습니다.
          </p>
        </div>

        {/* 실시간 유가 안내 */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <TrendingDown className="h-4 w-4" />
          <AlertDescription>
            <strong>실시간 유가 정보:</strong> 현재 국제유가 하락으로 인해 지난
            달 대비 평균 8% 할인된 가격으로 공급 중입니다. (2024년 8월 기준)
          </AlertDescription>
        </Alert>

        {/* 요금 계산기 */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Calculator className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-orange-900">
                💡 요금 계산기
              </h3>
              <p className="text-orange-600 text-sm">
                필요한 난방유 양을 입력하면 총 비용을 계산해드립니다.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  주문량 (L)
                </label>
                <input
                  type="number"
                  min="200"
                  step="50"
                  value={selectedVolume}
                  onChange={(e) =>
                    setSelectedVolume(parseInt(e.target.value) || 200)
                  }
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>난방유 비용:</span>
                    <span>{fuelCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비:</span>
                    <span>
                      {deliveryFee === 0
                        ? '무료'
                        : `${deliveryFee.toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="border-t pt-2 font-semibold">
                    <div className="flex justify-between text-lg text-orange-600">
                      <span>총 금액:</span>
                      <span>{total.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-600">
                  선택된 요금제: <strong>{tier.name}</strong>
                </div>
              </div>

              <Button
                onClick={handleOrder}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
              >
                이 가격으로 주문하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 요금제 비교 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {pricingTiers.map((plan, index) => (
            <Card
              key={index}
              className={`border-2 transition-all duration-200 ${
                plan.popular
                  ? 'border-orange-300 shadow-lg scale-105'
                  : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              <CardContent className="p-6">
                {/* 헤더 */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Badge className="bg-orange-100 text-orange-800 mb-2">
                      인기 선택
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600 mb-3">
                    {plan.volume}
                  </div>
                  <div className="text-3xl font-bold text-orange-600">
                    {plan.price.toLocaleString()}원
                    <span className="text-sm text-gray-500">/L</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    배송비:{' '}
                    {plan.deliveryFee === 0
                      ? '무료'
                      : `${plan.deliveryFee.toLocaleString()}원`}
                  </div>
                </div>

                {/* 특징 */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    포함 서비스:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 주문 버튼 */}
                <Button
                  onClick={() => {
                    setSelectedVolume(
                      plan.volume.includes('이상') ? 1000 : 500
                    );
                    handleOrder();
                  }}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {plan.name} 선택
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 부가 서비스 */}
        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Truck className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-purple-900">
                🔧 부가 서비스
              </h3>
              <p className="text-purple-600 text-sm">
                난방 시설 관리에 필요한 추가 서비스도 함께 이용하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <div>
                    <div className="font-medium text-purple-900 text-sm">
                      {service.name}
                    </div>
                  </div>
                  <div className="text-purple-600 font-semibold">
                    {service.price > 0 ? '+' : ''}
                    {service.price.toLocaleString()}원
                    <span className="text-xs text-purple-500">
                      /{service.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 할인 정보 */}
        <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              💡 할인 혜택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800 mb-1">
                  정기 배송
                </div>
                <div className="text-green-600">
                  매월 정기 주문 시 L당 50원 할인
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800 mb-1">
                  신규 고객
                </div>
                <div className="text-green-600">첫 주문 시 배송비 무료</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800 mb-1">
                  대량 주문
                </div>
                <div className="text-green-600">
                  2000L 이상 주문 시 추가 5% 할인
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
