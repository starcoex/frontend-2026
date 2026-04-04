import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layout/main-layout';
import { AuthLayout } from './layout/auth-layout';
//
// // 메인 페이지들
import { HomePage } from '';
import { ServicesPage } from './pages/services-page';

// // 인증 페이지들 (간단한 소셜 로그인만)
import { LoginPage } from './pages/auth/login';
import { RegisterPage } from '../pages/auth/register';
// import { SocialCallbackPage } from './pages/auth/social-callback-page';

// 공통 컴포넌트
import {
  ErrorBoundary,
  LoadingPage,
  NotFoundPage,
} from '@starcoex-platform/shadcn-ui';

// 라우트 가드
import { AuthGuard } from '../components/guards/auth-guard';
import BookingPage from '../pages/booking-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // 🏠 홈페이지
      {
        index: true,
        element: <HomePage />,
      },
      //
      // // 📋 서비스 안내
      {
        path: 'services',
        element: <ServicesPage />,
      },

      {
        path: 'booking',
        element: <BookingPage />,
      },
      // {
      //   path: 'about',
      //   element: <AboutPage />,
      // },
      //
      // // 📱 실시간 추적 (인증 필요 없음 - 예약번호로 접근)
      // {
      //   path: 'tracking',
      //   children: [
      //     {
      //       index: true,
      //       element: <TrackingPage />,
      //     },
      //     {
      //       path: ':bookingId',
      //       element: <TrackingDetailPage />,
      //     },
      //   ],
      // },
    ],
  },

  // 🎯 예약 플로우 (별도 레이아웃)
  // {
  //   path: '/booking',
  //   element: (
  //     <AuthGuard>
  //       <PortalConnectionGuard>
  //         <BookingLayout />
  //       </PortalConnectionGuard>
  //     </AuthGuard>
  //   ),
  //   errorElement: <ErrorBoundary />,
  //   children: [
  //     // {
  //     //   index: true,
  //     //   element: <BookingPage />,
  //     // },
  //     // {
  //     //   path: 'confirm',
  //     //   element: <BookingConfirmPage />,
  //     // },
  //     // {
  //     //   path: 'success/:bookingId',
  //     //   element: <BookingSuccessPage />,
  //     // },
  //   ],
  // },

  // 👤 사용자 페이지 (인증 필요)
  {
    path: '/profile',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   index: true,
      //   element: <ProfilePage />,
      // },
      // {
      //   path: 'history',
      //   element: <BookingHistoryPage />,
      // },
      // {
      //   path: 'settings',
      //   element: <SettingsPage />,
      // },
    ],
  },

  // 🔐 인증 관련 라우트 (간단한 소셜 로그인)
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      // {
      //   path: 'callback/:provider',
      //   element: <SocialCallbackPage />,
      // },
    ],
  },

  // 🔄 포털 연동 관련 (숨겨진 라우트)
  {
    path: '/portal-connect',
    element: <LoadingPage message="포털과 연결 중..." />,
    loader: async ({ request }) => {
      // 포털에서 전달된 토큰으로 자동 로그인 처리
      const url = new URL(request.url);
      const token = url.searchParams.get('portal_token');
      const redirect = url.searchParams.get('redirect') || '/';

      if (token) {
        // 포털 토큰 저장 및 인증 처리
        localStorage.setItem('portal_token', token);
        window.location.href = redirect;
      } else {
        window.location.href = '/auth/login';
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
