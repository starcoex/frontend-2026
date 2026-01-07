import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const OrderLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 주문 단계별 진행률
  const getOrderProgress = () => {
    const path = location.pathname;

    if (path === '/order') {
      return {
        step: 1,
        progress: 25,
        title: '상품 선택',
        description: '필요한 연료를 선택하세요',
      };
    }
    if (path === '/order/confirm') {
      return {
        step: 2,
        progress: 75,
        title: '주문 확인',
        description: '주문 정보를 확인해주세요',
      };
    }
    if (path.includes('/order/success')) {
      return {
        step: 3,
        progress: 100,
        title: '주문 완료',
        description: '주문이 완료되었습니다',
      };
    }
    if (path === '/order/subscription') {
      return {
        step: 1,
        progress: 33,
        title: '정기 배송 설정',
        description: '정기 배송을 설정하세요',
      };
    }

    return {
      step: 1,
      progress: 25,
      title: '난방유 주문',
      description: '주문을 시작하세요',
    };
  };

  const orderInfo = getOrderProgress();

  const handleBack = () => {
    if (location.pathname === '/order') {
      navigate('/');
    } else if (location.pathname === '/order/confirm') {
      navigate('/order');
    } else if (location.pathname === '/order/subscription') {
      navigate('/order');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900">
      {/* 주문 전용 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 뒤로가기 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 h-auto hover:bg-orange-50"
            >
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </Button>

            {/* 진행 단계 */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="text-center mb-3">
                <h1 className="text-lg font-bold text-orange-900">
                  {orderInfo.title}
                </h1>
                <p className="text-xs text-orange-600">
                  {orderInfo.description}
                </p>
              </div>

              <Progress
                value={orderInfo.progress}
                className="h-2 bg-orange-100"
              />

              {/* 단계 인디케이터 */}
              <div className="flex justify-between mt-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      orderInfo.step >= 1
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-400'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-orange-600 font-medium">
                    상품 선택
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      orderInfo.step >= 2
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-orange-600 font-medium">
                    주문 확인
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      orderInfo.step >= 3
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-100 text-orange-400'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-orange-600 font-medium">
                    배송 완료
                  </span>
                </div>
              </div>
            </div>

            {/* 사용자 정보 */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-800"
                >
                  {currentUser.name}님
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 주문 안내 바 */}
      {orderInfo.step < 3 && (
        <div className="bg-orange-100 dark:bg-orange-950/30 border-b border-orange-200/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-orange-600">
                <Calendar className="w-4 h-4" />
                <span>당일 배송 (오후 2시 전 주문)</span>
              </div>

              <div className="w-px h-4 bg-orange-300" />

              <div className="flex items-center gap-2 text-orange-600">
                <MapPin className="w-4 h-4" />
                <span>서울/경기 배송 가능</span>
              </div>

              <div className="w-px h-4 bg-orange-300" />

              <div className="flex items-center gap-2 text-orange-600">
                <CreditCard className="w-4 h-4" />
                <span>10만원 이상 무료배송</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-6">
        <Outlet />
      </main>

      {/* 주문 도움말 플로팅 */}
      {orderInfo.step < 3 && (
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => {
              window.open('tel:1588-9999');
            }}
          >
            <span className="text-sm">📞 전화 주문: 1588-9999</span>
          </Button>
        </div>
      )}

      {/* 긴급 주문 안내 (겨울철) */}
      {(() => {
        const currentMonth = new Date().getMonth() + 1;
        const isWinter = [11, 12, 1, 2, 3].includes(currentMonth);

        return (
          isWinter &&
          orderInfo.step < 3 && (
            <div className="fixed top-20 right-6 z-40 max-w-xs">
              <div className="bg-red-500 text-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔥</span>
                  <span className="font-semibold text-sm">
                    겨울철 긴급 배송
                  </span>
                </div>
                <p className="text-xs mb-2">
                  한파 특보 시 24시간 긴급 배송 가능
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-white text-white hover:bg-white hover:text-red-500"
                  onClick={() => window.open('tel:1588-7777')}
                >
                  긴급 주문: 1588-7777
                </Button>
              </div>
            </div>
          )
        );
      })()}
    </div>
  );
};
