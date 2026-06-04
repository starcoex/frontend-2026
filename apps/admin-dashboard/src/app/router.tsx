import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { AdminLayout } from './layout/admin-layout';
import { AuthLayout } from './layout/auth-layout';
import {
  ErrorBoundary,
  NotFoundError,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@starcoex-frontend/common';
import { MainLayout } from '@/app/layout/main-layout';

// ─── 로딩 컴포넌트 ─────────────────────────────────────────────────────────────
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

// ─── 인증 ──────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@/app/pages/auth/login-page').then((m) => ({
    default: m.LoginPage,
  }))
);
const BusinessRegisterPage = lazy(() =>
  import('@/app/pages/auth/business-register-page').then((m) => ({
    default: m.BusinessRegisterPage,
  }))
);
const VerifyEmailPage = lazy(
  () => import('@/app/pages/auth/verify-email.page')
);
const AcceptInvitationPage = lazy(() =>
  import('@/app/pages/auth/accept-invitations.page').then((m) => ({
    default: m.AcceptInvitationPage,
  }))
);

// ─── 공통 ──────────────────────────────────────────────────────────────────────
const HomePage = lazy(() =>
  import('@/app/pages/home-page').then((m) => ({ default: m.HomePage }))
);
const DashboardPage = lazy(() =>
  import('@/app/pages/dashboard/dasbhboard-page').then((m) => ({
    default: m.DashboardPage,
  }))
);
const DashboardLayout = lazy(() =>
  import('@/app/pages/dashboard/dashboard-layout').then((m) => ({
    default: m.DashboardLayout,
  }))
);

// ─── 건의사항 ──────────────────────────────────────────────────────────────────
const SuggestionsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/suggestions/suggestions-with-provider').then(
    (m) => ({ default: m.SuggestionsWithProvider })
  )
);
const SuggestionsPage = lazy(
  () => import('@/app/pages/dashboard/suggestions/suggestions-page')
);
const SuggestionDetailPage = lazy(
  () =>
    import('@/app/pages/dashboard/suggestions/details/suggestion-detail-page')
);

// ─── 사용자 ────────────────────────────────────────────────────────────────────
const UsersWithProvider = lazy(() =>
  import('@/app/pages/dashboard/users/users-with-provider').then((m) => ({
    default: m.UsersWithProvider,
  }))
);
const UsersPage = lazy(() => import('@/app/pages/dashboard/users/users-page'));
const UserDetailPage = lazy(() =>
  import('@/app/pages/dashboard/users/details/detail.page').then((m) => ({
    default: m.UserDetailPage,
  }))
);
const InvitationsPage = lazy(() =>
  import('@/app/pages/dashboard/users/Invitations.page').then((m) => ({
    default: m.InvitationsPage,
  }))
);

// ─── 설정 ──────────────────────────────────────────────────────────────────────
const SettingsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/settings/settings-with-provider').then((m) => ({
    default: m.SettingsWithProvider,
  }))
);
const SettingsGeneralPage = lazy(
  () => import('@/app/pages/dashboard/settings/settings-page')
);
const SettingsBillingPage = lazy(
  () => import('@/app/pages/dashboard/settings/billing/billing-page')
);
const SettingsProfilePage = lazy(
  () => import('@/app/pages/dashboard/settings/profile/profile-page')
);
const SettingsNotificationsPage = lazy(
  () =>
    import('@/app/pages/dashboard/settings/notifications/notifications-page')
);
const MasterKeyPromotePage = lazy(
  () => import('@/app/pages/dashboard/settings/master-key-page')
);

// ─── 매장 ──────────────────────────────────────────────────────────────────────
const StoresWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/stores/stores-with-provider').then(
    (m) => ({ default: m.StoresWithProvider })
  )
);
const StoresPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/stores/stores-page')
);
const StoreCreatePage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/stores/create/store-create-page')
);
const StoreDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/stores/stores-detail/store-detail-page'
    )
);
const StoreEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/stores/edit/store-edit-page')
);
const BrandsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/stores/brands/brands-page')
);
const StoresSettingsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/stores/settings/stores-settings-page'
    )
);

// ─── 제품 ──────────────────────────────────────────────────────────────────────
const ProductsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/products/products-with-provider'
  ).then((m) => ({ default: m.ProductsWithProvider }))
);
const ProductsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/products/products-page')
);
const ProductCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/products/create/product-create-page'
    )
);
const ProductDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/products/product-detail/product-detail-page'
    )
);
const ProductEditPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/products/edit/product-edit-page')
);
const ProductInventoryPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/products/inventory/inventory-page')
);
const ProductSettingsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/products/settings/product-settings-page'
    )
);
const ProductScanWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/products/products-scan-with-provider'
  ).then((m) => ({ default: m.ProductScanWithProvider }))
);

// ─── 재고 ──────────────────────────────────────────────────────────────────────
const InventoryWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/inventory/inventory-with-provider'
  ).then((m) => ({ default: m.InventoryWithProvider }))
);
const InventoryPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/inventory/inventory-page')
);
const InventoryCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/inventory/create/inventory-create-page'
    )
);
const InventoryDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/inventory/inventory-detail/inventory-detail-page'
    )
);
const InventoryEditPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/inventory/edit/inventory-edit-page')
);
const LowStockPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/inventory/low-stock-page')
);

// ─── 주문 ──────────────────────────────────────────────────────────────────────
const OrdersWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/orders/orders-with-provider').then(
    (m) => ({ default: m.OrdersWithProvider })
  )
);
const OrdersPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/orders/orders-page')
);
const OrderCreatePage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/orders/create/order-create-page')
);
const OrderDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/orders/order-detail/order-detail-page'
    )
);
const OrderEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/orders/edit/order-edit-page')
);
const OrderStatsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/orders/order-stats/order-stats-page'
    )
);

// ─── 대기열 ────────────────────────────────────────────────────────────────────
const QueueWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/queue/queue-with-provider').then(
    (m) => ({ default: m.QueueWithProvider })
  )
);
const QueuePage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/queue/queue-page')
);
const QueueDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/queue/queue-detail/queue-detail-page'
    )
);
const QueueStatsPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/queue/queue-stats/queue-stats-page')
);
// ✅ 수기 등록 페이지 추가
const QueueCreatePage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/queue/create/queue-create-page')
);
// ✅ 추가
const QueueEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/queue/edit/queue-edit-page')
);
// ─── 장바구니 ──────────────────────────────────────────────────────────────────
const CartWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/cart/cart-with-provider').then(
    (m) => ({ default: m.CartWithProvider })
  )
);
const CartPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/cart/cart-page')
);
const CartCreatePage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/cart/create/cart-create-page')
);
const CartDetailPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/cart/cart-detail/cart-detail-page')
);

// ─── 결제 ──────────────────────────────────────────────────────────────────────
const PaymentsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/payments/payments-with-provider'
  ).then((m) => ({ default: m.PaymentsWithProvider }))
);
const PaymentsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/payments/payments-page')
);
const PaymentCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/payments/create/payment-create-page'
    )
);
const PaymentDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/payments/payment-detail/payment-detail-page'
    )
);
const PaymentStatsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/payments/payment-stats/payment-stats-page'
    )
);

// ─── 주소 ──────────────────────────────────────────────────────────────────────
const AddressWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/address/address-with-provider').then(
    (m) => ({ default: m.AddressWithProvider })
  )
);
const AddressPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/address/address-page')
);
const AddressCreatePage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/address/create/address-create-page')
);
const AddressDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/address/address-detail/address-detail-page'
    )
);
const AddressLogsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/address/address-logs/address-logs-page'
    )
);
const AddressStatsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/address/address-stats/address-stats-page'
    )
);

// ─── 카테고리 ──────────────────────────────────────────────────────────────────
const CategoriesWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/categories/categories-with-provider'
  ).then((m) => ({ default: m.CategoriesWithProvider }))
);
const CategoriesPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/categories/categories-page')
);
const CategoryHierarchyPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/categories/category-hierachy-page')
);

// ─── 채팅 ──────────────────────────────────────────────────────────────────────
const ChatsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/chat/chats-with-provider').then(
    (m) => ({ default: m.ChatsWithProvider })
  )
);
const ChatsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/chat/chats-page')
);

// ─── 배송 ──────────────────────────────────────────────────────────────────────
const DeliveryWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/delivery/delivery-with-provider'
  ).then((m) => ({ default: m.DeliveryWithProvider }))
);
const DeliveryPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/delivery/delivery-page')
);
const DeliveryCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/create/delivery-create-page'
    )
);
const DeliveryDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/delivery-detail/delivery-detail-page'
    )
);
const DeliveryEditPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/delivery/edit/delivery-edit-page')
);
const DeliveryDriversPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/drivers/delivery-drivers-page'
    )
);
const DeliveryDriverCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/drivers/create/delivery-driver-create-page'
    )
);
const DeliveryDriverDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/delivery-driver-detail-page'
    )
);
const DeliveryDriverEditPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/drivers/edit/delivery-driver-edit-page'
    )
);
const DeliveryTrackingPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/tracking/delivery-tracking-page'
    )
);
const DeliverySettlementsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/settlements/delivery-settlements-page'
    )
);
const DeliveryPricingPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/delivery/pricing/delivery-pricing-page'
    )
);

// ─── 예약 ──────────────────────────────────────────────────────────────────────
const ReservationsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/reservations/reservation-with-provider'
  ).then((m) => ({ default: m.ReservationsWithProvider }))
);
const ReservationsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/reservations/reservation-page')
);
const ReservationDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/reservation-detail/reservation-detail-page'
    )
);
const ReservationCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/create/reservation-create-step5'
    )
);
const ReservationEditPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-page'
    )
);
const ReservationCalendarPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/calendar/reservation-calendar-page'
    )
);
const ReservationServicesPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/services/reservation-service-page'
    )
);
const WalkInsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/reservations/walk-ins/walk-ins-with-provider'
  ).then((m) => ({ default: m.WalkInsWithProvider }))
);
const WalkInsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/walk-ins/walk-ins-page'
    )
);
const FuelWalkInsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/reservations/fuel-walk-ins/fuel-walk-ins-with-provider'
  ).then((m) => ({ default: m.FuelWalkInsWithProvider }))
);
const FuelWalkInsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/fuel-walk-ins/fuel-walk-ins-page'
    )
);
const HeatingOilDeliveriesWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/heating-oil-deliveries-with-provider'
  ).then((m) => ({ default: m.HeatingOilDeliveriesWithProvider }))
);
const HeatingOilDeliveriesPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/heating-oil-deliveries-page'
    )
);
const HeatingOilDeliveryCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/create/heating-oil-delivery-create-page'
    )
);

// ─── 알림 ──────────────────────────────────────────────────────────────────────
const NotificationsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/notifications/notifications-with-provider'
  ).then((m) => ({ default: m.NotificationsWithProvider }))
);
const NotificationsPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/notifications/notifications-page')
);
const SendNotificationPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notifications/send/send-notification-page'
    )
);
const EmailsPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/notifications/emails/emails-page')
);

// ─── 공지 & 매뉴얼 ─────────────────────────────────────────────────────────────
const NoticesWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/notices/notices-with-provider').then(
    (m) => ({ default: m.NoticesWithProvider })
  )
);
const NoticesPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/notices/notices-page')
);
const NoticeCreatePage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/notices/create/notice-create-page')
);
const NoticeDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notices/notice-detail/notice-detail-page'
    )
);
const NoticeEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/notices/edit/notice-edit-page')
);
const ManualsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/notices/manuals/manuals-page')
);
const ManualCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notices/manuals/create/manual-create-page'
    )
);
const ManualEditPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notices/manuals/edit/manual-edit-page'
    )
);
const ManualDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notices/manuals/manual-detail/manual-detail-page'
    )
);
const ManualCategoriesPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/notices/manuals/categories/manual-categories-page'
    )
);

// ─── 로열티 ────────────────────────────────────────────────────────────────────
const LoyaltyWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/loyalty/loyalty-with-provider').then(
    (m) => ({ default: m.LoyaltyWithProvider })
  )
);
const LoyaltyPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/loyalty/loyalty-page')
);
const LoyaltyMemberDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/loyalty/loyalty-detail/loyalty-detail-page'
    )
);
const LoyaltySettingsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/loyalty/settings/loyalty-settings-page'
    )
);
const LoyaltyStarEventsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/loyalty/events/loyalty-star-events-page'
    )
);
const LoyaltyStarHistoryPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/loyalty/star/loyalty-star-history-page'
    )
);

// ─── 프로모션 ──────────────────────────────────────────────────────────────────
const PromotionsWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/ecommerce/promotions/promotions-with-provider'
  ).then((m) => ({ default: m.PromotionsWithProvider }))
);
const PromotionsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/promotions/promotions-page')
);
const PromotionCreatePage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/promotions/create/promotion-create-page'
    )
);
const PromotionEditPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/promotions/edit/promotion-edit-page'
    )
);
const PromotionDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/promotions/loyalty-detail/promotion-detail-page'
    )
);

// ─── 리뷰 ──────────────────────────────────────────────────────────────────────
const ReviewsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/reviews/reviews-with-provider').then(
    (m) => ({ default: m.ReviewsWithProvider })
  )
);
const ReviewsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/reviews/reviews-page')
);
const ReviewCreatePage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/reviews/create/review-create-page')
);
const ReviewScopesPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/reviews/scopes/review-scopes-page')
);
const ReviewDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/reviews/review-detail/review-detail-page'
    )
);
const ReviewEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/reviews/edit/review-edit-page')
);

// ─── 채용 공고 ─────────────────────────────────────────────────────────────────
const JobsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/ecommerce/jobs/jobs-with-provider').then(
    (m) => ({
      default: m.JobsWithProvider,
    })
  )
);
const JobsPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/jobs/jobs-page')
);
const JobCreatePage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/jobs/create/job-create-page')
);
const JobDetailPage = lazy(
  () =>
    import('@/app/pages/dashboard/ecommerce/jobs/job-detail/job-detail-page')
);
const JobEditPage = lazy(
  () => import('@/app/pages/dashboard/ecommerce/jobs/edit/job-edit-page')
);
const JobApplicationsPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/jobs/applications/job-applications-page'
    )
);
const JobApplicationDetailPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/jobs/applications/detail/job-application-detail-page'
    )
);
const JobApplicationAdminEditPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/ecommerce/jobs/applications/edit/job-application-edit-page'
    )
);

// ─── 분석 ──────────────────────────────────────────────────────────────────────
const AnalyticsWithProvider = lazy(() =>
  import('@/app/pages/dashboard/board/analytics/analytics-with-provider').then(
    (m) => ({ default: m.AnalyticsWithProvider })
  )
);
const OverviewPage = lazy(
  () => import('@/app/pages/dashboard/board/analytics/pages/overview-page')
);
const RealtimePage = lazy(
  () => import('@/app/pages/dashboard/board/analytics/pages/realtime-page')
);
const RankingPage = lazy(
  () => import('@/app/pages/dashboard/board/analytics/pages/ranking-page')
);
const ServiceAnalyticsPage = lazy(
  () => import('@/app/pages/dashboard/board/analytics/pages/service-page')
);
const AdminAnalyticsPage = lazy(
  () => import('@/app/pages/dashboard/board/analytics/pages/admin-page')
);

// ─── 매출 ──────────────────────────────────────────────────────────────────────
const SalesWithProvider = lazy(() =>
  import('@/app/pages/dashboard/board/sales/sales-with-provider').then((m) => ({
    default: m.SalesWithProvider,
  }))
);
const SalesPage = lazy(
  () => import('@/app/pages/dashboard/board/sales/sales-page')
);

// ─── 미디어 ────────────────────────────────────────────────────────────────────
const FileManagerWithProvider = lazy(() =>
  import(
    '@/app/pages/dashboard/board/file-manager/file-manager-with-provider'
  ).then((m) => ({ default: m.FileManagerWithProvider }))
);

const FileManagerPage = lazy(() =>
  import('@/app/pages/dashboard/board/file-manager/file-manager-page').then(
    (m) => ({ default: m.FileManagerPage })
  )
);
const RecentFilesPage = lazy(
  () =>
    import('@/app/pages/dashboard/board/file-manager/pages/recent-files-page')
);
const StorageAnalysisPage = lazy(
  () =>
    import(
      '@/app/pages/dashboard/board/file-manager/pages/storage-analysis-page'
    )
);

// ─── 배달기사 ──────────────────────────────────────────────────────────────────
const DriverWithProvider = lazy(() =>
  import('@/app/pages/teams/delivery/driver/driver-with-provider').then(
    (m) => ({ default: m.DriverWithProvider })
  )
);
const DriverDashboardPage = lazy(
  () => import('@/app/pages/teams/delivery/driver/driver-dashboard-page')
);
const DriverDeliveriesPage = lazy(
  () =>
    import(
      '@/app/pages/teams/delivery/driver/deliveries/driver-deliveries-page'
    )
);
const DriverActivePage = lazy(
  () => import('@/app/pages/teams/delivery/driver/active/driver-active-page')
);
const DriverProfilePage = lazy(
  () => import('@/app/pages/teams/delivery/driver/profile/driver-profile-page')
);
const DriverSettlementsPage = lazy(
  () =>
    import(
      '@/app/pages/teams/delivery/driver/settlements/driver-settlements-page'
    )
);

const router = createBrowserRouter([
  // ───  메인 ──────────────────────────────────────────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: S(HomePage) }],
  },

  // ───  인증 ──────────────────────────────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'login', element: S(LoginPage) },
      { path: 'register', element: S(BusinessRegisterPage) },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: S(VerifyEmailPage) },
      { path: 'accept-invitation', element: S(AcceptInvitationPage) },
    ],
  },

  // ───  관리자 대시보드 ────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: S(DashboardLayout),
        children: [{ index: true, element: S(DashboardPage) }],
      },
      // ─── 배달기사 전용 ───────────────────────────────────────────────────
      {
        path: 'driver',
        element: S(DriverWithProvider),
        children: [
          { path: 'dashboard', element: S(DriverDashboardPage) },
          { path: 'deliveries', element: S(DriverDeliveriesPage) },
          { path: 'active', element: S(DriverActivePage) },
          { path: 'profile', element: S(DriverProfilePage) },
          { path: 'settlements', element: S(DriverSettlementsPage) },
        ],
      },
      // ─── 매출 현황 ───────────────────────────────────────────────────────
      {
        path: 'sales',
        element: S(SalesWithProvider),
        children: [{ index: true, element: S(SalesPage) }],
      },
      // ─── 건의사항 ────────────────────────────────────────────────────────
      {
        path: 'suggestions',
        element: S(SuggestionsWithProvider),
        children: [
          { index: true, element: S(SuggestionsPage) },
          { path: 'pending', element: S(SuggestionsPage) },
          { path: 'reviewing', element: S(SuggestionsPage) },
          { path: 'in-progress', element: S(SuggestionsPage) },
          { path: 'completed', element: S(SuggestionsPage) },
          { path: 'rejected', element: S(SuggestionsPage) },
          { path: 'my', element: S(SuggestionsPage) },
          { path: ':id', element: S(SuggestionDetailPage) },
          { path: ':id/edit', element: <div>건의사항 수정</div> },
        ],
      },
      // ─── 사용자 관리 ─────────────────────────────────────────────────────
      {
        path: 'users',
        element: S(UsersWithProvider),
        children: [
          { index: true, element: S(UsersPage) },
          { path: 'admins', element: S(UsersPage) },
          { path: 'members', element: S(UsersPage) },
          { path: 'drivers', element: S(UsersPage) },
          { path: 'invitations', element: S(InvitationsPage) },
          { path: ':id', element: S(UserDetailPage) },
        ],
      },
      // ─── 로열티 관리 ─────────────────────────────────────────────────────
      {
        path: 'loyalty',
        element: S(LoyaltyWithProvider),
        children: [
          { index: true, element: S(LoyaltyPage) },
          { path: 'settings', element: S(LoyaltySettingsPage) },
          { path: 'star-events', element: S(LoyaltyStarEventsPage) },
          { path: 'star-history', element: S(LoyaltyStarHistoryPage) },
          { path: ':userId', element: S(LoyaltyMemberDetailPage) },
        ],
      },
      // ─── 프로모션 관리 ───────────────────────────────────────────────────
      {
        path: 'promotions',
        element: S(PromotionsWithProvider),
        children: [
          { index: true, element: S(PromotionsPage) },
          { path: 'create', element: S(PromotionCreatePage) },
          { path: ':id', element: S(PromotionDetailPage) },
          { path: ':id/edit', element: S(PromotionEditPage) },
        ],
      },
      // ─── 리뷰 관리 ───────────────────────────────────────────────────────
      {
        path: 'reviews',
        element: S(ReviewsWithProvider),
        children: [
          { index: true, element: S(ReviewsPage) },
          { path: 'create', element: S(ReviewCreatePage) },
          { path: 'scopes', element: S(ReviewScopesPage) },
          { path: ':id', element: S(ReviewDetailPage) },
          { path: ':id/edit', element: S(ReviewEditPage) },
        ],
      },
      // ─── 채용 공고 ───────────────────────────────────────────────────────
      {
        path: 'jobs',
        element: S(JobsWithProvider),
        children: [
          { index: true, element: S(JobsPage) },
          { path: 'create', element: S(JobCreatePage) },
          { path: 'applications', element: S(JobApplicationsPage) }, // ✅ 정적 경로 먼저
          { path: 'applications/:id', element: S(JobApplicationDetailPage) },
          {
            path: 'applications/:id/edit',
            element: S(JobApplicationAdminEditPage),
          },
          { path: ':id', element: S(JobDetailPage) },
          { path: ':id/edit', element: S(JobEditPage) },
          { path: ':id/applications', element: S(JobApplicationsPage) },
        ],
      },
      // ─── 시스템 분석 ─────────────────────────────────────────────────────
      {
        path: 'analytics',
        element: S(AnalyticsWithProvider),
        children: [
          { index: true, element: S(OverviewPage) },
          { path: 'realtime', element: S(RealtimePage) },
          { path: 'ranking', element: S(RankingPage) },
          { path: 'service', element: S(ServiceAnalyticsPage) },
          { path: 'admin', element: S(AdminAnalyticsPage) },
        ],
      },
      // ─── 알림 관리 ───────────────────────────────────────────────────────
      {
        path: 'notifications',
        element: S(NotificationsWithProvider),
        children: [
          { index: true, element: S(NotificationsPage) },
          { path: 'send', element: S(SendNotificationPage) },
          { path: 'emails', element: S(EmailsPage) },
        ],
      },
      // ─── 공지 & 매뉴얼 ───────────────────────────────────────────────────
      {
        path: 'notices',
        element: S(NoticesWithProvider),
        children: [
          { index: true, element: S(NoticesPage) },
          { path: 'create', element: S(NoticeCreatePage) },
          { path: ':id', element: S(NoticeDetailPage) },
          { path: ':id/edit', element: S(NoticeEditPage) },
          { path: 'manuals', element: S(ManualsPage) },
          { path: 'manuals/create', element: S(ManualCreatePage) },
          { path: 'manuals/categories', element: S(ManualCategoriesPage) },
          { path: 'manuals/:id', element: S(ManualDetailPage) },
          { path: 'manuals/:id/edit', element: S(ManualEditPage) },
        ],
      },
      // ─── 매장 ────────────────────────────────────────────────────────────
      {
        path: 'stores',
        element: S(StoresWithProvider),
        children: [
          { index: true, element: S(StoresPage) },
          { path: 'create', element: S(StoreCreatePage) },
          { path: 'brands', element: S(BrandsPage) },
          { path: 'settings', element: S(StoresSettingsPage) },
          { path: ':id', element: S(StoreDetailPage) },
          { path: ':id/edit', element: S(StoreEditPage) },
        ],
      },
      // ─── 제품 ────────────────────────────────────────────────────────────
      {
        path: 'products',
        element: S(ProductsWithProvider),
        children: [
          { index: true, element: S(ProductsPage) },
          { path: 'create', element: S(ProductCreatePage) },
          { path: 'inventory', element: S(ProductInventoryPage) },
          { path: 'settings', element: S(ProductSettingsPage) },
          { path: ':id', element: S(ProductDetailPage) },
          { path: ':id/edit', element: S(ProductEditPage) },
        ],
      },
      { path: 'products/send', element: S(ProductScanWithProvider) },
      // ─── 재고 ────────────────────────────────────────────────────────────
      {
        path: 'inventory',
        element: S(InventoryWithProvider),
        children: [
          { index: true, element: S(InventoryPage) },
          { path: 'create', element: S(InventoryCreatePage) },
          { path: 'low-stock', element: S(LowStockPage) },
          { path: ':id', element: S(InventoryDetailPage) },
          { path: ':id/edit', element: S(InventoryEditPage) },
        ],
      },
      // ─── 주문 ────────────────────────────────────────────────────────────
      {
        path: 'orders',
        element: S(OrdersWithProvider),
        children: [
          { index: true, element: S(OrdersPage) },
          { path: 'create', element: S(OrderCreatePage) },
          { path: 'stats', element: S(OrderStatsPage) },
          { path: ':id', element: S(OrderDetailPage) },
          { path: ':id/edit', element: S(OrderEditPage) },
        ],
      },
      // ─── 대기열 ──────────────────────────────────────────────────────────
      {
        path: 'queue',
        element: S(QueueWithProvider),
        children: [
          { index: true, element: S(QueuePage) },
          { path: 'create', element: S(QueueCreatePage) }, // ✅ 추가
          { path: 'stats', element: S(QueueStatsPage) },
          { path: ':id', element: S(QueueDetailPage) },
          { path: ':id/edit', element: S(QueueEditPage) }, // ✅ 추가
        ],
      },
      // ─── 장바구니 ─────────────────────────────────────────────────────────
      {
        path: 'cart',
        element: S(CartWithProvider),
        children: [
          { index: true, element: S(CartPage) },
          { path: 'create', element: S(CartCreatePage) },
          { path: ':userId', element: S(CartDetailPage) },
        ],
      },
      // ─── 결제 ────────────────────────────────────────────────────────────
      {
        path: 'payments',
        element: S(PaymentsWithProvider),
        children: [
          { index: true, element: S(PaymentsPage) },
          { path: 'create', element: S(PaymentCreatePage) },
          { path: 'stats', element: S(PaymentStatsPage) },
          { path: ':portOneId', element: S(PaymentDetailPage) },
        ],
      },
      // ─── 주소 ────────────────────────────────────────────────────────────
      {
        path: 'addresses',
        element: S(AddressWithProvider),
        children: [
          { index: true, element: S(AddressPage) },
          { path: 'create', element: S(AddressCreatePage) },
          { path: 'stats', element: S(AddressStatsPage) },
          { path: 'logs', element: S(AddressLogsPage) },
          { path: ':id', element: S(AddressDetailPage) },
        ],
      },
      // ─── 카테고리 ─────────────────────────────────────────────────────────
      {
        path: 'categories',
        element: S(CategoriesWithProvider),
        children: [
          { index: true, element: S(CategoriesPage) },
          { path: 'hierarchy', element: S(CategoryHierarchyPage) },
        ],
      },
      // ─── 채팅 ────────────────────────────────────────────────────────────
      {
        path: 'chats',
        element: S(ChatsWithProvider),
        children: [{ index: true, element: S(ChatsPage) }],
      },
      // ─── 배송 ────────────────────────────────────────────────────────────
      {
        path: 'delivery',
        element: S(DeliveryWithProvider),
        children: [
          { index: true, element: S(DeliveryPage) },
          { path: 'create', element: S(DeliveryCreatePage) },
          { path: 'drivers', element: S(DeliveryDriversPage) },
          { path: 'drivers/create', element: S(DeliveryDriverCreatePage) },
          { path: 'drivers/:id', element: S(DeliveryDriverDetailPage) },
          { path: 'drivers/:id/edit', element: S(DeliveryDriverEditPage) },
          { path: 'tracking', element: S(DeliveryTrackingPage) },
          { path: 'settlements', element: S(DeliverySettlementsPage) },
          { path: 'pricing', element: S(DeliveryPricingPage) },
          { path: ':id', element: S(DeliveryDetailPage) },
          { path: ':id/edit', element: S(DeliveryEditPage) },
        ],
      },
      // ─── 예약 관리 ───────────────────────────────────────────────────────
      {
        path: 'reservations',
        element: S(ReservationsWithProvider),
        children: [
          { index: true, element: S(ReservationsPage) },
          { path: 'create', element: S(ReservationCreatePage) },
          { path: 'services', element: S(ReservationServicesPage) },
          { path: 'calendar', element: S(ReservationCalendarPage) },
          { path: ':id', element: S(ReservationDetailPage) },
          { path: ':id/edit', element: S(ReservationEditPage) },
        ],
      },
      {
        path: 'walk-ins',
        element: S(WalkInsWithProvider),
        children: [{ index: true, element: S(WalkInsPage) }],
      },
      {
        path: 'fuel-walk-ins',
        element: S(FuelWalkInsWithProvider),
        children: [{ index: true, element: S(FuelWalkInsPage) }],
      },
      {
        path: 'heating-oil-deliveries',
        element: S(HeatingOilDeliveriesWithProvider),
        children: [
          { index: true, element: S(HeatingOilDeliveriesPage) },
          { path: 'create', element: S(HeatingOilDeliveryCreatePage) },
        ],
      },
      // ─── 미디어 & 자산 ───────────────────────────────────────────────────
      {
        path: 'media',
        element: S(FileManagerWithProvider),
        children: [
          { index: true, element: S(FileManagerPage) },
          { path: 'recent', element: S(RecentFilesPage) },
          { path: 'analysis', element: S(StorageAnalysisPage) },
        ],
      },
      // ─── 설정 ────────────────────────────────────────────────────────────
      {
        path: 'settings',
        element: S(SettingsWithProvider),
        children: [
          { index: true, element: S(SettingsGeneralPage) },
          { path: 'billing', element: S(SettingsBillingPage) },
          { path: 'profile', element: S(SettingsProfilePage) },
          { path: 'notifications', element: S(SettingsNotificationsPage) },
          { path: 'master-key', element: S(MasterKeyPromotePage) },
        ],
      },
    ],
  },

  // ─── 팀별 외부 경로 ────────────────────────────────────────────────────────
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
    element: S(SuggestionsWithProvider),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: S(SuggestionsPage) },
      { path: 'my', element: S(SuggestionsPage) },
      { path: 'safety', element: S(SuggestionsPage) },
      { path: 'service', element: S(SuggestionsPage) },
      { path: 'facility', element: S(SuggestionsPage) },
      { path: 'wash-service', element: S(SuggestionsPage) },
      { path: 'equipment', element: S(SuggestionsPage) },
      { path: 'customer-service', element: S(SuggestionsPage) },
      { path: ':id', element: S(SuggestionDetailPage) },
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
  {
    path: '/driver/*',
    element: <Navigate to="/admin/driver/dashboard" replace />,
  },
  { path: '*', element: <NotFoundError /> },
]);

export default router;
