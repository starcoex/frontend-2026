import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Truck, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TrackingLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 추적 페이지 타입 확인
  const getTrackingPageType = () => {
    if (location.pathname === '/tracking') {
      return {
        type: 'search',
        title: '배송 추적',
        description: '운송장 번호로 배송 상태를 확인하세요',
      };
    }
    if (location.pathname.includes('/tracking/')) {
      return {
        type: 'detail',
        title: '실시간 배송 추적',
        description: '배송 상태를 실시간으로 확인할 수 있습니다',
      };
    }
    return {
      type: 'search',
      title: '배송 추적',
      description: '배송 상태를 확인하세요',
    };
  };

  const pageInfo = getTrackingPageType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white dark:from-blue-900/10 dark:via-sky-900/10 dark:to-gray-900">
      {/* 추적 전용 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 뒤로가기 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 h-auto hover:bg-blue-50"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </Button>

            {/* 제목 */}
            <div className="flex-1 text-center mx-4">
              <h1 className="text-lg font-bold text-blue-900 mb-1">
                {pageInfo.title}
              </h1>
              <p className="text-xs text-blue-600">{pageInfo.description}</p>
            </div>

            {/* 추적 아이콘 */}
            <div className="flex items-center gap-2">
              {pageInfo.type === 'search' ? (
                <Search className="w-5 h-5 text-blue-600" />
              ) : (
                <Truck className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 추적 안내 바 */}
      <div className="bg-blue-100 dark:bg-blue-950/30 border-b border-blue-200/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>실시간 GPS 추적</span>
            </div>

            <div className="w-px h-4 bg-blue-300" />

            <div className="flex items-center gap-2 text-blue-600">
              <span>📱</span>
              <span>SMS 알림 발송</span>
            </div>

            <div className="w-px h-4 bg-blue-300" />

            <div className="flex items-center gap-2 text-blue-600">
              <Phone className="w-4 h-4" />
              <span>배송 문의: 1588-8888</span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-6">
        <Outlet />
      </main>

      {/* 추적 도움말 */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 p-3 max-w-xs">
          <div className="flex items-start gap-2 mb-2">
            <Truck className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-xs text-blue-900">
                추적 도움말
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                운송장 번호는 주문 완료 문자로 발송됩니다
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              • 형식: FD-YYYYMMDD-####
            </div>
            <div className="text-xs text-muted-foreground">
              • 예시: FD-20241215-1234
            </div>
          </div>
        </div>
      </div>

      {/* 배송 문의 플로팅 버튼 */}
      {pageInfo.type === 'detail' && (
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            onClick={() => window.open('tel:1588-8888')}
          >
            <Phone className="w-4 h-4 mr-2" />
            배송 문의
          </Button>
        </div>
      )}

      {/* 긴급 배송 상황 알림 */}
      {(() => {
        const currentHour = new Date().getHours();
        const isLateEvening = currentHour >= 20 || currentHour <= 6;

        return (
          isLateEvening && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-sm">
              <div className="bg-amber-500 text-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🌙</span>
                  <Badge
                    variant="outline"
                    className="text-xs border-white text-white"
                  >
                    야간 시간
                  </Badge>
                </div>
                <p className="text-xs">
                  현재 야간 시간입니다. 일부 배송이 지연될 수 있어요.
                </p>
              </div>
            </div>
          )
        );
      })()}
    </div>
  );
};
