import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/app/layout/main-layout';
import {
  ErrorBoundary,
  LoadingPage,
  NotFoundPage,
} from '@starcoex-frontend/common';
import { OrderLayout } from '@/app/layout/order-layout';
import { AuthGuard } from '@/app/guards/auth-guard';
import { PortalConnectionGuard } from '@/app/guards/portal-connection-guard';
import { TrackingLayout } from '@/app/layout/tracking-layout';
import { AnonymousGuard } from '@/app/guards/anonymous-guard';
import { AuthLayout } from '@/app/layout/auth-layout';
import { HomePage } from '@/app/pages/home-page';
import { ServiceAreasPage } from '@/app/pages/service-areas-page';
import { ProductsPage } from '@/app/pages/products-page';
import { PricingPage } from '@/app/pages/pricing-page';

export const router = createBrowserRouter([
  // 🏠 메인 사이트 (공개 - 포털 연결 불필요)
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'areas',
        element: <ServiceAreasPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      // {
      //   path: 'help',
      //   element: <HelpPage />,
      // },
      // {
      //   path: 'faq',
      //   element: <FaqPage />,
      // },
      // {
      //   path: 'contact',
      //   element: <ContactPage />,
      // },
    ],
  },

  // 📦 주문 관련 (인증 + 포털 연결 필요)
  {
    path: '/order',
    element: (
      <AuthGuard>
        <PortalConnectionGuard
          showSuccessMessage={false}
          autoRetry={true}
          maxRetries={3}
        >
          <OrderLayout />
        </PortalConnectionGuard>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   index: true,
      //   element: <OrderPage />,
      // },
      // {
      //   path: 'confirm',
      //   element: <OrderConfirmPage />,
      // },
      // {
      //   path: 'success/:orderId',
      //   element: <OrderSuccessPage />,
      // },
      // {
      //   path: 'subscription',
      //   element: <SubscriptionPage />,
      // },
    ],
  },

  // 🚛 배송 추적 (공개 - 추적번호만으로 조회 가능)
  {
    path: '/tracking',
    element: <TrackingLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   index: true,
      //   element: <TrackingPage />,
      // },
      // {
      //   path: ':trackingNumber',
      //   element: <TrackingDetailPage />,
      // },
    ],
  },

  // 👤 사용자 페이지 (인증 + 포털 연결 필요)
  {
    path: '/profile',
    element: (
      <AuthGuard>
        <PortalConnectionGuard
          showSuccessMessage={true}
          autoRetry={true}
          maxRetries={3}
        >
          <MainLayout />
        </PortalConnectionGuard>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   index: true,
      //   element: <ProfilePage />,
      // },
      // {
      //   path: 'orders',
      //   element: <OrderHistoryPage />,
      // },
      // {
      //   path: 'subscriptions',
      //   element: <SubscriptionManagePage />,
      // },
    ],
  },

  // 🔐 인증 관련 라우트 (비인증 사용자만 - 포털 연결 불필요)
  {
    path: '/auth',
    element: (
      <AnonymousGuard redirectTo="/profile">
        <AuthLayout />
      </AnonymousGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   path: 'login',
      //   element: <LoginPage />,
      // },
      // {
      //   path: 'register',
      //   element: <RegisterPage />,
      // },
      {
        path: 'forgot-password',
        element: <div>Forgot Password</div>, // TODO: 구현 예정
      },
      {
        path: 'reset-password/:token',
        element: <div>Reset Password</div>, // TODO: 구현 예정
      },
      {
        path: 'callback/:provider',
        element: <div>Social Login Callback</div>, // TODO: 구현 예정
      },
    ],
  },

  // 📞 긴급 주문 (전화 안내 - 공개)
  {
    path: '/emergency',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>Emergency Order</div>, // TODO: 구현 예정
      },
    ],
  },

  // 📄 정적 페이지들 (공개)
  {
    path: '/terms',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>Terms of Service</div>, // TODO: 구현 예정
      },
    ],
  },

  {
    path: '/privacy',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>Privacy Policy</div>, // TODO: 구현 예정
      },
    ],
  },

  // 🔄 포털 연동 콜백
  {
    path: '/portal-connect',
    element: <LoadingPage message="스타코엑스 포털과 연결 중..." />,
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const token = url.searchParams.get('portal_token');
      const redirect = url.searchParams.get('redirect') || '/profile';

      if (token) {
        // 포털 토큰 저장
        localStorage.setItem('starcoex_portal_token', token);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        localStorage.setItem('starcoex_token_expiry', expiry.toISOString());
        localStorage.setItem('starcoex_portal_connected', 'true');

        // 난방유 배달 앱 인증 완료 표시
        localStorage.setItem('fuel_delivery_portal_synced', 'true');

        // 사용자 데이터 동기화
        try {
          const userResponse = await fetch('/api/auth/sync-portal-user', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            console.log('난방유 배달 앱 사용자 데이터 동기화 완료');
          }
        } catch (error) {
          console.warn('사용자 데이터 동기화 실패:', error);
        }

        window.location.href = redirect;
      } else {
        // 토큰이 없으면 포털로 리다이렉트
        window.location.href = `https://${process.env.REACT_APP_PORTAL_DOMAIN}/auth/login`;
      }

      return null;
    },
  },

  // 🚫 404 페이지
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
