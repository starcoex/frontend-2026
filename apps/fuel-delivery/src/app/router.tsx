import { createBrowserRouter, Outlet } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, NotFoundPage } from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';
import { ProtectedLayout } from '@/app/layout/protected-layout';
import { AuthLayout } from '@/app/layout/auth-layout';
import { BottomNav } from '@/components/button-nav/botton-nav';

// ─── 로딩 컴포넌트 ───────────────────────────────────────────────────────────
const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
  </div>
);
const S = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

// ─── 공개 페이지 ─────────────────────────────────────────────────────────────
const HomePage = lazy(() =>
  import('@/app/pages/home-page').then((m) => ({ default: m.HomePage }))
);
const ServiceAreasPage = lazy(() =>
  import('@/app/pages/service-areas-page').then((m) => ({
    default: m.ServiceAreasPage,
  }))
);
const ProductsPage = lazy(() =>
  import('@/app/pages/products-page').then((m) => ({ default: m.ProductsPage }))
);
const PricingPage = lazy(() =>
  import('@/app/pages/pricing-page').then((m) => ({ default: m.PricingPage }))
);
const AboutPage = lazy(() =>
  import('@/app/pages/about/about-page').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('@/app/pages/contact/contact-page').then((m) => ({
    default: m.ContactPage,
  }))
);

// ─── 인증 페이지 ─────────────────────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@/app/pages/auth/login').then((m) => ({ default: m.LoginPage }))
);

// ─── 보호된 페이지 ───────────────────────────────────────────────────────────
// const ProfilePage = lazy(() =>
//   import('@/app/pages/profile/profile-page').then((m) => ({
//     default: m.ProfilePage,
//   }))
// );

// ─── BottomNav가 포함된 최상위 래퍼 (RootLayout 대체) ──────────────────────
// 별도 파일 없이 router 내부에서 인라인으로 정의
const AppShell = () => (
  <>
    <Outlet />
    <BottomNav />
  </>
);

export const router = createBrowserRouter([
  {
    // ✅ AppShell: BottomNav 전역 제공 (Router 컨텍스트 내부)
    element: <AppShell />,
    errorElement: <ErrorBoundary />,
    children: [
      // 🏠 공개 페이지 (MainLayout)
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: S(HomePage) },
          { path: 'areas', element: S(ServiceAreasPage) },
          { path: 'products', element: S(ProductsPage) },
          { path: 'pricing', element: S(PricingPage) },
          { path: 'about', element: S(AboutPage) },
          { path: 'contact', element: S(ContactPage) },
          { path: 'terms', element: <div>Terms of Service</div> },
          { path: 'privacy', element: <div>Privacy Policy</div> },
          { path: 'emergency', element: <div>Emergency Order</div> },
          // 🚛 배송 추적 — tracking-layout 제거, 페이지에서 직접 UI 처리
          { path: 'tracking', element: <div>Tracking Page</div> },
          {
            path: 'tracking/:trackingNumber',
            element: <div>Tracking Detail</div>,
          },
          // 📦 주문 — order-layout 제거, 페이지에서 직접 처리
          { path: 'order', element: <div>Order Page</div> },
          { path: 'order/confirm', element: <div>Order Confirm</div> },
          { path: 'order/success/:orderId', element: <div>Order Success</div> },
        ],
      },

      // 👤 보호된 페이지 (ProtectedLayout)
      // {
      //   path: '/profile',
      //   element: <ProtectedLayout />,
      //   children: [
      //     { index: true, element: S(ProfilePage) },
      //     // { path: 'orders', element: S(OrderHistoryPage) },
      //   ],
      // },

      // 🔐 인증 (AuthLayout) - BottomNav 숨김은 bottom-nav.tsx 내부에서 처리
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: S(LoginPage) },
          { path: 'forgot-password', element: <div>Forgot Password</div> },
          { path: 'reset-password/:token', element: <div>Reset Password</div> },
          { path: 'callback/:provider', element: <div>Social Callback</div> },
        ],
      },

      // 🚫 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
