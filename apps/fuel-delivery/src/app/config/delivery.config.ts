/**
 * 🚛 배송 서비스 전용 설정
 */
export const deliveryConfig = {
  // 서비스 지역
  serviceAreas: [
    {
      id: 'seoul',
      name: '서울특별시',
      code: 'seoul',
      districts: [
        '강남구',
        '서초구',
        '송파구',
        '강동구',
        '영등포구',
        '구로구',
        '금천구',
        '동작구',
        '관악구',
        '서대문구',
      ],
      deliveryFee: 3000,
      freeDeliveryMin: 100000, // 10만원 이상 무료배송
      maxDeliveryTime: 6, // 6시간 내 배송
      available: true,
    },
    {
      id: 'gyeonggi',
      name: '경기도',
      code: 'gyeonggi',
      districts: [
        '성남시',
        '용인시',
        '수원시',
        '안양시',
        '과천시',
        '의왕시',
        '군포시',
        '안산시',
        '시흥시',
        '부천시',
      ],
      deliveryFee: 5000,
      freeDeliveryMin: 150000,
      maxDeliveryTime: 8, // 8시간 내 배송
      available: true,
    },
    {
      id: 'incheon',
      name: '인천광역시',
      code: 'incheon',
      districts: ['남동구', '연수구', '서구', '중구'],
      deliveryFee: 7000,
      freeDeliveryMin: 200000,
      maxDeliveryTime: 12, // 12시간 내 배송
      available: false, // 추후 서비스 예정
    },
  ],

  // 배송 시간대
  deliverySlots: [
    {
      id: 'morning',
      name: '오전 (09:00-12:00)',
      available: true,
      additionalFee: 0,
      peak: false,
    },
    {
      id: 'afternoon',
      name: '오후 (13:00-17:00)',
      available: true,
      additionalFee: 0,
      peak: true, // 피크 시간
    },
    {
      id: 'evening',
      name: '저녁 (18:00-20:00)',
      available: true,
      additionalFee: 2000, // 야간 배송료
      peak: false,
      seasonalOnly: true, // 겨울철에만 운영
    },
  ],

  // 상품 정보
  products: [
    {
      id: 'kerosene-18L',
      name: '실내용 등유',
      capacity: 18,
      unit: 'L',
      price: 25000,
      minOrder: 1,
      maxOrder: 10,
      weight: 15, // kg
      description: '고품질 정제 등유, 냄새 적음, 완전연소',
      features: ['저황', '무냄새', '고효율'],
      category: 'kerosene',
      inStock: true,
    },
    {
      id: 'diesel-20L',
      name: '보일러용 경유',
      capacity: 20,
      unit: 'L',
      price: 28000,
      minOrder: 2,
      maxOrder: 20,
      weight: 17, // kg
      description: '보일러 전용 경유, 연소 효율 우수',
      features: ['고열량', '저공해', '보일러 최적화'],
      category: 'diesel',
      inStock: true,
    },
    {
      id: 'kerosene-200L',
      name: '대용량 등유 (드럼)',
      capacity: 200,
      unit: 'L',
      price: 280000,
      minOrder: 1,
      maxOrder: 5,
      weight: 170, // kg
      description: '업소용 대용량, 드럼 포함',
      features: ['대용량', '업소용', '드럼 임대'],
      category: 'kerosene',
      inStock: true,
      businessOnly: true, // 사업자만 주문 가능
    },
  ],

  // 정기 배송 옵션
  subscriptionOptions: [
    {
      id: 'weekly',
      period: 'weekly',
      name: '매주',
      intervalDays: 7,
      discount: 0.05,
      minDuration: 4, // 최소 4주
    },
    {
      id: 'biweekly',
      period: 'biweekly',
      name: '격주',
      intervalDays: 14,
      discount: 0.03,
      minDuration: 6, // 최소 6회
    },
    {
      id: 'monthly',
      period: 'monthly',
      name: '매월',
      intervalDays: 30,
      discount: 0.02,
      minDuration: 3, // 최소 3개월
    },
  ],

  // 배송 추적
  tracking: {
    statuses: [
      {
        code: 'ordered',
        name: '주문 접수',
        description: '주문이 접수되었습니다',
      },
      {
        code: 'confirmed',
        name: '주문 확인',
        description: '주문 내용을 확인했습니다',
      },
      {
        code: 'preparing',
        name: '상품 준비',
        description: '배송할 상품을 준비 중입니다',
      },
      {
        code: 'loaded',
        name: '차량 적재',
        description: '배송 차량에 상품을 적재했습니다',
      },
      {
        code: 'dispatched',
        name: '배송 출발',
        description: '배송지로 출발했습니다',
      },
      {
        code: 'in_transit',
        name: '배송 중',
        description: '고객님 지역으로 배송 중입니다',
      },
      {
        code: 'arrived',
        name: '배송 도착',
        description: '배송지에 도착했습니다',
      },
      {
        code: 'delivered',
        name: '배송 완료',
        description: '배송이 완료되었습니다',
      },
      {
        code: 'failed',
        name: '배송 실패',
        description: '배송에 실패했습니다. 고객센터로 연락드립니다',
      },
    ],
    updateInterval: 30000, // 30초마다 업데이트
    gpsTracking: true,
    smsNotification: true,
  },

  // 계절별 운영 정책
  seasonal: {
    peak: {
      // 성수기 (11월-3월)
      months: [11, 12, 1, 2, 3],
      maxOrdersPerDay: 200,
      extendedHours: true, // 운영시간 연장
      emergencyOrders: true, // 긴급 주문 접수
    },
    low: {
      // 비성수기 (4월-10월)
      months: [4, 5, 6, 7, 8, 9, 10],
      maxOrdersPerDay: 50,
      extendedHours: false,
      emergencyOrders: false,
      maintenanceMode: true, // 시설 점검 모드
    },
  },

  // 주문 한도
  orderLimits: {
    personal: {
      maxQuantityPerOrder: 10,
      maxOrdersPerMonth: 20,
      maxAmountPerMonth: 500000,
    },
    business: {
      maxQuantityPerOrder: 50,
      maxOrdersPerMonth: 100,
      maxAmountPerMonth: 2000000,
    },
  },

  // 비상 연락처
  emergency: {
    customerService: '1588-9999',
    deliveryCenter: '1588-8888',
    emergencyHotline: '1588-7777',
    hours: {
      normal: '08:00-18:00',
      emergency: '24시간',
    },
  },
} as const;

export type DeliveryConfig = typeof deliveryConfig;
