import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Fuel, Shield, Thermometer, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const products = [
    {
      name: '프리미엄 난방유',
      type: 'premium',
      description:
        '최고 품질의 정제 난방유로 깨끗한 연소와 높은 열효율을 자랑합니다.',
      features: [
        '고순도 정제 (99.9%)',
        '저황 함량 (0.001% 이하)',
        '높은 열효율',
        '깨끗한 연소',
      ],
      benefits: [
        '보일러 수명 연장',
        '연료비 절약',
        '환경 친화적',
        '냄새 최소화',
      ],
      price: '1,200원/L',
      minOrder: 200,
      popular: true,
    },
    {
      name: '스탠다드 난방유',
      type: 'standard',
      description:
        '가성비 좋은 표준 품질의 난방유로 일반 가정용으로 적합합니다.',
      features: [
        '표준 정제 품질',
        '안정적인 공급',
        '경제적인 가격',
        '검증된 품질',
      ],
      benefits: [
        '경제적 부담 완화',
        '안정적인 난방',
        '믿을 수 있는 품질',
        '빠른 배송',
      ],
      price: '1,050원/L',
      minOrder: 300,
      popular: false,
    },
    {
      name: '친환경 바이오 난방유',
      type: 'eco',
      description: '바이오 연료가 혼합된 친환경 난방유로 탄소 배출을 줄입니다.',
      features: [
        '바이오 연료 20% 혼합',
        '탄소 배출 저감',
        '재생 가능 에너지',
        '정부 인증 제품',
      ],
      benefits: [
        '환경 보호 기여',
        '탄소중립 실천',
        '정부 지원 혜택',
        '미래형 연료',
      ],
      price: '1,350원/L',
      minOrder: 500,
      popular: false,
    },
  ];

  const handleOrder = (productType: string) => {
    if (isAuthenticated) {
      navigate(`/order?product=${productType}`);
    } else {
      navigate(
        `/auth/login?redirect=${encodeURIComponent(
          `/order?product=${productType}`
        )}`
      );
    }
  };

  const getProductBadge = (type: string, popular: boolean) => {
    if (popular) {
      return <Badge className="bg-red-100 text-red-800">인기 상품</Badge>;
    }
    switch (type) {
      case 'premium':
        return (
          <Badge className="bg-purple-100 text-purple-800">프리미엄</Badge>
        );
      case 'eco':
        return <Badge className="bg-green-100 text-green-800">친환경</Badge>;
      default:
        return <Badge variant="outline">스탠다드</Badge>;
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'premium':
        return <Award className="w-8 h-8 text-purple-600" />;
      case 'eco':
        return <Shield className="w-8 h-8 text-green-600" />;
      default:
        return <Fuel className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>난방유 제품 안내 - 난방유 배달 서비스</title>
        <meta
          name="description"
          content="프리미엄부터 친환경까지 다양한 난방유 제품을 만나보세요. 고품질 정제유로 효율적인 난방을 경험하세요."
        />
      </Helmet>

      <div className="py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">
            ⛽ 난방유 제품 안내
          </h1>
          <p className="text-orange-600 max-w-2xl mx-auto">
            다양한 품질의 난방유 제품을 준비했습니다.
            <br />
            고객님의 필요에 맞는 최적의 제품을 선택하세요.
          </p>
        </div>

        {/* 제품 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product, index) => (
            <Card
              key={index}
              className={`border-2 hover:shadow-lg transition-all duration-200 ${
                product.popular
                  ? 'border-red-300 shadow-md'
                  : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              <CardContent className="p-6">
                {/* 헤더 */}
                <div className="text-center mb-6">
                  {getProductIcon(product.type)}
                  <h3 className="text-xl font-bold text-orange-900 mt-3 mb-2">
                    {product.name}
                  </h3>
                  {getProductBadge(product.type, product.popular)}
                </div>

                {/* 설명 */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* 가격 */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    최소 주문량: {product.minOrder}L
                  </div>
                </div>

                {/* 특징 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    제품 특징:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* 장점 */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    주요 장점:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* 주문 버튼 */}
                <Button
                  onClick={() => handleOrder(product.type)}
                  className={`w-full ${
                    product.popular
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {product.name} 주문하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 품질 보증 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Thermometer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                🏆 품질 보증
              </h3>
              <p className="text-blue-700 mb-6">
                모든 난방유 제품은 엄격한 품질 관리를 거쳐 공급됩니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🔬</div>
                  <div className="font-semibold text-blue-800">품질 검사</div>
                  <div className="text-sm text-blue-600">매 배치 검증</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-semibold text-blue-800">인증 관리</div>
                  <div className="text-sm text-blue-600">정부 인증 완료</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🚛</div>
                  <div className="font-semibold text-blue-800">안전 운송</div>
                  <div className="text-sm text-blue-600">전용 탱크차</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-semibold text-blue-800">품질 보장</div>
                  <div className="text-sm text-blue-600">100% 책임 보상</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
