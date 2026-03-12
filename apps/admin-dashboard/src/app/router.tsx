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
import SuggestionsPage from '@/app/pages/dashboard/suggestions/suggestions-page';
import UsersPage from '@/app/pages/dashboard/users/users-page';
import { UserDetailPage } from '@/app/pages/dashboard/users/details/detail.page';
import SuggestionDetailPage from '@/app/pages/dashboard/suggestions/details/suggestion-detail-page';
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
import MasterKeyPromotePage from '@/app/pages/dashboard/settings/master-key-page';
import SalesPage from '@/app/pages/sales/sales-page';
import ProductsPage from '@/app/pages/dashboard/ecommerce/products/products-page';
import ProductCreatePage from '@/app/pages/dashboard/ecommerce/products/create/product-create-page';
import ProductDetailPage from '@/app/pages/dashboard/ecommerce/products/product-detail/product-detail-page';
import { ProductsWithProvider } from '@/app/pages/dashboard/ecommerce/products/products-with-provider';
import { OrdersWithProvider } from '@/app/pages/dashboard/ecommerce/orders/orders-with-provider';
import OrdersPage from '@/app/pages/dashboard/ecommerce/orders/orders-page';
import OrderDetailPage from '@/app/pages/dashboard/ecommerce/orders/order-detail/order-detail-page';
import { StoresWithProvider } from '@/app/pages/dashboard/ecommerce/stores/stores-with-provider';
import StoresPage from '@/app/pages/dashboard/ecommerce/stores/stores-page';
import StoreCreatePage from '@/app/pages/dashboard/ecommerce/stores/create/store-create-page';
import BrandsPage from '@/app/pages/dashboard/ecommerce/stores/brands-page';
import BrandCreatePage from '@/app/pages/dashboard/ecommerce/stores/create/brand-create-page';
import { SuggestionsWithProvider } from '@/app/pages/dashboard/suggestions/suggestions-with-provider';
import { CategoriesWithProvider } from '@/app/pages/dashboard/ecommerce/categories/categories-with-provider';
import CategoriesPage from '@/app/pages/dashboard/ecommerce/categories/categories-page';
import CategoryHierarchyPage from '@/app/pages/dashboard/ecommerce/categories/category-hierachy-page';

const router = createBrowserRouter([
  // 🏠 메인 페이지
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

  // 🔐 인증 페이지 (비인증 사용자)
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

      // ✅ 매출 현황 (Sales Dashboard)
      {
        path: 'sales',
        element: <SalesPage />,
      },

      // 💡 건의사항 관리
      {
        path: 'suggestions',
        element: <SuggestionsWithProvider />,
        children: [
          {
            index: true,
            element: <SuggestionsPage />,
          },
          // ✅ 정적 경로 먼저 (순서 중요!)
          {
            path: 'pending',
            element: <SuggestionsPage />,
          },
          { path: 'reviewing', element: <SuggestionsPage /> }, // ← Outlet에 렌더됨
          {
            path: 'in-progress',
            element: <SuggestionsPage />,
          },
          {
            path: 'completed',
            element: <SuggestionsPage />,
          },
          { path: 'rejected', element: <SuggestionsPage /> }, // ✅ 추가
          {
            path: 'analytics',
            element: <SuggestionsPage />,
          },
          {
            path: 'create',
            element: <div>건의사항 등록 (구현 예정)</div>,
          },
          // ✅ 동적 :id는 반드시 마지막
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

      // 👥 사용자 관리
      {
        path: 'users',
        element: <UsersWithProvider />,
        children: [
          {
            index: true,
            element: <UsersPage />,
          },
          {
            path: 'admins',
            element: <UsersPage />,
          },
          {
            path: 'members',
            element: <UsersPage />,
          },
          {
            path: 'drivers',
            element: <UsersPage />,
          },
          {
            path: 'invitations',
            element: <InvitationsPage />,
          },
          {
            path: ':id',
            element: <UserDetailPage />,
          },
        ],
      },

      // 📊 시스템 분석
      {
        path: 'analytics',
        children: [
          {
            index: true,
            element: <div>통합 대시보드 (구현 예정)</div>,
          },
          {
            path: 'revenue',
            element: <div>매출 분석 (구현 예정)</div>,
          },
          {
            path: 'users',
            element: <div>사용자 분석 (구현 예정)</div>,
          },
          {
            path: 'performance',
            element: <div>서비스 성능 (구현 예정)</div>,
          },
        ],
      },

      // 🔔 알림 관리
      {
        path: 'notifications',
        element: <div>알림 관리 (구현 예정)</div>,
      },

      // ✅ 커머스 관리 - 매장
      {
        path: 'stores',
        element: <StoresWithProvider />,
        children: [
          {
            index: true,
            element: <StoresPage />,
          },
          {
            path: 'create',
            element: <StoreCreatePage />,
          },
          // ✅ 브랜드 관리 라우트 추가
          {
            path: 'brands',
            element: <BrandsPage />,
          },
          {
            path: 'brands/create',
            element: <BrandCreatePage />,
          },
          {
            path: ':id',
            element: <div>매장 상세 (구현 예정)</div>,
          },
          {
            path: ':id/edit',
            element: <div>매장 수정 (구현 예정)</div>,
          },
        ],
      },

      // ✅ 커머스 관리 - 제품
      {
        path: 'products',
        element: <ProductsWithProvider />,
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: 'create',
            element: <ProductCreatePage />,
          },
          {
            path: 'inventory',
            element: <div>재고 현황 (구현 예정)</div>,
          },
          {
            path: ':id',
            element: <ProductDetailPage />,
          },
        ],
      },

      // ✅ 커머스 관리 - 주문
      {
        path: 'orders',
        element: <OrdersWithProvider />,
        children: [
          {
            index: true,
            element: <OrdersPage />,
          },
          {
            path: 'detail',
            element: <OrderDetailPage />,
          },
          {
            path: 'stats',
            element: <div>주문 통계 (구현 예정)</div>,
          },
          {
            path: 'live',
            element: <div>실시간 주문 (구현 예정)</div>,
          },
          {
            path: 'history',
            element: <div>주문 히스토리 (구현 예정)</div>,
          },
          {
            path: ':id',
            element: <OrderDetailPage />,
          },
        ],
      },

      // ✅ 커머스 관리 - 카테고리
      {
        path: 'categories',
        element: <CategoriesWithProvider />,
        children: [
          {
            index: true,
            element: <CategoriesPage />,
          },
          {
            path: 'hierarchy',
            element: <CategoryHierarchyPage />,
          },
        ],
      },

      // 📁 미디어 관리
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

      // 🏢 서비스별 현황
      {
        path: 'services',
        children: [
          {
            path: 'gas-stations',
            element: <div>주유소 현황 (구현 예정)</div>,
          },
          {
            path: 'car-care',
            element: <div>카케어 현황 (구현 예정)</div>,
          },
          {
            path: 'delivery',
            element: <div>배달 현황 (구현 예정)</div>,
          },
        ],
      },

      // ⚙️ 시스템 설정
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
          {
            path: 'master-key',
            element: <MasterKeyPromotePage />,
          },
        ],
      },
    ],
  },

  // ⛽ 주유소 관리 (StarOil 팀 전용)
  {
    path: '/stores',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>매장 목록 (구현 예정)</div>,
      },
      {
        path: 'create',
        element: <div>매장 등록 (구현 예정)</div>,
      },
      {
        path: 'settings',
        element: <div>매장 설정 (구현 예정)</div>,
      },
    ],
  },

  // 🛢️ 유류 상품 관리
  {
    path: '/fuel-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'types',
        element: <div>유류 종류 (구현 예정)</div>,
      },
      {
        path: 'inventory',
        element: <div>유류 재고 (구현 예정)</div>,
      },
      {
        path: 'pricing',
        element: <div>가격 관리 (구현 예정)</div>,
      },
    ],
  },

  // 🚗 차량 관리
  {
    path: '/vehicles',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>등록 차량 (구현 예정)</div>,
      },
      {
        path: 'history',
        element: <div>차량 히스토리 (구현 예정)</div>,
      },
    ],
  },

  // 📦 재고 관리
  {
    path: '/inventory',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'fuel',
        element: <div>유류 재고 (구현 예정)</div>,
      },
      {
        path: 'products',
        element: <div>용품 재고 (구현 예정)</div>,
      },
      {
        path: 'alerts',
        element: <div>재고 알림 (구현 예정)</div>,
      },
      {
        path: 'oil',
        element: <div>난방유 재고 (구현 예정)</div>,
      },
      {
        path: 'supplies',
        element: <div>배달 용품 (구현 예정)</div>,
      },
    ],
  },

  // 💳 결제 관리
  {
    path: '/payments',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>결제 관리 (구현 예정)</div>,
      },
    ],
  },

  // 📊 운영 분석 (StarOil 전용)
  {
    path: '/analytics',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'sales',
        element: <div>매출 현황 (구현 예정)</div>,
      },
      {
        path: 'customers',
        element: <div>고객 분석 (구현 예정)</div>,
      },
    ],
  },

  // 🧼 카케어 관리 (Zeragae 팀 전용)
  {
    path: '/service-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'wash',
        element: <div>세차 서비스 (구현 예정)</div>,
      },
      {
        path: 'maintenance',
        element: <div>정비 서비스 (구현 예정)</div>,
      },
      {
        path: 'packages',
        element: <div>서비스 패키지 (구현 예정)</div>,
      },
    ],
  },

  // 📅 예약 관리
  {
    path: '/reservations',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>예약 현황 (구현 예정)</div>,
      },
      {
        path: 'schedule',
        element: <div>예약 일정 (구현 예정)</div>,
      },
      {
        path: 'queue',
        element: <div>대기 관리 (구현 예정)</div>,
      },
    ],
  },

  // 🛠️ 서비스 관리
  {
    path: '/services',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'wash',
        element: <div>세차 서비스 (구현 예정)</div>,
      },
      {
        path: 'maintenance',
        element: <div>정비 서비스 (구현 예정)</div>,
      },
      {
        path: 'others',
        element: <div>기타 서비스 (구현 예정)</div>,
      },
    ],
  },

  // ⭐ 리뷰 관리
  {
    path: '/reviews',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>리뷰 관리 (구현 예정)</div>,
      },
    ],
  },

  // 🎁 프로모션 관리
  {
    path: '/promotions',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'events',
        element: <div>이벤트 관리 (구현 예정)</div>,
      },
      {
        path: 'coupons',
        element: <div>쿠폰 관리 (구현 예정)</div>,
      },
    ],
  },

  // 🚚 배달 관리 (Delivery 팀 전용)
  {
    path: '/delivery-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'heating-oil',
        element: <div>난방유 상품 (구현 예정)</div>,
      },
      {
        path: 'areas',
        element: <div>배달 지역 (구현 예정)</div>,
      },
      {
        path: 'fees',
        element: <div>배달료 관리 (구현 예정)</div>,
      },
    ],
  },

  // 👤 배달원 관리
  {
    path: '/drivers',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>배달원 목록 (구현 예정)</div>,
      },
      {
        path: 'register',
        element: <div>배달원 등록 (구현 예정)</div>,
      },
      {
        path: 'performance',
        element: <div>성과 관리 (구현 예정)</div>,
      },
    ],
  },

  // 📍 배달 현황
  {
    path: '/delivery-status',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'tracking',
        element: <div>실시간 추적 (구현 예정)</div>,
      },
      {
        path: 'completed',
        element: <div>배달 완료 (구현 예정)</div>,
      },
      {
        path: 'delayed',
        element: <div>배달 지연 (구현 예정)</div>,
      },
    ],
  },

  // 💬 건의사항 (팀별 공통)
  {
    path: '/suggestions',
    element: <SuggestionsWithProvider />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <SuggestionsPage /> },
      {
        path: 'create',
        element: <div>새 건의사항 (구현 예정)</div>,
      },
      {
        path: 'my',
        element: <div>내 건의사항 (구현 예정)</div>,
      },
      { path: 'safety', element: <div>안전 관련 (구현 예정)</div> },
      { path: 'service', element: <div>서비스 개선 (구현 예정)</div> },
      { path: 'facility', element: <div>시설 개선 (구현 예정)</div> },
      { path: 'wash-service', element: <div>세차 서비스 (구현 예정)</div> },
      { path: 'equipment', element: <div>장비 개선 (구현 예정)</div> },
      { path: 'customer-service', element: <div>고객 서비스 (구현 예정)</div> },
      { path: 'routes', element: <div>배달 경로 (구현 예정)</div> },
      { path: 'vehicle', element: <div>차량 관련 (구현 예정)</div> },
      { path: 'customer', element: <div>고객 응대 (구현 예정)</div> },
      // ✅ 동적 :id는 마지막
      {
        path: ':id',
        element: <SuggestionDetailPage />,
      },
    ],
  },

  // 📄 정적 페이지 (공개)
  {
    path: '/terms',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <div>이용약관 (구현 예정)</div>,
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
        element: <div>개인정보처리방침 (구현 예정)</div>,
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
