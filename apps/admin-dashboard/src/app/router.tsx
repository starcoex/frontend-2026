import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from './layout/admin-layout';
import { AuthLayout } from './layout/auth-layout';
import {
  ErrorBoundary,
  NotFoundError,
  ResetPasswordPage,
  ForgotPasswordPage,
} from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';
import { HomePage } from '@/app/pages/home-page';
import { LoginPage } from '@/app/pages/auth/login-page';
import { BusinessRegisterPage } from '@/app/pages/auth/business-register-page';
import VerifyEmailPage from '@/app/pages/auth/verify-email.page';
import { DashboardPage } from '@/app/pages/dasbhboard-page';
import SuggestionsLayout from '@/app/pages/dashboard/suggestions/suggestions-layout';
import SuggestionsPage from '@/app/pages/dashboard/suggestions/suggestions-page';
import UsersPage from '@/app/pages/dashboard/users/users-page';
import { UserDetailPage } from '@/app/pages/dashboard/users/details/detail.page';
import SuggestionDetailPage from '@/app/pages/dashboard/suggestions/details/detail';
import SettingsLayout from '@/app/pages/dashboard/settings/settings-layout';
import SettingsGeneralPage from '@/app/pages/dashboard/settings/settings-page';
import SettingsBillingPage from '@/app/pages/dashboard/settings/billing/billing-page';
import SettingsProfilePage from '@/app/pages/dashboard/settings/profile/profile-page';
import SettingsNotificationsPage from '@/app/pages/dashboard/settings/notifications/notifications-page';
import { FileManagerLayout } from '@/app/pages/dashboard/board/file-manager/file-layout';
import { FileManagerPage } from '@/app/pages/dashboard/board/file-manager/file-manager-page';
import RecentFilesPage from '@/app/pages/dashboard/board/file-manager/pages/recent-files-page';
import StorageAnalysisPage from '@/app/pages/dashboard/board/file-manager/pages/storage-analysis-page';
import { FileUploadDialog } from '@/app/pages/dashboard/board/file-manager/components';
import { UsersWithProvider } from '@/app/pages/dashboard/users/users-with-provider';
import { InvitationsPage } from '@/app/pages/dashboard/users/Invitations.page';
import { AcceptInvitationPage } from '@/app/pages/auth/accept-invitations.page';

const router = createBrowserRouter([
  // 🔐 관리자 로그인 (비인증 사용자만)
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  // 🔐 관리자 로그인 (비인증 사용자만)
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
        element: <BusinessRegisterPage />,
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
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
      // ✅ 초대 수락 페이지 추가
      {
        path: 'accept-invitation',
        element: <AcceptInvitationPage />,
      },
    ],
  },

  // 📊 관리자 대시보드 (인증 + 권한 필요)
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // 💡 건의사항 관리 (관리자 통합 관리용)
      {
        path: 'suggestions',
        element: <SuggestionsLayout />,
        children: [
          {
            index: true,
            element: <SuggestionsPage />, // /admin/suggestions - 전체 건의사항
          },
          {
            path: ':id',
            element: <SuggestionDetailPage />,
          },
          {
            path: ':id/edit',
            element: <div>건의사항 수정</div>,
          },
        ],
      },

      // ⚙️ 시스템 설정 (슈퍼 관리자만)
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <SettingsGeneralPage />,
          },
          {
            path: 'billing',
            element: <SettingsBillingPage />,
          },
          {
            path: 'profile',
            element: <SettingsProfilePage />,
          },
          {
            path: 'notifications',
            element: <SettingsNotificationsPage />,
          },
        ],
      },

      // 👥 사용자 관리 (관리자 이상)
      {
        path: 'users',
        element: <UsersWithProvider />,
        children: [
          {
            index: true,
            element: <UsersPage />, // /admin/users
          },
          {
            path: 'admins', // ✅ /admin/users/admins (관리자 필터)
            element: <UsersPage />, // 또는 별도 컴포넌트
          },
          {
            path: 'invitations', // ✅ 초대 목록 페이지 추가
            element: <InvitationsPage />,
          },
          {
            path: ':id',
            element: <UserDetailPage />,
          },
        ],
      },

      {
        path: 'media',
        element: <FileManagerLayout />,
        children: [
          {
            index: true,
            element: <FileManagerPage />,
          },
          {
            path: 'recent',
            element: <RecentFilesPage />,
          },
          {
            path: 'analysis',
            element: <StorageAnalysisPage />,
          },
          {
            path: 'upload',
            element: <FileUploadDialog />,
          },
        ],
      },
    ],
  },

  // 📄 정적 페이지들 (공개)
  {
    path: '/terms',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>관리자 이용약관</div>, // TODO: 구현 예정
      },
    ],
  },

  {
    path: '/privacy',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>개인정보처리방침</div>, // TODO: 구현 예정
      },
    ],
  },

  // 🚫 404 페이지
  {
    path: '*',
    element: <NotFoundError />,
  },
]);
export default router;
