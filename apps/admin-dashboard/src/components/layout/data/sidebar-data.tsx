import {
  IconBarbell,
  IconBoxSeam,
  IconBuildingStore,
  IconCalendar,
  IconCar,
  IconCarCrane,
  IconCategory,
  IconChartLine,
  IconChecklist,
  IconCoin,
  IconCreditCard,
  IconFileInvoice,
  IconGasStation,
  IconGift,
  IconLayoutDashboard,
  IconNotification,
  IconPackage,
  IconPhoto,
  IconReportAnalytics,
  IconSettings,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
  IconTags,
  IconTool,
  IconTruck,
  IconUser,
  IconUsers,
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

// 기본 사이드바 데이터
export const baseSidebarData = {
  teams: [
    {
      name: 'StarcoexMain',
      logo: ({ className }: { className: string }) => (
        <StarLogo
          format="png"
          width={20}
          height={20}
          className={cn('invert dark:invert-0', className)}
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
          className={cn('invert dark:invert-0', className)}
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
          className={cn('invert dark:invert-0', className)}
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
          className={cn('invert dark:invert-0', className)}
        />
      ),
      plan: '난방유 배달',
    },
  ],
};

// 팀별 네비게이션 그룹 정의
export const getNavGroupsByTeam = (teamName: TeamName): NavGroup[] => {
  // 공통 기본 그룹
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
        // ✅ Sales 대시보드 추가
        {
          title: '매출 현황',
          url: '/admin/sales',
          icon: IconChartLine,
        },
      ],
    },
  ];

  // 팀별 특화 메뉴
  const teamSpecificGroups: Record<string, NavGroup[]> = {
    StarcoexMain: [
      {
        title: '건의사항 관리',
        items: [
          {
            title: '건의사항',
            url: '/admin/suggestions',
            icon: IconChecklist, // 또는 새로운 아이콘
            items: [
              { title: '전체 건의사항', url: '/admin/suggestions' },
              { title: '대기중', url: '/admin/suggestions/pending' },
              { title: '검토중', url: '/admin/suggestions/reviewing' },
              { title: '진행중', url: '/admin/suggestions/in-progress' },
              { title: '완료됨', url: '/admin/suggestions/completed' },
              { title: '거부됨', url: '/admin/suggestions/rejected' },
              { title: '통계 분석', url: '/admin/suggestions/analytics' },
            ],
          },
        ],
      },
      {
        title: '통합 관리',
        items: [
          {
            title: '사용자 관리',
            url: '/admin/users', // ✅ /admin/users로 수정
            icon: IconUsers,
            items: [
              { title: '전체 사용자', url: '/admin/users' },
              { title: '관리자', url: '/admin/users/admins' }, // ✅ /admin 추가
              { title: '일반 회원', url: '/admin/users/members' }, // ✅ /admin 추가
              { title: '배달원', url: '/admin/users/drivers' }, // ✅ /admin 추가
              { title: '초대 관리', url: '/admin/users/invitations' }, // ✅ 아이콘 없이 서브메뉴로만
            ],
          },
          {
            title: '시스템 분석',
            url: '/admin/analytics', // ✅ /admin 추가
            icon: IconReportAnalytics,
            items: [
              { title: '통합 대시보드', url: '/admin/analytics' },
              { title: '매출 분석', url: '/admin/analytics/revenue' },
              { title: '사용자 분석', url: '/admin/analytics/users' },
              { title: '서비스 성능', url: '/admin/analytics/performance' },
            ],
          },
          {
            title: '알림 관리',
            url: '/admin/notifications', // ✅ /admin 추가
            icon: IconNotification,
          },
        ],
      },
      // ✅ 상품/주문 관리 그룹 추가
      {
        title: '커머스 관리',
        items: [
          {
            title: '제품 관리',
            url: '/admin/products',
            icon: IconPackage,
            items: [
              { title: '제품 목록', url: '/admin/products' },
              { title: '제품 추가', url: '/admin/products/create' },
              { title: '재고 현황', url: '/admin/products/inventory' },
            ],
          },
          {
            title: '재고 관리', // ✅ StoreInventory 기반 신규
            url: '/admin/inventory',
            icon: IconBoxSeam,
            items: [
              { title: '재고 현황', url: '/admin/inventory' },
              { title: '재고 추가', url: '/admin/inventory/create' }, // ← 추가
              { title: '재고 부족', url: '/admin/inventory/low-stock' },
            ],
          },
          {
            title: '주문 관리',
            url: '/admin/orders',
            icon: IconFileInvoice,
            items: [
              { title: '주문 목록', url: '/admin/orders' },
              { title: '주문 추가', url: '/admin/orders/create' }, // ✅ detail → create
              { title: '주문 통계', url: '/admin/orders/stats' },
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
          // ✅ 매장 관리 추가
          {
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' }, // ✅ 수정
            ],
          },
        ],
      },
      // ✅ 예약 관리 그룹 (신규)
      {
        title: '예약 관리',
        items: [
          {
            title: '예약 관리',
            url: '/admin/reservations',
            icon: IconCalendar,
            items: [
              { title: '예약 목록', url: '/admin/reservations' },
              { title: '예약 추가', url: '/admin/reservations/create' },
              {
                title: '서비스 설정',
                url: '/admin/reservations/services',
              },
              { title: '워크인 관리', url: '/admin/walk-ins' },
              { title: '주유 워크인', url: '/admin/fuel-walk-ins' },
              { title: '난방유 배달', url: '/admin/heating-oil-deliveries' },
              {
                title: '배달 등록',
                url: '/admin/heating-oil-deliveries/create',
              },
            ],
          },
        ],
      },
      {
        title: '미디어 & 자산',
        items: [
          {
            title: '미디어 관리',
            url: '/admin/media',
            icon: IconPhoto,
            items: [
              { title: '파일 관리자', url: '/admin/media' },
              { title: '최근 파일', url: '/admin/media/recent' },
              { title: '저장소 분석', url: '/admin/media/analysis' },
            ],
          },
        ],
      },
      {
        title: '서비스별 현황',
        items: [
          {
            title: '주유소 현황',
            url: '/admin/services/gas-stations',
            icon: IconGasStation,
          },
          {
            title: '카케어 현황',
            url: '/admin/services/car-care',
            icon: IconCarCrane,
          },
          {
            title: '배달 현황',
            url: '/admin/services/delivery',
            icon: IconTruck,
          },
        ],
      },
      // ✅ 통합 관리용 팀별 메뉴 추가
      {
        title: '주유소 관리',
        items: [
          {
            title: '매장 관리',
            url: '/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 관리', url: '/admin/stores/brands' },
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
            url: '/vehicles',
            icon: IconCar,
            items: [
              { title: '등록 차량', url: '/vehicles' },
              { title: '차량 히스토리', url: '/vehicles/history' },
            ],
          },
        ],
      },
      {
        title: '카케어 관리',
        items: [
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
            title: '예약 관리',
            url: '/reservations',
            icon: IconChecklist,
            items: [
              { title: '예약 현황', url: '/reservations' },
              { title: '예약 일정', url: '/reservations/schedule' },
              { title: '대기 관리', url: '/reservations/queue' },
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
          // ✅ 매장 관리 추가
          {
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 관리', url: '/admin/stores/brands' },
            ],
          },
        ],
      },
      {
        title: '배달 관리',
        items: [
          {
            title: '배달 상품',
            url: '/delivery-products',
            icon: IconShoppingCart,
            items: [
              { title: '난방유 상품', url: '/delivery-products/heating-oil' },
              { title: '배달 지역', url: '/delivery-products/areas' },
              { title: '배달료 관리', url: '/delivery-products/fees' },
            ],
          },
          {
            title: '배달원 관리',
            url: '/drivers',
            icon: IconUser,
            items: [
              { title: '배달원 목록', url: '/drivers' },
              { title: '배달원 등록', url: '/drivers/register' },
              { title: '성과 관리', url: '/drivers/performance' },
            ],
          },
          {
            title: '배달 현황',
            url: '/delivery-status',
            icon: IconTruck,
            items: [
              { title: '실시간 추적', url: '/delivery-status/tracking' },
              { title: '배달 완료', url: '/delivery-status/completed' },
              { title: '배달 지연', url: '/delivery-status/delayed' },
            ],
          },
          // ✅ 매장/거점 관리 추가
          {
            title: '거점 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '거점 목록', url: '/admin/stores' },
              { title: '거점 추가', url: '/admin/stores/create' },
              { title: '브랜드 관리', url: '/admin/stores/brands' },
            ],
          },
        ],
      },
    ],

    StarOil: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/suggestions' }, // ✅ 추가
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
            url: '/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' }, // ✅ 수정
              { title: '브랜드 추가', url: '/admin/stores/brands/create' }, // ✅ 추가
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
            url: '/vehicles',
            icon: IconCar,
            items: [
              { title: '등록 차량', url: '/vehicles' },
              { title: '차량 히스토리', url: '/vehicles/history' },
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

    Zeragae: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/suggestions' }, // ✅ 추가
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
            title: '매장 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '매장 목록', url: '/admin/stores' },
              { title: '매장 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' }, // ✅ 수정
              { title: '브랜드 추가', url: '/admin/stores/brands/create' }, // ✅ 추가
            ],
          },
          {
            title: '예약 관리',
            url: '/reservations',
            icon: IconChecklist,
            items: [
              { title: '예약 현황', url: '/reservations' },
              { title: '예약 일정', url: '/reservations/schedule' },
              { title: '대기 관리', url: '/reservations/queue' },
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
    ],

    Delivery: [
      {
        title: '건의 및 개선',
        items: [
          {
            title: '건의사항',
            url: '/suggestions',
            icon: IconChecklist,
            items: [
              { title: '전체 건의사항', url: '/suggestions' }, // ✅ 추가
              { title: '새 건의사항', url: '/suggestions/create' },
              { title: '내 건의사항', url: '/suggestions/my' },
              { title: '배달 경로', url: '/suggestions/routes' },
              { title: '안전 관련', url: '/suggestions/safety' },
              { title: '차량 관련', url: '/suggestions/vehicle' },
              { title: '고객 응대', url: '/suggestions/customer' },
            ],
          },
        ],
      },
      {
        title: '배달 관리',
        items: [
          {
            title: '주문 관리',
            url: '/orders',
            icon: IconShoppingBag,
            items: [
              { title: '실시간 주문', url: '/orders/live' },
              { title: '주문 히스토리', url: '/orders/history' },
              { title: '주문 통계', url: '/orders/stats' },
            ],
          },
          {
            title: '거점 관리',
            url: '/admin/stores',
            icon: IconBuildingStore,
            items: [
              { title: '거점 목록', url: '/admin/stores' },
              { title: '거점 추가', url: '/admin/stores/create' },
              { title: '브랜드 목록', url: '/admin/stores/brands' }, // ✅ 수정
              { title: '브랜드 추가', url: '/admin/stores/brands/create' }, // ✅ 추가
            ],
          },
          {
            title: '배달 상품',
            url: '/delivery-products',
            icon: IconShoppingCart,
            items: [
              { title: '난방유 상품', url: '/delivery-products/heating-oil' },
              { title: '배달 지역', url: '/delivery-products/areas' },
              { title: '배달료 관리', url: '/delivery-products/fees' },
            ],
          },
          {
            title: '배달원 관리',
            url: '/drivers',
            icon: IconUser,
            items: [
              { title: '배달원 목록', url: '/drivers' },
              { title: '배달원 등록', url: '/drivers/register' },
              { title: '성과 관리', url: '/drivers/performance' },
            ],
          },
          {
            title: '배달 현황',
            url: '/delivery-status',
            icon: IconTruck,
            items: [
              { title: '실시간 추적', url: '/delivery-status/tracking' },
              { title: '배달 완료', url: '/delivery-status/completed' },
              { title: '배달 지연', url: '/delivery-status/delayed' },
            ],
          },
          {
            title: '재고 관리',
            url: '/inventory',
            icon: IconPackage,
            items: [
              { title: '난방유 재고', url: '/inventory/oil' },
              { title: '배달 용품', url: '/inventory/supplies' },
            ],
          },
        ],
      },
    ],
  };

  // 공통 설정 그룹 (모든 팀에 공통)
  const settingsGroup: NavGroup = {
    title: '설정',
    items: [
      {
        title: '시스템 설정',
        icon: IconSettings,
        items: [
          {
            title: '일반 설정',
            icon: IconTool,
            url: '/admin/settings',
          },
          {
            title: '프로필',
            icon: IconUser,
            url: '/admin/settings/profile',
          },
          {
            title: '결제',
            icon: IconCoin,
            url: '/admin/settings/billing',
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
    ...baseGroups,
    ...(teamSpecificGroups[teamName] || []),
    settingsGroup,
  ];
};

export const filterMenuByRole = (
  navGroups: NavGroup[],
  userRole: UserRole
): NavGroup[] => {
  try {
    // ADMIN은 모든 메뉴 표시
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      return navGroups;
    }

    // 여기에 다른 권한 처리가 있다면 그것도 확인
    const rolePermissions: { [key: string]: string[] } = {
      USER: ['dashboard', 'settings'], // 대시보드와 설정만
      DELIVERY: ['dashboard', 'orders', 'delivery', 'settings'], // 배달 관련
    };

    const allowedMenus: string[] = rolePermissions[userRole] || [];

    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          allowedMenus.some((menu: string) => {
            const itemUrl = item.url || '';
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
  } catch (error) {
    return [];
  }
};

// 최종 사이드바 데이터 생성 함수
export const getSidebarData = (
  teamName: TeamName,
  userRole: UserRole,
  userData?: User // 사용자 정보 추가 (선택적)
): SidebarData => {
  const navGroups = getNavGroupsByTeam(teamName);
  const filteredNavGroups = filterMenuByRole(navGroups, userRole);

  // ✅ 실제 사용자 정보 또는 기본값 사용
  const user = userData || {
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
