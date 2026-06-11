import { createBrowserRouter, Outlet } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import {
  ErrorBoundary,
  ForgotPasswordPage,
  NotFoundPage,
  ResetPasswordPage,
  VerifyEmailPage,
  VerifyPhonePage,
  VerifySocialEmailCodePage,
  VerifySocialEmailPage,
} from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';
import { AuthLayout } from '@/app/layout/auth-layout';
import { DashboardLayout } from '@/app/layout/dashboard-layout';
import { APP_CONFIG } from '@/app/config/app.config';
import { BottomNav } from '@/components/button-nav/botton-nav';

// ─── 로딩 컴포넌트 ───────────────────────────────────────────────────────────
const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
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
const SpeedPage = lazy(() =>
  import('@/app/pages/speed-page').then((m) => ({ default: m.SpeedPage }))
);
const StoreListPage = lazy(() =>
  import('@/components/queue/store-list-page').then((m) => ({
    default: m.StoreListPage,
  }))
);
const StoreDetailPage = lazy(() =>
  import('@/components/queue/store-detail-page').then((m) => ({
    default: m.StoreDetailPage,
  }))
);
const QueueStatusPage = lazy(() =>
  import('@/app/pages/queue-status-page').then((m) => ({
    default: m.QueueStatusPage,
  }))
);
const PrivacyPage = lazy(() =>
  import('@/app/pages/legal/privacy-page').then((m) => ({
    default: m.PrivacyPage,
  }))
);
const TermsPageCarWash = lazy(() =>
  // ★ 추가
  import('@/app/pages/legal/terms-page').then((m) => ({
    default: m.TermsPageCarWash,
  }))
);
const AboutPage = lazy(() =>
  import('@/app/pages/about/about-page').then((m) => ({ default: m.AboutPage }))
);
const PricingPage = lazy(() =>
  import('@/app/pages/pricing/pricing-page').then((m) => ({
    default: m.PricingPage,
  }))
);
const ChangelogPage = lazy(() =>
  import('@/app/pages/changelog/changelog-page').then((m) => ({
    default: m.ChangelogPage,
  }))
);

// ─── 인증 페이지 ─────────────────────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@/app/pages/auth/login').then((m) => ({ default: m.LoginPage }))
);
const RegisterTypePage = lazy(() =>
  import('@/app/pages/auth/register-type-page').then((m) => ({
    default: m.RegisterTypePage,
  }))
);
const PersonalRegisterPage = lazy(() =>
  import('@/app/pages/auth/personal-register-page').then((m) => ({
    default: m.PersonalRegisterPage,
  }))
);

// const TermsPage = lazy(() =>
//   import('@/app/pages/term/terms-page').then((m) => ({
//     default: m.TermsPageRoute,
//   }))
// );

// ─── 대시보드 (인증 필요) ────────────────────────────────────────────────────
// const ProfilePage = lazy(() =>
//   import('@/app/pages/dashboard/profile-page').then((m) => ({ default: m.ProfilePage }))
// );

// ─── AppShell: BottomNav 전역 제공 (Router 컨텍스트 내부) ────────────────────
const AppShell = () => (
  <>
    <Outlet />
    <BottomNav />
  </>
);

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <ErrorBoundary />,
    children: [
      // 🏠 공개 페이지
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: S(HomePage) },
          { path: APP_CONFIG.routes.privacy, element: S(PrivacyPage) },
          { path: 'terms', element: S(TermsPageCarWash) }, // ★ 추가
          { path: APP_CONFIG.routes.about, element: S(AboutPage) },
          // 📄 약관 및 정책
          // { path: 'terms', element: S(TermsPage) },
          // { path: 'privacy', element: S(TermsPage) },
          { path: APP_CONFIG.routes.pricing, element: S(PricingPage) },
          { path: 'changelog', element: S(ChangelogPage) },

          // ⚡ 스피드 존
          { path: 'speed', element: S(SpeedPage) },
          // { path: 'speed/queue', element: S(QueuePage) },

          // 🏪 지점 목록 & 상세
          { path: 'stores', element: S(StoreListPage) },
          { path: 'stores/:storeId', element: S(StoreDetailPage) },
          { path: 'queue-status', element: S(QueueStatusPage) },

          // 💎 프리미엄 존
          // { path: 'premium', element: S(PremiumPage) },
          // { path: 'premium/booking', element: S(PremiumBookingPage) },

          // 📋 예약 내역 (로그인 사용자)
          // { path: 'bookings', element: S(BookingsPage) },
          // { path: 'bookings/:id', element: S(BookingDetailPage) },

          // 🔔 알림 (로그인 사용자)
          // { path: 'notifications', element: S(NotificationsPage) },
        ],
      },

      // 🔐 대시보드 (인증 필요) - BottomNav 숨김
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          // { index: true, element: S(ProfilePage) },
          // { path: 'vehicles', element: S(VehiclesPage) },
          // { path: 'history', element: S(HistoryPage) },
        ],
      },

      // 🔑 인증 - BottomNav 숨김
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: S(LoginPage) },
          { path: 'register', element: S(RegisterTypePage) },
          { path: 'register/personal', element: S(PersonalRegisterPage) },
          { path: 'verify-email', element: <VerifyEmailPage /> },
          { path: 'verify-social', element: <VerifySocialEmailPage /> },
          {
            path: 'verify-social-code',
            element: <VerifySocialEmailCodePage />,
          },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
          { path: 'verify-phone', element: <VerifyPhonePage /> },
        ],
      },

      // 🚫 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
