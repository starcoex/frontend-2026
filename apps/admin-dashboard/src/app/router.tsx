import { createBrowserRouter, Navigate } from 'react-router-dom';
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
import { UsersWithProvider } from '@/app/pages/dashboard/users/users-with-provider';
import { InvitationsPage } from '@/app/pages/dashboard/users/Invitations.page';
import { AcceptInvitationPage } from '@/app/pages/auth/accept-invitations.page';
import MasterKeyPromotePage from '@/app/pages/dashboard/settings/master-key-page';
import SalesPage from '@/app/pages/sales/sales-page';
import { ProductsWithProvider } from '@/app/pages/dashboard/ecommerce/products/products-with-provider';
import ProductsPage from '@/app/pages/dashboard/ecommerce/products/products-page';
import ProductCreatePage from '@/app/pages/dashboard/ecommerce/products/create/product-create-page';
import ProductDetailPage from '@/app/pages/dashboard/ecommerce/products/product-detail/product-detail-page';
import ProductEditPage from '@/app/pages/dashboard/ecommerce/products/edit/product-edit-page';
import ProductInventoryPage from '@/app/pages/dashboard/ecommerce/products/inventory/inventory-page'; // ← 제품 재고 탭용
import { ProductScanWithProvider } from '@/app/pages/dashboard/ecommerce/products/products-scan-with-provider';
import { OrdersWithProvider } from '@/app/pages/dashboard/ecommerce/orders/orders-with-provider';
import OrdersPage from '@/app/pages/dashboard/ecommerce/orders/orders-page';
import OrderDetailPage from '@/app/pages/dashboard/ecommerce/orders/order-detail/order-detail-page';
import OrderEditPage from '@/app/pages/dashboard/ecommerce/orders/edit/order-edit-page';
import OrderCreatePage from '@/app/pages/dashboard/ecommerce/orders/create/order-create-page';
import { StoresWithProvider } from '@/app/pages/dashboard/ecommerce/stores/stores-with-provider';
import StoresPage from '@/app/pages/dashboard/ecommerce/stores/stores-page';
import StoreCreatePage from '@/app/pages/dashboard/ecommerce/stores/create/store-create-page';
import StoreDetailPage from '@/app/pages/dashboard/ecommerce/stores/stores-detail/store-detail-page';
import StoreEditPage from '@/app/pages/dashboard/ecommerce/stores/edit/store-edit-page';
import BrandsPage from '@/app/pages/dashboard/ecommerce/stores/brands/brands-page';
import { CategoriesWithProvider } from '@/app/pages/dashboard/ecommerce/categories/categories-with-provider';
import CategoriesPage from '@/app/pages/dashboard/ecommerce/categories/categories-page';
import CategoryHierarchyPage from '@/app/pages/dashboard/ecommerce/categories/category-hierachy-page';
import { SuggestionsWithProvider } from '@/app/pages/dashboard/suggestions/suggestions-with-provider';
import { InventoryWithProvider } from '@/app/pages/dashboard/ecommerce/inventory/inventory-with-provider';
import InventoryPage from '@/app/pages/dashboard/ecommerce/inventory/inventory-page';
import LowStockPage from '@/app/pages/dashboard/ecommerce/inventory/low-stock-page';
import InventoryDetailPage from '@/app/pages/dashboard/ecommerce/inventory/inventory-detail/inventory-detail-page';
import { ReservationsWithProvider } from '@/app/pages/dashboard/ecommerce/reservations/reservation-with-provider';
import ReservationsPage from '@/app/pages/dashboard/ecommerce/reservations/reservation-page';
import ReservationDetailPage from '@/app/pages/dashboard/ecommerce/reservations/reservation-detail/reservation-detail-page';
import { WalkInsWithProvider } from '@/app/pages/dashboard/ecommerce/reservations/walk-ins/walk-ins-with-provider';
import { FuelWalkInsWithProvider } from '@/app/pages/dashboard/ecommerce/reservations/fuel-walk-ins/fuel-walk-ins-with-provider';
import ReservationCreatePage from '@/app/pages/dashboard/ecommerce/reservations/create/reservation-create-step5';
import ReservationEditPage from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-page';
import HeatingOilDeliveriesPage from '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/heating-oil-deliveries-page';
import HeatingOilDeliveryCreatePage from '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/create/heating-oil-delivery-create-page';
import ReservationServicesPage from '@/app/pages/dashboard/ecommerce/reservations/services/reservation-service-page';
import { HeatingOilDeliveriesWithProvider } from '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/heating-oil-deliveries-with-provider';
import WalkInsPage from '@/app/pages/dashboard/ecommerce/reservations/walk-ins/walk-ins-page';
import FuelWalkInsPage from '@/app/pages/dashboard/ecommerce/reservations/fuel-walk-ins/fuel-walk-ins-page';
import InventoryEditPage from '@/app/pages/dashboard/ecommerce/inventory/edit/inventory-edit-page';
import InventoryCreatePage from '@/app/pages/dashboard/ecommerce/inventory/create/inventory-create-page';
import StoresSettingsPage from '@/app/pages/dashboard/ecommerce/stores/settings/stores-settings-page';
import ProductSettingsPage from '@/app/pages/dashboard/ecommerce/products/settings/product-settings-page';
import { PaymentsWithProvider } from '@/app/pages/dashboard/ecommerce/payments/payments-with-provider';
import PaymentsPage from '@/app/pages/dashboard/ecommerce/payments/payments-page';
import PaymentDetailPage from '@/app/pages/dashboard/ecommerce/payments/payment-detail/payment-detail-page';
import PaymentStatsPage from '@/app/pages/dashboard/ecommerce/payments/payment-stats/payment-stats-page';
import PaymentCreatePage from '@/app/pages/dashboard/ecommerce/payments/create/payment-create-page';
import { NotificationsWithProvider } from '@/app/pages/dashboard/ecommerce/notifications/notifications-with-provider';
import NotificationsPage from '@/app/pages/dashboard/ecommerce/notifications/notifications-page';
import SendNotificationPage from '@/app/pages/dashboard/ecommerce/notifications/send/send-notification-page';
import EmailsPage from '@/app/pages/dashboard/ecommerce/notifications/emails/emails-page';
import ReservationCalendarPage from '@/app/pages/dashboard/ecommerce/reservations/calendar/reservation-calendar-page';
import { CartWithProvider } from '@/app/pages/dashboard/ecommerce/cart/cart-with-provider';
import CartPage from '@/app/pages/dashboard/ecommerce/cart/cart-page';
import CartDetailPage from '@/app/pages/dashboard/ecommerce/cart/cart-detail/cart-detail-page';
import { DeliveryWithProvider } from '@/app/pages/dashboard/ecommerce/delivery/delivery-with-provider';
import DeliveryPage from '@/app/pages/dashboard/ecommerce/delivery/delivery-page';
import DeliveryCreatePage from '@/app/pages/dashboard/ecommerce/delivery/create/delivery-create-page';
import DeliveryDriversPage from '@/app/pages/dashboard/ecommerce/delivery/drivers/delivery-drivers-page';
import DeliveryTrackingPage from '@/app/pages/dashboard/ecommerce/delivery/tracking/delivery-tracking-page';
import DeliveryDetailPage from '@/app/pages/dashboard/ecommerce/delivery/delivery-detail/delivery-detail-page';
import DeliveryDriverCreatePage from '@/app/pages/dashboard/ecommerce/delivery/drivers/create/delivery-driver-create-page';
import DeliveryDriverDetailPage from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/delivery-driver-detail-page';
import DeliveryDriverEditPage from '@/app/pages/dashboard/ecommerce/delivery/drivers/edit/delivery-driver-edit-page';
import DeliveryEditPage from '@/app/pages/dashboard/ecommerce/delivery/edit/delivery-edit-page';
import { DriverWithProvider } from '@/app/pages/teams/delivery/driver/driver-with-provider';
import DriverDashboardPage from '@/app/pages/teams/delivery/driver/driver-dashboard-page';
import DriverDeliveriesPage from '@/app/pages/teams/delivery/driver/deliveries/driver-deliveries-page';
import DriverActivePage from '@/app/pages/teams/delivery/driver/active/driver-active-page';
import DriverProfilePage from '@/app/pages/teams/delivery/driver/profile/driver-profile-page';

const router = createBrowserRouter([
  // 🏠 메인 페이지
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <HomePage /> }],
  },

  // 🔐 인증 페이지
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <BusinessRegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'accept-invitation', element: <AcceptInvitationPage /> },
    ],
  },

  // 📊 관리자 대시보드
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      // 🚗 배달기사 전용
      {
        path: 'driver',
        element: <DriverWithProvider />,
        children: [
          { path: 'dashboard', element: <DriverDashboardPage /> },
          { path: 'deliveries', element: <DriverDeliveriesPage /> },
          { path: 'active', element: <DriverActivePage /> },
          { path: 'profile', element: <DriverProfilePage /> },
        ],
      },

      // 매출 현황
      { path: 'sales', element: <SalesPage /> },

      // 건의사항
      {
        path: 'suggestions',
        element: <SuggestionsWithProvider />,
        children: [
          { index: true, element: <SuggestionsPage /> },
          { path: 'pending', element: <SuggestionsPage /> },
          { path: 'reviewing', element: <SuggestionsPage /> },
          { path: 'in-progress', element: <SuggestionsPage /> },
          { path: 'completed', element: <SuggestionsPage /> },
          { path: 'rejected', element: <SuggestionsPage /> },
          { path: 'analytics', element: <SuggestionsPage /> },
          { path: 'create', element: <div>건의사항 등록 (구현 예정)</div> },
          { path: ':id', element: <SuggestionDetailPage /> },
          { path: ':id/edit', element: <div>건의사항 수정</div> },
        ],
      },

      // 사용자 관리
      {
        path: 'users',
        element: <UsersWithProvider />,
        children: [
          { index: true, element: <UsersPage /> },
          { path: 'admins', element: <UsersPage /> },
          { path: 'members', element: <UsersPage /> },
          { path: 'drivers', element: <UsersPage /> },
          { path: 'invitations', element: <InvitationsPage /> },
          { path: ':id', element: <UserDetailPage /> },
        ],
      },

      // 시스템 분석
      {
        path: 'analytics',
        children: [
          { index: true, element: <div>통합 대시보드 (구현 예정)</div> },
          { path: 'revenue', element: <div>매출 분석 (구현 예정)</div> },
          { path: 'users', element: <div>사용자 분석 (구현 예정)</div> },
          { path: 'performance', element: <div>서비스 성능 (구현 예정)</div> },
        ],
      },

      // 알림
      {
        path: 'notifications',
        element: <NotificationsWithProvider />,
        children: [
          { index: true, element: <NotificationsPage /> },
          { path: 'send', element: <SendNotificationPage /> },
          { path: 'emails', element: <EmailsPage /> },
        ],
      },
      // 매장
      {
        path: 'stores',
        element: <StoresWithProvider />,
        children: [
          { index: true, element: <StoresPage /> },
          { path: 'create', element: <StoreCreatePage /> },
          { path: 'brands', element: <BrandsPage /> },
          { path: 'settings', element: <StoresSettingsPage /> },
          { path: ':id', element: <StoreDetailPage /> },
          { path: ':id/edit', element: <StoreEditPage /> },
        ],
      },

      // ✅ 제품 (Products Service 기반 — 제품 재고 탭 포함)
      {
        path: 'products',
        element: <ProductsWithProvider />,
        children: [
          { index: true, element: <ProductsPage /> },
          { path: 'create', element: <ProductCreatePage /> },
          { path: 'inventory', element: <ProductInventoryPage /> }, // ProductInventory 기반
          {
            path: '/admin/products/settings',
            element: <ProductSettingsPage />,
          },
          { path: ':id', element: <ProductDetailPage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      // 스캔 (독립 Provider)
      { path: 'products/send', element: <ProductScanWithProvider /> },

      // ✅ 재고 관리 (Inventory Service 기반 — 신규)
      {
        path: 'inventory',
        element: <InventoryWithProvider />,
        children: [
          { index: true, element: <InventoryPage /> },
          { path: 'create', element: <InventoryCreatePage /> }, // ← 추가
          { path: 'low-stock', element: <LowStockPage /> },
          { path: ':id', element: <InventoryDetailPage /> },
          { path: ':id/edit', element: <InventoryEditPage /> }, // 신규
        ],
      },

      // ✅ 예약 관리
      {
        path: 'reservations',
        element: <ReservationsWithProvider />,
        children: [
          { index: true, element: <ReservationsPage /> },
          { path: 'create', element: <ReservationCreatePage /> },
          { path: 'services', element: <ReservationServicesPage /> }, // ← 추가
          {
            path: 'calendar',
            element: <ReservationCalendarPage />,
          },
          { path: ':id', element: <ReservationDetailPage /> },
          { path: ':id/edit', element: <ReservationEditPage /> },
        ],
      },
      // ✅ 결제 관리
      {
        path: 'payments',
        element: <PaymentsWithProvider />,
        children: [
          { index: true, element: <PaymentsPage /> },
          { path: 'create', element: <PaymentCreatePage /> },
          { path: 'stats', element: <PaymentStatsPage /> },
          { path: ':portOneId', element: <PaymentDetailPage /> },
        ],
      },
      // ✅ 워크인 관리
      {
        path: 'walk-ins',
        element: <WalkInsWithProvider />,
        children: [{ index: true, element: <WalkInsPage /> }],
      },
      // ✅ 주유 워크인
      {
        path: 'fuel-walk-ins',
        element: <FuelWalkInsWithProvider />,
        children: [{ index: true, element: <FuelWalkInsPage /> }],
      },
      // ✅ 난방유 배달
      {
        path: 'heating-oil-deliveries',
        element: <HeatingOilDeliveriesWithProvider />,
        children: [
          { index: true, element: <HeatingOilDeliveriesPage /> },
          { path: 'create', element: <HeatingOilDeliveryCreatePage /> },
        ],
      },

      // 주문
      {
        path: 'orders',
        element: <OrdersWithProvider />,
        children: [
          { index: true, element: <OrdersPage /> },
          { path: 'create', element: <OrderCreatePage /> },
          { path: 'stats', element: <div>주문 통계 (구현 예정)</div> },
          { path: 'live', element: <div>실시간 주문 (구현 예정)</div> },
          { path: 'history', element: <div>주문 히스토리 (구현 예정)</div> },
          { path: ':id', element: <OrderDetailPage /> },
          { path: ':id/edit', element: <OrderEditPage /> },
        ],
      },

      // ✅ 장바구니 관리
      {
        path: 'cart',
        element: <CartWithProvider />,
        children: [
          { index: true, element: <CartPage /> },
          { path: ':userId', element: <CartDetailPage /> },
        ],
      },

      // ✅ 배송 관리
      {
        path: 'delivery',
        element: <DeliveryWithProvider />,
        children: [
          { index: true, element: <DeliveryPage /> },
          { path: 'create', element: <DeliveryCreatePage /> },
          { path: 'drivers', element: <DeliveryDriversPage /> },
          { path: 'drivers/create', element: <DeliveryDriverCreatePage /> },
          { path: 'drivers/:id', element: <DeliveryDriverDetailPage /> }, // ✅ 추가
          { path: 'drivers/:id/edit', element: <DeliveryDriverEditPage /> }, // ✅ 추가
          { path: 'tracking', element: <DeliveryTrackingPage /> },
          { path: ':id', element: <DeliveryDetailPage /> },
          { path: ':id/edit', element: <DeliveryEditPage /> }, // ✅ 구현 완료
        ],
      },

      // 카테고리
      {
        path: 'categories',
        element: <CategoriesWithProvider />,
        children: [
          { index: true, element: <CategoriesPage /> },
          { path: 'hierarchy', element: <CategoryHierarchyPage /> },
        ],
      },

      // 미디어
      {
        path: 'media',
        element: <FileManagerLayout />,
        children: [
          { index: true, element: <FileManagerPage /> },
          { path: 'recent', element: <RecentFilesPage /> },
          { path: 'analysis', element: <StorageAnalysisPage /> },
        ],
      },

      // 서비스별 현황
      {
        path: 'services',
        children: [
          { path: 'gas-stations', element: <div>주유소 현황 (구현 예정)</div> },
          { path: 'car-care', element: <div>카케어 현황 (구현 예정)</div> },
          { path: 'delivery', element: <div>배달 현황 (구현 예정)</div> },
        ],
      },

      // 설정
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          { index: true, element: <SettingsGeneralPage /> },
          { path: 'billing', element: <SettingsBillingPage /> },
          { path: 'profile', element: <SettingsProfilePage /> },
          { path: 'notifications', element: <SettingsNotificationsPage /> },
          { path: 'master-key', element: <MasterKeyPromotePage /> },
        ],
      },
    ],
  },

  // 팀별 외부 경로들 (기존 유지)
  {
    path: '/stores',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <div>매장 목록 (구현 예정)</div> }],
  },
  {
    path: '/fuel-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'types', element: <div>유류 종류 (구현 예정)</div> },
      { path: 'inventory', element: <div>유류 재고 (구현 예정)</div> },
      { path: 'pricing', element: <div>가격 관리 (구현 예정)</div> },
    ],
  },
  {
    path: '/vehicles',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>등록 차량 (구현 예정)</div> },
      { path: 'history', element: <div>차량 히스토리 (구현 예정)</div> },
    ],
  },
  {
    path: '/emails',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>재고 (구현 예정)</div> },
      { path: 'fuel', element: <div>유류 재고 (구현 예정)</div> },
      { path: 'products', element: <div>용품 재고 (구현 예정)</div> },
      { path: 'alerts', element: <div>재고 알림 (구현 예정)</div> },
      { path: 'oil', element: <div>난방유 재고 (구현 예정)</div> },
      { path: 'supplies', element: <div>배달 용품 (구현 예정)</div> },
    ],
  },
  {
    path: '/payments',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <div>결제 관리 (구현 예정)</div> }],
  },
  {
    path: '/analytics',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'sales', element: <div>매출 현황 (구현 예정)</div> },
      { path: 'customers', element: <div>고객 분석 (구현 예정)</div> },
    ],
  },
  {
    path: '/service-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'wash', element: <div>세차 서비스 (구현 예정)</div> },
      { path: 'maintenance', element: <div>정비 서비스 (구현 예정)</div> },
      { path: 'packages', element: <div>서비스 패키지 (구현 예정)</div> },
    ],
  },
  {
    path: '/reservations',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>예약 현황 (구현 예정)</div> },
      { path: 'schedule', element: <div>예약 일정 (구현 예정)</div> },
      { path: 'queue', element: <div>대기 관리 (구현 예정)</div> },
    ],
  },
  {
    path: '/services',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'wash', element: <div>세차 서비스 (구현 예정)</div> },
      { path: 'maintenance', element: <div>정비 서비스 (구현 예정)</div> },
      { path: 'others', element: <div>기타 서비스 (구현 예정)</div> },
    ],
  },
  {
    path: '/reviews',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <div>리뷰 관리 (구현 예정)</div> }],
  },
  {
    path: '/promotions',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'events', element: <div>이벤트 관리 (구현 예정)</div> },
      { path: 'coupons', element: <div>쿠폰 관리 (구현 예정)</div> },
    ],
  },
  {
    path: '/delivery-products',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'heating-oil', element: <div>난방유 상품 (구현 예정)</div> },
      { path: 'areas', element: <div>배달 지역 (구현 예정)</div> },
      { path: 'fees', element: <div>배달료 관리 (구현 예정)</div> },
    ],
  },
  {
    path: '/drivers',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>배달원 목록 (구현 예정)</div> },
      { path: 'register', element: <div>배달원 등록 (구현 예정)</div> },
      { path: 'performance', element: <div>성과 관리 (구현 예정)</div> },
    ],
  },
  {
    path: '/delivery-status',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'tracking', element: <div>실시간 추적 (구현 예정)</div> },
      { path: 'completed', element: <div>배달 완료 (구현 예정)</div> },
      { path: 'delayed', element: <div>배달 지연 (구현 예정)</div> },
    ],
  },
  {
    path: '/suggestions',
    element: <SuggestionsWithProvider />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <SuggestionsPage /> },
      { path: 'create', element: <div>새 건의사항 (구현 예정)</div> },
      { path: 'my', element: <div>내 건의사항 (구현 예정)</div> },
      { path: 'safety', element: <div>안전 관련 (구현 예정)</div> },
      { path: 'service', element: <div>서비스 개선 (구현 예정)</div> },
      { path: 'facility', element: <div>시설 개선 (구현 예정)</div> },
      { path: 'wash-service', element: <div>세차 서비스 (구현 예정)</div> },
      { path: 'equipment', element: <div>장비 개선 (구현 예정)</div> },
      { path: 'customer-service', element: <div>고객 서비스 (구현 예정)</div> },
      { path: 'routes', element: <div>배달 경로 (구현 예정)</div> },
      { path: 'vehicle', element: <div>차량 관련 (구현 예정)</div> },
      { path: 'customer', element: <div>고객 응대 (구현 예정)</div> },
      { path: ':id', element: <SuggestionDetailPage /> },
    ],
  },

  {
    path: '/terms',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <div>이용약관 (구현 예정)</div> }],
  },
  {
    path: '/privacy',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>개인정보처리방침 (구현 예정)</div> },
    ],
  },
  //  배달기사 전용 (기존 /driver 라우트 — /admin/driver로 리다이렉트)
  {
    path: '/driver/*',
    element: <Navigate to="/admin/driver/dashboard" replace />,
  },
  { path: '*', element: <NotFoundError /> },
]);

export default router;
