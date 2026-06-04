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

// ─── 보호된 페이지 ───────────────────────────────────────────────────────────
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
const MyApplicationsPage = lazy(() =>
  import('@/app/pages/jobs/my-applications-page').then((m) => ({
    default: m.MyApplicationsPage,
  }))
);
const JobApplyPage = lazy(() =>
  import('@/app/pages/jobs/job-apply-page').then((m) => ({
    default: m.JobApplyPage,
  }))
);
const JobApplicationEditPage = lazy(() =>
  import('@/app/pages/jobs/edit/job-applications-edit-page').then((m) => ({
    default: m.JobApplicationEditPage,
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

          // 회사소개
          { path: 'about', element: S(AboutPage) },
          { path: 'about/philosophy', element: S(PhilosophyPage) },
          { path: 'about/history', element: S(HistoryPage) },
          { path: 'about/ci', element: S(CiPage) },
          { path: 'careers', element: S(CareersPage) },
          { path: 'careers/:id', element: S(CareerDetailPage) },

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

      // 🔐 보호된 페이지 - BottomNav 자동 전환 (useAuth 기반)
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          { path: 'onboarding', element: S(OnboardingPage) },
          { path: 'dashboard', element: S(DashboardPage) },
          { path: 'profile', element: S(ProfilePage) },
          { path: 'security', element: S(SecurityPage) },
          { path: 'settings', element: S(SettingsPage) },
          { path: 'my-applications', element: S(MyApplicationsPage) },
          {
            path: 'my-applications/:id/edit',
            element: S(JobApplicationEditPage),
          },
          { path: 'careers/:id/apply', element: S(JobApplyPage) },
        ],
      },

      // 🔑 인증 - BottomNav 숨김 (/auth 경로 감지)
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

      // 🚫 404
      { path: '*', element: <NotFoundAnimation /> },
    ],
  },
]);
