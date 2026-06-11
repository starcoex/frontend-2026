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
import { BottomNav } from '@/components/button-nav/bottom-nav';

// ─── 로딩 컴포넌트 ───────────────────────────────────────────────────────────
const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
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
const PricesPage = lazy(() =>
  import('@/app/pages/prices-page').then((m) => ({ default: m.PricesPage }))
);
const MembershipPage = lazy(() =>
  import('@/app/pages/membership-page').then((m) => ({
    default: m.MembershipPage,
  }))
);
const LocationPage = lazy(() =>
  import('@/app/pages/location-page').then((m) => ({ default: m.LocationPage }))
);
const AboutPage = lazy(() =>
  import('@/app/pages/about-page').then((m) => ({ default: m.default }))
);
const ProcessPage = lazy(() =>
  import('@/app/pages/process-page').then((m) => ({ default: m.ProcessPage }))
);
const FaqPage = lazy(() =>
  import('@/app/pages/faq-page').then((m) => ({ default: m.FaqPage }))
);
const ContactPage = lazy(() =>
  import('@/app/pages/contact-page').then((m) => ({ default: m.default }))
);

// ─── 구매 ────────────────────────────────────────────────────────────────────
const PurchasePage = lazy(() =>
  import('@/app/pages/purchase/purchase-page').then((m) => ({
    default: m.PurchasePage,
  }))
);
const ServicesPage = lazy(() =>
  import('@/app/pages/wash/services-page').then((m) => ({
    default: m.ServicesPage,
  }))
);
const ServiceDetailPage = lazy(() =>
  import('@/app/pages/wash/service-detail-page').then((m) => ({
    default: m.ServiceDetailPage,
  }))
);
const CarWashPage = lazy(() =>
  import('@/app/pages/wash/car-wash-page').then((m) => ({
    default: m.CarWashPage,
  }))
);

// ─── 주문 / 알림 / 장바구니 ──────────────────────────────────────────────────
const OrdersPage = lazy(() =>
  import('@/app/pages/orders/orders-page').then((m) => ({ default: m.default }))
);
const OrderDetailPage = lazy(() =>
  import('@/app/pages/orders/orders-detail-page').then((m) => ({
    default: m.default,
  }))
);
const NotificationsPage = lazy(() =>
  import('@/app/pages/notifications/notifications-page').then((m) => ({
    default: m.NotificationsPage,
  }))
);
const CartPage = lazy(() =>
  import('@/app/pages/cart/cart-page').then((m) => ({ default: m.CartPage }))
);
const GasChatWithProvider = lazy(() =>
  import('@/app/pages/chat/gas-chat-with-provider').then((m) => ({
    default: m.GasChatWithProvider,
  }))
);
const GiftClaimPage = lazy(() =>
  import('@/app/pages/gift/gift-claim-page').then((m) => ({
    default: m.GiftClaimPage,
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

// ─── 대시보드 (인증 필요) ────────────────────────────────────────────────────
const ProfilePage = lazy(() =>
  import('@/app/pages/profile/profile-page').then((m) => ({
    default: m.ProfilePage,
  }))
);
const CouponsPage = lazy(() =>
  import('@/app/pages/coupons/coupons-page').then((m) => ({
    default: m.CouponsPage,
  }))
);
const CouponDetailPage = lazy(() =>
  import('@/app/pages/coupons/coupon-detail-page').then((m) => ({
    default: m.CouponDetailPage,
  }))
);
const CouponExchangePage = lazy(() =>
  import('@/app/pages/coupons/coupon-excahange-page').then((m) => ({
    default: m.CouponExchangePage,
  }))
);
const CouponGiftPage = lazy(() =>
  import('@/app/pages/coupons/coupon-gift-page').then((m) => ({
    default: m.CouponGiftPage,
  }))
);

const TermsPage = lazy(() =>
  import('@/app/pages/term/terms-page').then((m) => ({
    default: m.TermsPageRoute,
  }))
);
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

          // 최상위 메뉴
          { path: 'prices', element: S(PricesPage) },
          { path: 'membership', element: S(MembershipPage) },
          { path: 'location', element: S(LocationPage) },

          // 구매 메뉴
          { path: 'fuel', element: S(PurchasePage) },
          { path: 'services', element: S(ServicesPage) },
          { path: 'services/:serviceId', element: S(ServiceDetailPage) },
          { path: 'fuel/car-wash-coupon', element: S(CarWashPage) },

          // 주문
          { path: 'orders', element: S(OrdersPage) },
          { path: 'orders/:id', element: S(OrderDetailPage) },

          // 회사 정보
          { path: 'about', element: S(AboutPage) },
          { path: 'process', element: S(ProcessPage) },
          { path: 'faq', element: S(FaqPage) },
          { path: 'contact', element: S(ContactPage) },

          // 📄 약관 및 정책
          { path: 'terms', element: S(TermsPage) },
          { path: 'privacy', element: S(TermsPage) },

          // 로그인 사용자 기능
          { path: 'notifications', element: S(NotificationsPage) },
          { path: 'cart', element: S(CartPage) },
          { path: 'chat', element: S(GasChatWithProvider) },

          // 선물 수령 (비로그인 접근 가능, 수령 시 로그인 필요)
          { path: 'gift/claim', element: S(GiftClaimPage) },
        ],
      },

      // 🔐 대시보드 (인증 필요) - BottomNav 숨김
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: S(ProfilePage) },
          { path: 'coupons', element: S(CouponsPage) },
          { path: 'coupons/:code', element: S(CouponDetailPage) },
          { path: 'coupons/exchange', element: S(CouponExchangePage) },
          { path: 'coupons/gift', element: S(CouponGiftPage) },
          { path: 'coupons/gift/:code', element: S(CouponGiftPage) },
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
