import { createBrowserRouter, Outlet } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import {
  ErrorBoundary,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFoundAnimation,
  VerifyEmailPage,
  VerifySocialEmailPage,
  SocialCallbackPage,
  VerifySocialEmailCodePage,
  VerifyPhonePage,
} from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';
import { AuthLayout } from '@/app/layout/auth-layout';
import { ProtectedLayout } from '@/app/layout/protected-layout';
import { BottomNav } from '@/components/button-nav/botton-nav';

// ─── 로딩 컴포넌트 ───────────────────────────────────────────────────────────
const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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

// ─── 회사소개 ────────────────────────────────────────────────────────────────
const AboutPage = lazy(() =>
  import('@/app/pages/about/about-page').then((m) => ({ default: m.AboutPage }))
);
const PhilosophyPage = lazy(() =>
  import('@/app/pages/about/philosophy-page').then((m) => ({
    default: m.PhilosophyPage,
  }))
);
const HistoryPage = lazy(() =>
  import('@/app/pages/about/history-page').then((m) => ({
    default: m.HistoryPage,
  }))
);
const CiPage = lazy(() =>
  import('@/app/pages/about/ci-page').then((m) => ({ default: m.CiPage }))
);
const CareersPage = lazy(() =>
  import('@/app/pages/about/careers-page').then((m) => ({
    default: m.CareersPage,
  }))
);
const CareerDetailPage = lazy(() =>
  import('@/app/pages/about/career-detail-page').then((m) => ({
    default: m.CareerDetailPage,
  }))
);
const ContactPage = lazy(() =>
  import('@/app/pages/contact/contact-page').then((m) => ({
    default: m.ContactPage,
  }))
);
const FaqPage = lazy(() =>
  import('@/app/pages/faq/faq-page').then((m) => ({ default: m.FaqPage }))
);

// ─── 약관 ────────────────────────────────────────────────────────────────────
const TermsPage = lazy(() =>
  import('@/app/pages/term/terms-page').then((m) => ({
    default: m.TermsPageRoute,
  }))
);

// ─── 인증 페이지 ─────────────────────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@/app/pages/auth/login-page').then((m) => ({ default: m.LoginPage }))
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
const IdentityRegisterPage = lazy(() =>
  import('@/app/pages/auth/identity-register-page').then((m) => ({
    default: m.IdentityRegisterPage,
  }))
);

// ─── 보호된 페이지 : 사용자 ──────────────────────────────────────────────────
const OnboardingPage = lazy(() =>
  import('@/app/pages/onboarding/onboarding-page').then((m) => ({
    default: m.OnboardingPage,
  }))
);
const DashboardPage = lazy(
  () => import('@/app/pages/dashboard/dashboard.page')
);
const ProfilePage = lazy(() =>
  import('@/app/pages/user/profile.page').then((m) => ({
    default: m.ProfilePage,
  }))
);
const SecurityPage = lazy(() =>
  import('@/app/pages/user/security.page').then((m) => ({
    default: m.SecurityPage,
  }))
);
const SettingsPage = lazy(() =>
  import('@/app/pages/user/settings.page').then((m) => ({
    default: m.SettingsPage,
  }))
);
const NotificationsPage = lazy(() =>
  import('@/app/pages/user/notifications.page').then((m) => ({
    default: m.NotificationsPage,
  }))
);
const BillingPage = lazy(() =>
  import('@/app/pages/user/billing.page').then((m) => ({
    default: m.BillingPage,
  }))
);

// ─── 보호된 페이지 : 멤버십 ──────────────────────────────────────────────────
const MembershipPage = lazy(() =>
  import('@/app/pages/membership/membership-page').then((m) => ({
    default: m.MembershipPage,
  }))
);

// ─── 보호된 페이지 : 주문 ────────────────────────────────────────────────────
const OrdersPage = lazy(() =>
  import('@/app/pages/orders/orders-page').then((m) => ({
    default: m.OrdersPage,
  }))
);
const OrderDetailPage = lazy(() =>
  import('@/app/pages/orders/order-detail-page').then((m) => ({
    default: m.OrderDetailPage,
  }))
);

// ─── 보호된 페이지 : 문의 ────────────────────────────────────────────────────
const MyContactsPage = lazy(() =>
  import('@/app/pages/contact/my-contacts-page').then((m) => ({
    default: m.MyContactsPage,
  }))
);
const MyContactDetailPage = lazy(() =>
  import('@/app/pages/contact/my-contact-detail-page').then((m) => ({
    default: m.MyContactDetailPage,
  }))
);

// ─── 보호된 페이지 : 채용 지원 ───────────────────────────────────────────────
const MyApplicationsPage = lazy(() =>
  import('@/app/pages/jobs/my-applications-page').then((m) => ({
    default: m.MyApplicationsPage,
  }))
);
const MyApplicationDetailPage = lazy(() =>
  import('@/app/pages/jobs/my-application-detail-page').then((m) => ({
    default: m.MyApplicationDetailPage,
  }))
);
const JobApplicationEditPage = lazy(() =>
  import('@/app/pages/jobs/edit/job-applications-edit-page').then((m) => ({
    default: m.JobApplicationEditPage,
  }))
);
const JobApplyPage = lazy(() =>
  import('@/app/pages/jobs/job-apply-page').then((m) => ({
    default: m.JobApplyPage,
  }))
);

// ─── AppShell ────────────────────────────────────────────────────────────────
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
      // ── 🏠 공개 페이지 ────────────────────────────────────────────────────
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: S(HomePage) },

          // 회사소개
          { path: 'about', element: S(AboutPage) },
          { path: 'about/philosophy', element: S(PhilosophyPage) },
          { path: 'about/history', element: S(HistoryPage) },
          { path: 'about/ci', element: S(CiPage) },

          // 채용 공고 (공개)
          { path: 'careers', element: S(CareersPage) },
          { path: 'careers/:id', element: S(CareerDetailPage) },

          // 고객지원
          { path: 'contacts', element: S(ContactPage) },
          { path: 'faq', element: S(FaqPage) },

          // 약관 및 정책
          { path: 'terms', element: S(TermsPage) },
          { path: 'privacy', element: S(TermsPage) },

          // 외부 앱 리다이렉트
          {
            path: 'apps/gas-station',
            loader: () => {
              window.location.href = 'https://staroil.starcoex.co.kr';
              return null;
            },
          },
          {
            path: 'apps/fuels-delivery',
            loader: () => {
              window.location.href = 'https://delivery.starcoex.co.kr';
              return null;
            },
          },
          {
            path: 'apps/car-wash',
            loader: () => {
              window.location.href = 'https://zeragae.starcoex.co.kr';
              return null;
            },
          },
          {
            path: 'admin',
            loader: () => {
              window.location.href = 'https://admin.starcoex.com';
              return null;
            },
          },
        ],
      },

      // ── 🔐 보호된 페이지 ──────────────────────────────────────────────────
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          // 온보딩
          { path: 'onboarding', element: S(OnboardingPage) },

          // 대시보드
          { path: 'dashboard', element: S(DashboardPage) },

          // 사용자 계정
          { path: 'profile', element: S(ProfilePage) },
          { path: 'security', element: S(SecurityPage) },
          { path: 'settings', element: S(SettingsPage) },
          { path: 'notifications', element: S(NotificationsPage) },
          { path: 'billing', element: S(BillingPage) },

          // 멤버십
          { path: 'membership', element: S(MembershipPage) },

          // 주문
          { path: 'orders', element: S(OrdersPage) },
          { path: 'orders/:id', element: S(OrderDetailPage) },

          // 문의
          { path: 'my-contacts', element: S(MyContactsPage) },
          { path: 'my-contacts/:id', element: S(MyContactDetailPage) },

          // 채용 지원
          { path: 'my-applications', element: S(MyApplicationsPage) },
          { path: 'my-applications/:id', element: S(MyApplicationDetailPage) },
          {
            path: 'my-applications/:id/edit',
            element: S(JobApplicationEditPage),
          },
          { path: 'careers/:id/apply', element: S(JobApplyPage) },
        ],
      },

      // ── 🔑 인증 페이지 ────────────────────────────────────────────────────
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: S(LoginPage) },
          { path: 'register', element: S(RegisterTypePage) },
          { path: 'register/personal', element: S(PersonalRegisterPage) },
          { path: 'register/identity', element: S(IdentityRegisterPage) },
          { path: 'verify-email', element: <VerifyEmailPage /> },
          { path: 'verify-social', element: <VerifySocialEmailPage /> },
          { path: 'social/callback', element: <SocialCallbackPage /> },
          {
            path: 'verify-social-code',
            element: <VerifySocialEmailCodePage />,
          },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
          { path: 'verify-phone', element: <VerifyPhonePage /> },
        ],
      },

      // ── 🚫 404 ────────────────────────────────────────────────────────────
      { path: '*', element: <NotFoundAnimation /> },
    ],
  },
]);
