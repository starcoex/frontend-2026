import {
  IconBarbell,
  IconBook,
  IconBoxSeam,
  IconBriefcase,
  IconBuildingStore,
  IconCalendar,
  IconCar,
  IconCarCrane,
  IconCarGarage,
  IconCategory,
  IconChartLine,
  IconChecklist,
  IconCoin,
  IconCreditCard,
  IconFileInvoice,
  IconGasStation,
  IconGift,
  IconLayoutDashboard,
  IconMapPin,
  IconMessage,
  IconMessageCircle,
  IconNotification,
  IconPackage,
  IconPhoto,
  IconReportAnalytics,
  IconSettings,
  IconShieldSearch,
  IconShoppingCart,
  IconSpeakerphone,
  IconStar,
  IconTag,
  IconTags,
  IconTool,
  IconTruck,
  IconUser,
  IconUsers,
  IconWallet,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
  type NavGroup,
  type SidebarData,
  TeamName,
  User,
  UserRole,
} from '@/app/types/sidebar-type';
import {
  StarLogo,
  StarOilLogo,
  StarDeliveryLogo,
  ZeragaeLogo,
} from '@starcoex-frontend/common';

// ─── 팀 목록 ──────────────────────────────────────────────────────────────────

export const baseSidebarData = {
  teams: [
    {
      name: 'StarcoexMain',
      logo: ({ className }: { className: string }) => (
        <StarLogo
          format="png"
          width={20}
          height={20}
          className={cn('object-contain', className)}
        />
      ),
      plan: '통합 관리 시스템',
    },
    {
      name: 'StarOil',
      logo: ({ className }: { className: string }) => (
        <StarOilLogo
          format="png"
          width={20}
          height={20}
          className={cn('object-contain', className)}
        />
      ),
      plan: '별표 주유소 관리',
    },
    {
      name: 'Zeragae',
      logo: ({ className }: { className: string }) => (
        <ZeragaeLogo
          format="png"
          width={20}
          height={20}
          className={cn('object-contain', className)}
        />
      ),
      plan: '제라게 카케어',
    },
    {
      name: 'Delivery',
      logo: ({ className }: { className: string }) => (
        <StarDeliveryLogo
          format="png"
          width={20}
          height={20}
          className={cn('object-contain', className)}
        />
      ),
      plan: '난방유 배달',
    },
  ],
};

// ─── 팀별 네비게이션 그룹 ─────────────────────────────────────────────────────

export const getNavGroupsByTeam = (teamName: TeamName): NavGroup[] => {
  const teamSpecificGroups: Record<string, NavGroup[]> = {
    // =========================================================================
    // StarcoexMain — 전사 크로스커팅 관심사 담당
    // =========================================================================
    StarcoexMain: [
      // 1. 건의사항 통합
      {
        title: '건의사항 관리',
        items: [
          {
            title: '건의사항',
            url: '/admin/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/admin/suggestions' },
              { title: '대기중', url: '/admin/suggestions/pending' },
              { title: '검토중', url: '/admin/suggestions/reviewing' },
              { title: '진행중', url: '/admin/suggestions/in-progress' },
              { title: '완료됨', url: '/admin/suggestions/completed' },
              { title: '거부됨', url: '/admin/suggestions/rejected' },
            ],
          },
        ],
      },

      // 2. 전사 통합 관리
      {
        title: '통합 관리',
        items: [
          {
            title: '사용자 관리',
            url: '/admin/users',
            icon: IconUsers,
            items: [
              { title: '전체 사용자', url: '/admin/users' },
              { title: '관리자', url: '/admin/users/admins' },
              { title: '일반 회원', url: '/admin/users/members' },
              { title: '배달원', url: '/admin/users/drivers' },
              { title: '초대 관리', url: '/admin/users/invitations' },
            ],
          },
          {
            title: '로열티 관리',
            url: '/admin/loyalty',
            icon: IconStar,
            items: [
              { title: '회원 등급 목록', url: '/admin/loyalty' },
              { title: '별 히스토리', url: '/admin/loyalty/star-history' },
              { title: '별 적립 이벤트', url: '/admin/loyalty/star-events' },
              { title: '멤버십 설정', url: '/admin/loyalty/settings' },
            ],
          },
          {
            title: '프로모션 관리',
            url: '/admin/promotions',
            icon: IconTag,
            items: [
              { title: '프로모션 목록', url: '/admin/promotions' },
              { title: '프로모션 생성', url: '/admin/promotions/create' },
            ],
          },
          {
            title: '리뷰 관리',
            url: '/admin/reviews',
            icon: IconStar,
            items: [
              { title: '리뷰 목록', url: '/admin/reviews' },
              { title: '스코프 관리', url: '/admin/reviews/scopes' },
            ],
          },
          {
            title: '채용 공고 관리',
            url: '/admin/jobs',
            icon: IconBriefcase,
            items: [
              { title: '공고 목록', url: '/admin/jobs' },
              { title: '공고 추가', url: '/admin/jobs/create' },
              { title: '지원자 관리', url: '/admin/jobs/applications' },
            ],
          },
          {
            title: '알림 관리',
            url: '/admin/notifications',
            icon: IconNotification,
            items: [
              { title: '알림 목록', url: '/admin/notifications' },
              { title: '알림 전송', url: '/admin/notifications/send' },
              { title: '이메일 관리', url: '/admin/notifications/emails' },
            ],
          },
          {
            title: 'Apick 차량 조회',
            url: '/admin/apick/flood',
            icon: IconShieldSearch,
            items: [
              { title: '침수차 조회', url: '/admin/apick/flood' },
              { title: '폐차사고처리 조회', url: '/admin/apick/scrap' },
              { title: '매매용 차량 조회', url: '/admin/apick/sale' },
              { title: '통합 검색', url: '/admin/apick/search' },
              { title: '통계', url: '/admin/apick/stats' },
              { title: '계정 정보', url: '/admin/apick/account' },
            ],
          },
        ],
      },

      // 3. 커머스 관리
      {
        title: '커머스 관리',
        items: [
          {
            title: '결제 관리',
            url: '/admin/payments',
            icon: IconCreditCard,
            items: [
              { title: '결제 목록', url: '/admin/payments' },
              { title: '결제 추가', url: '/admin/payments/create' },
              { title: '결제 통계', url: '/admin/payments/stats' },
            ],
          },
          {
            title: '제품 관리',
            url: '/admin/products',
            icon: IconPackage,
            items: [
              { title: '제품 목록', url: '/admin/products' },
              { title: '제품 추가', url: '/admin/products/create' },
              { title: '재고 현황', url: '/admin/products/inventory' },
              { title: '제품 설정', url: '/admin/products/settings' },
            ],
          },
          {
            title: '재고 관리',
            url: '/admin/inventory',
            icon: IconBoxSeam,
            items: [
              { title: '재고 현황', url: '/admin/inventory' },
              { title: '재고 추가', url: '/admin/inventory/create' },
              { title: '재고 부족', url: '/admin/inventory/low-stock' },
            ],
          },
          {
            title: '주문 관리',
            url: '/admin/orders',
            icon: IconFileInvoice,
            items: [
              { title: '주문 목록', url: '/admin/orders' },
              { title: '주문 추가', url: '/admin/orders/create' },
              { title: '주문 통계', url: '/admin/orders/stats' },
            ],
          },
          {
            title: '대기열 관리',
            url: '/admin/queue',
            icon: IconChecklist,
            items: [
              { title: '대기열 목록', url: '/admin/queue' },
              { title: '대기 수기 등록', url: '/admin/queue/create' },
              { title: '대기열 통계', url: '/admin/queue/stats' },
            ],
          },
          {
            title: '장바구니 관리',
            url: '/admin/cart',
            icon: IconShoppingCart,
            items: [
              { title: '장바구니 목록', url: '/admin/cart' },
              { title: '상품 추가', url: '/admin/cart/create' },
            ],
          },
          {
            title: '주소 관리',
            url: '/admin/addresses',
            icon: IconMapPin,
            items: [
              { title: '주소 목록', url: '/admin/addresses' },
              { title: '주소 검색 · 저장', url: '/admin/addresses/create' },
              { title: '통계', url: '/admin/addresses/stats' },
              { title: '검색 로그', url: '/admin/addresses/logs' },
            ],
          },
          {
            title: '카테고리 관리',
            url: '/admin/categories',
            icon: IconCategory,
            items: [
              { title: '카테고리 목록', url: '/admin/categories' },
              { title: '카테고리 계층', url: '/admin/categories/hierarchy' },
            ],
          },
          {
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' },
              { title: '매장 설정', url: '/admin/stores/settings' },
            ],
          },
          {
            title: '채팅 관리',
            url: '/admin/chats',
            icon: IconMessage,
            items: [{ title: '채팅방 목록', url: '/admin/chats' }],
          },
        ],
      },

      // 4. 예약 & 워크인
      {
        title: '예약 & 워크인',
        items: [
          {
            title: '예약 관리',
            url: '/admin/reservations',
            icon: IconCalendar,
            items: [
              { title: '예약 목록', url: '/admin/reservations' },
              { title: '예약 추가', url: '/admin/reservations/create' },
              { title: '예약 캘린더', url: '/admin/reservations/calendar' },
              { title: '서비스 설정', url: '/admin/reservations/services' },
            ],
          },
          {
            title: '워크인 관리',
            url: '/admin/walk-ins',
            icon: IconCarCrane,
            items: [
              { title: '워크인 목록', url: '/admin/walk-ins' },
              { title: '주유 워크인', url: '/admin/fuel-walk-ins' },
              { title: '난방유 배달', url: '/admin/heating-oil-deliveries' },
            ],
          },
        ],
      },

      {
        title: '고객 문의',
        items: [
          {
            title: '문의 관리',
            url: '/admin/contacts',
            icon: IconMessageCircle,
            items: [
              { title: '문의 목록', url: '/admin/contacts' },
              { title: '문의 통계', url: '/admin/contacts/stats' },
            ],
          },
        ],
      },

      // 5. 배송 관리
      {
        title: '배송 관리',
        items: [
          {
            title: '배송 관리',
            url: '/admin/delivery',
            icon: IconTruck,
            items: [
              { title: '전체 배송 목록', url: '/admin/delivery' },
              { title: '배송 등록', url: '/admin/delivery/create' },
              { title: '배송 추적', url: '/admin/delivery/tracking' },
            ],
          },
          {
            title: '기사 관리',
            url: '/admin/delivery/drivers',
            icon: IconUser,
            items: [
              { title: '기사 목록', url: '/admin/delivery/drivers' },
              { title: '기사 등록', url: '/admin/delivery/drivers/create' },
            ],
          },
          {
            title: '정산 관리',
            url: '/admin/delivery/settlements',
            icon: IconWallet,
            items: [
              { title: '전체 정산 목록', url: '/admin/delivery/settlements' },
            ],
          },
        ],
      },

      // 6. 공지 & 매뉴얼
      {
        title: '공지 & 매뉴얼',
        items: [
          {
            title: '공지 관리',
            url: '/admin/notices',
            icon: IconSpeakerphone,
            items: [
              { title: '공지 목록', url: '/admin/notices' },
              { title: '공지 추가', url: '/admin/notices/create' },
            ],
          },
          {
            title: '매뉴얼 관리',
            url: '/admin/notices/manuals',
            icon: IconBook,
            items: [
              { title: '매뉴얼 목록', url: '/admin/notices/manuals' },
              { title: '매뉴얼 추가', url: '/admin/notices/manuals/create' },
              {
                title: '카테고리 관리',
                url: '/admin/notices/manuals/categories',
              },
            ],
          },
        ],
      },

      // 7. 미디어 & 자산
      {
        title: '미디어 & 자산',
        items: [
          {
            title: '미디어 관리',
            url: '/admin/media',
            icon: IconPhoto,
            items: [
              { title: '파일 관리자', url: '/admin/media' },
              { title: '파일 업로드', url: '/admin/media/upload' }, // ✅ 추가
              { title: '최근 파일', url: '/admin/media/recent' },
              { title: '저장소 분석', url: '/admin/media/analysis' },
            ],
          },
        ],
      },
    ],

    // =========================================================================
    // StarOil — 주유소 전담
    // =========================================================================
    StarOil: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/suggestions' },
              { title: '새 건의사항', url: '/suggestions/create' },
              { title: '내 건의사항', url: '/suggestions/my' },
              { title: '안전 관련', url: '/suggestions/safety' },
              { title: '서비스 개선', url: '/suggestions/service' },
              { title: '시설 개선', url: '/suggestions/facility' },
            ],
          },
        ],
      },
      {
        title: '주유소 관리',
        items: [
          {
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' },
              { title: '브랜드 추가', url: '/admin/stores/brands/create' },
            ],
          },
          {
            title: '유류 상품',
            url: '/fuel-products',
            icon: IconBoxSeam,
            items: [
              { title: '유류 종류', url: '/fuel-products/types' },
              { title: '유류 재고', url: '/fuel-products/inventory' },
              { title: '가격 관리', url: '/fuel-products/pricing' },
            ],
          },
          {
            title: '차량 관리',
            url: '/admin/vehicles',
            icon: IconCar,
            items: [
              { title: '전체 차량', url: '/admin/vehicles' },
              { title: '검토 대기', url: '/admin/vehicles/pending-review' },
              { title: '낮은 신뢰도', url: '/admin/vehicles/low-confidence' },
              { title: '브랜드 관리', url: '/admin/vehicles/brands' },
              { title: '차량 모델', url: '/admin/vehicles/models' },
              { title: '치수 등급 룰', url: '/admin/vehicles/dimension-rules' },
            ],
          },
          {
            title: '재고 관리',
            url: '/inventory',
            icon: IconPackage,
            items: [
              { title: '유류 재고', url: '/inventory/fuel' },
              { title: '용품 재고', url: '/inventory/products' },
              { title: '재고 알림', url: '/inventory/alerts' },
            ],
          },
          {
            title: '결제 관리',
            url: '/payments',
            icon: IconCreditCard,
          },
        ],
      },
      {
        title: '예약 & 워크인',
        items: [
          {
            title: '예약 관리',
            url: '/admin/reservations',
            icon: IconCalendar,
            items: [
              { title: '예약 목록', url: '/admin/reservations' },
              { title: '예약 추가', url: '/admin/reservations/create' },
              { title: '예약 캘린더', url: '/admin/reservations/calendar' },
              { title: '서비스 설정', url: '/admin/reservations/services' },
            ],
          },
          {
            title: '워크인 관리',
            url: '/admin/walk-ins',
            icon: IconGasStation,
            items: [
              { title: '워크인 목록', url: '/admin/walk-ins' },
              { title: '주유 워크인', url: '/admin/fuel-walk-ins' },
            ],
          },
        ],
      },
      {
        title: '운영 분석',
        items: [
          {
            title: '매출 현황',
            url: '/analytics/sales',
            icon: IconBarbell,
          },
          {
            title: '고객 분석',
            url: '/analytics/customers',
            icon: IconUsers,
          },
        ],
      },
    ],

    // =========================================================================
    // Zeragae — 카케어 전담
    // =========================================================================
    Zeragae: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/suggestions' },
              { title: '새 건의사항', url: '/suggestions/create' },
              { title: '내 건의사항', url: '/suggestions/my' },
              { title: '세차 서비스', url: '/suggestions/wash-service' },
              { title: '장비 개선', url: '/suggestions/equipment' },
              { title: '고객 서비스', url: '/suggestions/customer-service' },
            ],
          },
        ],
      },
      {
        title: '카케어 관리',
        items: [
          {
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' },
              { title: '매장 설정', url: '/admin/stores/settings' },
            ],
          },
          {
            title: '차량 등급 관리',
            url: '/admin/vehicles',
            icon: IconCarGarage,
            items: [
              { title: '전체 차량', url: '/admin/vehicles' },
              { title: '검토 대기', url: '/admin/vehicles/pending-review' },
              { title: '낮은 신뢰도', url: '/admin/vehicles/low-confidence' },
            ],
          },
          {
            title: '세차 가격 정책',
            url: '/admin/car-care/prices',
            icon: IconTags,
            items: [
              { title: '가격 목록', url: '/admin/car-care/prices' },
              { title: '가격 추가', url: '/admin/car-care/prices/create' },
              { title: '추가금 정책', url: '/admin/car-care/surcharges' },
              {
                title: '추가금 추가',
                url: '/admin/car-care/surcharges/create',
              },
            ],
          },
          {
            title: '서비스 상품',
            url: '/service-products',
            icon: IconTags,
            items: [
              { title: '세차 서비스', url: '/service-products/wash' },
              { title: '정비 서비스', url: '/service-products/maintenance' },
              { title: '서비스 패키지', url: '/service-products/packages' },
            ],
          },
          {
            title: '서비스 관리',
            url: '/services',
            icon: IconCarCrane,
            items: [
              { title: '세차 서비스', url: '/services/wash' },
              { title: '정비 서비스', url: '/services/maintenance' },
              { title: '기타 서비스', url: '/services/others' },
            ],
          },
          {
            title: '리뷰 관리',
            url: '/reviews',
            icon: IconStar,
          },
          {
            title: '프로모션',
            url: '/promotions',
            icon: IconGift,
            items: [
              { title: '이벤트 관리', url: '/promotions/events' },
              { title: '쿠폰 관리', url: '/promotions/coupons' },
            ],
          },
        ],
      },
      {
        title: '예약 관리',
        items: [
          {
            title: '예약 관리',
            url: '/reservations',
            icon: IconCalendar,
            items: [
              { title: '예약 현황', url: '/reservations' },
              { title: '예약 일정', url: '/reservations/schedule' },
              { title: '대기 관리', url: '/reservations/queue' },
            ],
          },
        ],
      },
    ],

    // =========================================================================
    // Delivery — 배달 전담
    // =========================================================================
    Delivery: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/admin/suggestions',
            icon: IconChecklist,
            items: [{ title: '내 건의사항', url: '/admin/suggestions' }],
          },
        ],
      },
      {
        title: '배송 현황',
        items: [
          {
            title: '배송 목록',
            url: '/admin/driver/deliveries',
            icon: IconTruck,
          },
          {
            title: '진행 중인 배송',
            url: '/admin/driver/active',
            icon: IconBoxSeam,
          },
        ],
      },
      {
        title: '내 정산',
        items: [
          {
            title: '정산 내역',
            url: '/admin/driver/settlements',
            icon: IconWallet,
            items: [
              { title: '전체 내역', url: '/admin/driver/settlements' },
              {
                title: '지급 완료',
                url: '/admin/driver/settlements?status=paid',
              },
            ],
          },
        ],
      },
      {
        title: '배달 관리',
        items: [
          {
            title: '배송 관리',
            url: '/admin/delivery',
            icon: IconTruck,
            items: [
              { title: '전체 배송 목록', url: '/admin/delivery' },
              { title: '배송 등록', url: '/admin/delivery/create' },
              { title: '배송 추적', url: '/admin/delivery/tracking' },
            ],
          },
          {
            title: '기사 관리',
            url: '/admin/delivery/drivers',
            icon: IconUser,
            items: [
              { title: '기사 목록', url: '/admin/delivery/drivers' },
              { title: '기사 등록', url: '/admin/delivery/drivers/create' },
            ],
          },
          {
            title: '배달비 정책',
            url: '/admin/delivery/pricing',
            icon: IconCoin,
            items: [{ title: '정책 목록', url: '/admin/delivery/pricing' }],
          },
          {
            title: '정산 관리',
            url: '/admin/delivery/settlements',
            icon: IconWallet,
            items: [
              { title: '전체 정산 목록', url: '/admin/delivery/settlements' },
              {
                title: '정산 대기',
                url: '/admin/delivery/settlements?status=PENDING',
              },
              {
                title: '승인 대기',
                url: '/admin/delivery/settlements?status=CALCULATED',
              },
              {
                title: '지급 처리',
                url: '/admin/delivery/settlements?status=APPROVED',
              },
            ],
          },
        ],
      },
    ],
  };

  // ─── Delivery 팀 전용 baseGroups ──────────────────────────────────────────
  if (teamName === 'Delivery') {
    const deliveryBaseGroups: NavGroup[] = [
      {
        title: '대시보드',
        items: [
          {
            title: '관리 시스템',
            url: '/admin',
            icon: IconLayoutDashboard,
            items: [{ title: '요약 분석', url: '/admin' }],
          },
          {
            title: '매출 현황',
            url: '/admin/driver/dashboard',
            icon: IconChartLine,
            items: [{ title: '대시보드', url: '/admin/driver/dashboard' }],
          },
        ],
      },
    ];

    const deliverySettingsGroup: NavGroup = {
      title: '설정',
      items: [
        {
          title: '시스템 설정',
          icon: IconSettings,
          items: [
            { title: '일반 설정', icon: IconTool, url: '/admin/settings' },
            {
              title: '내 프로필',
              icon: IconUser,
              url: '/admin/driver/profile',
            },
            {
              title: '알림 설정',
              icon: IconNotification,
              url: '/admin/settings/notifications',
            },
          ],
        },
      ],
    };

    return [
      ...deliveryBaseGroups,
      ...(teamSpecificGroups['Delivery'] ?? []),
      deliverySettingsGroup,
    ];
  }

  // ─── 공통 baseGroups (Delivery 제외) ──────────────────────────────────────
  const baseGroups: NavGroup[] = [
    {
      title: '대시 보드',
      items: [
        {
          title: '관리 시스템',
          url: '/admin',
          icon: IconLayoutDashboard,
          items: [{ title: '요약 분석', url: '/admin' }],
        },
        {
          title: '시스템 분석',
          url: '/admin/analytics',
          icon: IconReportAnalytics,
        },
        {
          title: '매출 현황',
          url: '/admin/sales',
          icon: IconChartLine,
        },
      ],
    },
  ];

  const settingsGroup: NavGroup = {
    title: '설정',
    items: [
      {
        title: '시스템 설정',
        icon: IconSettings,
        items: [
          { title: '일반 설정', icon: IconTool, url: '/admin/settings' },
          { title: '프로필', icon: IconUser, url: '/admin/settings/profile' },
          { title: '결제', icon: IconCoin, url: '/admin/settings/billing' },
          {
            title: '알림 설정',
            icon: IconNotification,
            url: '/admin/settings/notifications',
          },
        ],
      },
    ],
  };

  return [
    ...baseGroups,
    ...(teamSpecificGroups[teamName] || []),
    settingsGroup,
  ];
};

// ─── 역할별 메뉴 필터 ─────────────────────────────────────────────────────────

export const filterMenuByRole = (
  navGroups: NavGroup[],
  userRole: UserRole
): NavGroup[] => {
  try {
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      return navGroups;
    }

    if (userRole === 'DELIVERY') {
      return navGroups.filter((group) => group.title !== '배달 관리');
    }

    const rolePermissions: Record<string, string[]> = {
      USER: ['dashboard', 'settings'],
    };

    const allowedMenus = rolePermissions[userRole] ?? [];

    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          allowedMenus.some((menu) => {
            const itemUrl = item.url ?? '';
            const itemTitle = item.title.toLowerCase();
            return (
              itemUrl.includes(menu) ||
              itemTitle.includes(menu) ||
              menu === 'dashboard'
            );
          })
        ),
      }))
      .filter((group) => group.items.length > 0);
  } catch {
    return [];
  }
};

// ─── 최종 사이드바 데이터 생성 ────────────────────────────────────────────────

export const getSidebarData = (
  teamName: TeamName,
  userRole: UserRole,
  userData?: User
): SidebarData => {
  const resolvedTeamName: TeamName =
    userRole === 'DELIVERY' ? 'Delivery' : teamName;

  const navGroups = getNavGroupsByTeam(resolvedTeamName);
  const filteredNavGroups = filterMenuByRole(navGroups, userRole);

  const user = userData ?? {
    name: 'Guest User',
    email: 'guest@starcoex.com',
    avatar: '/avatars/default.png',
  };

  return {
    user,
    teams: baseSidebarData.teams,
    navGroups: filteredNavGroups,
  };
};
