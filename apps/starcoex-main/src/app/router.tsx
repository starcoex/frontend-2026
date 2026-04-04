import { createBrowserRouter } from 'react-router-dom';
import {
  ErrorBoundary,
  ForgotPasswordPage,
  NotFoundAnimation,
  ResetPasswordPage,
  VerifyEmailPage,
  VerifyPhonePage,
  VerifySocialEmailCodePage,
  VerifySocialEmailPage,
} from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';
import { AuthLayout } from '@/app/layout/auth-layout';
import { ProtectedLayout } from '@/app/layout/protected-layout';
import { HomePage } from '@/app/pages/home-page';
import { RegisterTypePage } from '@/app/pages/auth/register-type-page';
import { PersonalRegisterPage } from '@/app/pages/auth/personal-register-page';
import { LoginPage } from '@/app/pages/auth/login-page';
import DashboardPage from '@/app/pages/dashboard.page';
import { ProfilePage } from '@/app/pages/user/profile.page';
import { SecurityPage } from '@/app/pages/user/security.page';
import { SettingsPage } from '@/app/pages/user/settings.page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      // 🌟 서비스 소개 페이지들 (포털에서 서비스 설명 + 독립 앱으로 연결)
      // {
      //   path: 'gas-station',
      //   element: <GasStationInfoPage />, // 서비스 소개 + gas-station.starcoex.com 연결
      // },
      // {
      //   path: 'fuels-delivery',
      //   element: <FuelDeliveryInfoPage />, // 서비스 소개 + fuels-delivery.starcoex.com 연결
      // },
      // {
      //   path: 'car-wash',
      //   element: <CarWashInfoPage />, // 서비스 소개 + car-wash.starcoex.com 연결
      // },
      // {
      //   path: 'zeragae-care',
      //   element: <ZeragaeCarePage />,
      // },

      // 🔗 직접 외부 앱 리다이렉트 라우트들 (선택사항)
      {
        path: 'apps/gas-station',
        loader: () => {
          window.location.href = 'https://gas-station.starcoex.com';
          return null;
        },
      },
      {
        path: 'apps/fuels-delivery',
        loader: () => {
          window.location.href = 'https://fuel-delivery.starcoex.com';
          return null;
        },
      },
      {
        path: 'apps/car-wash',
        loader: () => {
          window.location.href = 'https://car-wash.starcoex.com';
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

  // 🔐 인증 관련 라우트 (포털용 - 개인 회원가입만)
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
        element: <RegisterTypePage />, // 개인 회원 + 사업자 리다이렉트 선택
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

  // 🔐 보호된 라우트들 (인증된 사용자 전용)
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // 👤 사용자 관리 라우트
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'security',
        element: <SecurityPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      // {
      //   path: 'components',
      //   element: <NotificationsPage />,
      // },
      // 추가 보호된 페이지들...
    ],
  },
  // 404 페이지
  {
    path: '*',
    element: <NotFoundAnimation />,
  },
]);
