import { createBrowserRouter } from 'react-router-dom';
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
import { DashboardLayout } from '@/app/layout/dashboard-layout';
import { MainLayout } from '@/app/layout/main-layout';
import { AuthLayout } from '@/app/layout/auth-layout';
import { HomePage } from '@/app/pages/home-page';
import { MembershipPage } from '@/app/pages/membership-page';
import { LocationPage } from '@/app/pages/location-page';
import AboutPage from '@/app/pages/about-page';
import { FaqPage } from '@/app/pages/faq-page';
import ContactPage from '@/app/pages/contact-page';
import { PricesPage } from '@/app/pages/prices-page';
import { ProcessPage } from '@/app/pages/process-page';
import { ServicesPage } from '@/app/pages/wash/services-page';
import { ServiceDetailPage } from '@/app/pages/wash/service-detail-page';
import { CarWashPage } from '@/app/pages/wash/car-wash-page';
import { PurchasePage } from '@/app/pages/purchase/purchase-page';
import { ProfilePage } from '@/app/pages/profile/profile-page';
import { LoginPage } from '@/app/pages/auth/login';
import { RegisterTypePage } from '@/app/pages/auth/register-type-page';
import { PersonalRegisterPage } from '@/app/pages/auth/personal-register-page';
import { GiftClaimPage } from '@/app/pages/gift/gift-claim-page';
import { CouponsPage } from '@/app/pages/coupons/coupons-page';
import { CouponDetailPage } from '@/app/pages/coupons/coupon-detail-page';
import { CouponExchangePage } from '@/app/pages/coupons/coupon-excahange-page';
import { CouponGiftPage } from '@/app/pages/coupons/coupon-gift-page';
import OrdersPage from '@/app/pages/orders/orders-page';
import OrderDetailPage from '@/app/pages/orders/orders-detail-page';
import { NotificationsPage } from '@/app/pages/notifications/notifications-page';
import { CartPage } from '@/app/pages/cart/cart-page';

export const router = createBrowserRouter([
  // 🏠 메인 사이트 (공개)
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // 홈
      { index: true, element: <HomePage /> },

      // 최상위 메뉴
      { path: 'prices', element: <PricesPage /> },
      { path: 'membership', element: <MembershipPage /> },
      { path: 'location', element: <LocationPage /> },

      // 구매 메뉴
      { path: 'fuel', element: <PurchasePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:serviceId', element: <ServiceDetailPage /> },
      { path: 'fuel/car-wash-coupon', element: <CarWashPage /> },

      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },

      // 회사 정보 메뉴
      { path: 'about', element: <AboutPage /> },
      { path: 'process', element: <ProcessPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      // 🔔 알림 페이지 (로그인 사용자)
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'cart', element: <CartPage /> },

      // 🎁 선물 수령 페이지 (비로그인도 접근 가능, 수령 시 로그인 필요)
      { path: 'gift/claim', element: <GiftClaimPage /> },
    ],
  },

  // 🔐 대시보드 (인증 필요)
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },

      // 🎫 쿠폰 관련 페이지들 (인증 필요)
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'coupons/:code', element: <CouponDetailPage /> },
      { path: 'coupons/exchange', element: <CouponExchangePage /> },
      { path: 'coupons/gift', element: <CouponGiftPage /> },
      { path: 'coupons/gift/:code', element: <CouponGiftPage /> }, // 특정 쿠폰 선물
    ],
  },

  // 📦 추적 (인증 필요)
  {
    path: '/tracking',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [],
  },

  // 🔑 인증 페이지들
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
        element: <RegisterTypePage />,
      },
      {
        path: 'register/personal',
        element: <PersonalRegisterPage />, // 개인 회원가입 (소셜 로그인 포함)
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
      // 소셜 이메일 인증
      {
        path: 'verify-social',
        element: <VerifySocialEmailPage />,
      },
      // 소셜 이메일 인증 코드 입력
      {
        path: 'verify-social-code',
        element: <VerifySocialEmailCodePage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'verify-phone',
        element: <VerifyPhonePage />,
      },
    ],
  },

  // 🚫 404 페이지
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
