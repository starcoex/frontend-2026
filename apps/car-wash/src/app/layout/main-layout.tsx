import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { QuickActionFab } from '../components/quick-action-fab';
import { NavigationProvider } from '../components/providers/navigation-provider';
import {
  PageHead,
  CartProvider,
  NotificationProvider,
  TooltipProvider,
} from '@starcoex-platform/shadcn-ui';
import { APP_CONFIG } from '../config/app.config';
import { CarWashCTA } from '../components/sections/cta';
import { ApiClient, CartService } from '@starcoex-platform/api-client';

export const MainLayout: React.FC = () => {
  // API 클라이언트와 서비스 생성
  const apiClient = new ApiClient();
  const cartService = new CartService(apiClient);
  // NotificationService는 static 클래스이므로 인스턴스 생성 불필요
  // const notificationService = new NotificationService(apiClient); // ❌ 제거

  return (
    <TooltipProvider>
      <NavigationProvider>
        {/* Provider 래핑 */}
        <CartProvider
          cartService={cartService}
          onCheckout={() => (window.location.href = '/checkout')}
          onItemClick={(item) =>
            (window.location.href = `/services/${item.id}`)
          }
        >
          <NotificationProvider
            // notificationService prop 제거 - NotificationService는 static이므로 불필요
            onNotificationClick={(notification) => {
              if (notification.href) {
                window.location.href = notification.href;
              }
            }}
          >
            {/* 기본 앱 메타데이터 */}
            <PageHead
              title="프리미엄 세차 서비스 - 제주도 최고의 세차장"
              description="제주도에서 가장 믿을 수 있는 프리미엄 세차 서비스. 친환경 세제와 전문 기술로 당신의 소중한 차량을 새것처럼 관리해드립니다."
              siteName="제주 프리미엄 카워시"
              url={`https://${APP_CONFIG.app.currentDomain}`}
              keywords={[
                '제주도 세차',
                '프리미엄 세차',
                '자동차 세차',
                '광택 서비스',
                '친환경 세차',
                '차량 관리',
                '자동차 미용',
                '왁싱 서비스',
                '세차 예약',
                '제주 세차장',
              ]}
              robots="index, follow"
            />

            <div className="min-h-screen transition-all duration-300">
              {/* 헤더 */}
              <Header />

              {/* 메인 콘텐츠 */}
              <main className="flex-1">
                <Outlet />
              </main>

              {/* 세차 CTA 섹션 */}
              <CarWashCTA />

              {/* 푸터 */}
              <Footer />

              {/* 플로팅 액션 버튼 */}
              <QuickActionFab />
            </div>
          </NotificationProvider>
        </CartProvider>
      </NavigationProvider>
    </TooltipProvider>
  );
};
