/**
 * 🚗 세차 서비스 전용 설정
 */
export const serviceConfig = {
  // 운영 시간
  operatingHours: {
    weekday: {
      start: '08:00',
      end: '20:00',
      breakTime: {
        start: '12:00',
        end: '13:00',
      },
    },
    weekend: {
      start: '09:00', 
      end: '18:00',
      breakTime: null,
    },
    holiday: {
      start: '09:00',
      end: '18:00', 
      breakTime: null,
    },
  },
  
  // 예약 설정
  booking: {
    // 예약 가능한 미래 일수
    advanceDays: 14,
    
    // 예약 최소 시간 (현재 시간 기준)
    minimumAdvanceMinutes: 120, // 2시간
    
    // 예약 슬롯 간격 (분)
    slotInterval: 30,
    
    // 동시 예약 가능한 최대 차량 수
    maxConcurrentBookings: 4,
    
    // 취소 가능한 시간 (예약 시간 기준)
    cancellationDeadlineHours: 2,
  },
  
  // 지원하는 차량 유형
  vehicleTypes: [
    {
      id: 'sedan',
      name: '승용차',
      description: '일반 승용차 (소형/중형/대형)',
      basePrice: 15000,
      estimatedDuration: 45, // 분
      icon: '🚗',
    },
    {
      id: 'suv',
      name: 'SUV/RV',
      description: 'SUV, RV 등 대형 차량',
      basePrice: 20000,
      estimatedDuration: 60,
      icon: '🚙',
    },
    {
      id: 'truck',
      name: '트럭/밴',
      description: '소형트럭, 밴, 상용차',
      basePrice: 25000,
      estimatedDuration: 75,
      icon: '🚚',
    },
    {
      id: 'motorcycle',
      name: '오토바이',
      description: '오토바이, 스쿠터',
      basePrice: 8000,
      estimatedDuration: 20,
      icon: '🏍️',
    },
  ] as const,
  
  // 세차 서비스 옵션
  serviceOptions: {
    wash: [
      {
        id: 'basic',
        name: '기본 세차',
        description: '외부 세차 + 간단한 실내 청소',
        priceMultiplier: 1.0,
        duration: 0, // 기본 시간 사용
        features: ['외부 세차', '바퀴 세척', '간단한 실내 청소'],
      },
      {
        id: 'premium',
        name: '프리미엄 세차',
        description: '완전 세차 + 왁싱 + 실내 상세 청소',
        priceMultiplier: 1.8,
        duration: 30, // 추가 30분
        features: ['완전 외부 세차', '왁싱', '실내 상세 청소', '유리막 코팅', '타이어 광택'],
      },
      {
        id: 'express',
        name: '급속 세차',
        description: '빠른 외부 세차 (실내 청소 없음)',
        priceMultiplier: 0.7,
        duration: -15, // 15분 단축
        features: ['급속 외부 세차', '바퀴 세척'],
      },
    ],
    
    addons: [
      {
        id: 'interior_detail',
        name: '실내 디테일링',
        description: '실내 완전 청소 및 소독',
        price: 10000,
        duration: 20,
      },
      {
        id: 'waxing',
        name: '왁싱 서비스',
        description: '차량 표면 보호 왁싱',
        price: 15000,
        duration: 15,
      },
      {
        id: 'tire_care',
        name: '타이어 케어',
        description: '타이어 광택 및 보호',
        price: 5000,
        duration: 10,
      },
    ],
  },
  
  // 서비스 지역
  serviceAreas: [
    {
      id: 'seoul',
      name: '서울특별시',
      districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구'],
      enabled: true,
    },
    {
      id: 'gyeonggi',
      name: '경기도',
      districts: ['성남시', '용인시', '수원시', '안양시', '과천시'],
      enabled: true,
    },
    {
      id: 'incheon',
      name: '인천광역시',
      districts: ['남동구', '연수구', '서구'],
      enabled: false, // 준비 중
    },
  ],
  
  // 알림 설정
  notifications: {
    booking: {
      confirmation: true,
      reminder: true,
      reminderHours: [24, 2], // 24시간 전, 2시간 전
    },
    
    status: {
      started: true,
      completed: true,
      cancelled: true,
      rescheduled: true,
    },
    
    promotional: {
      enabled: true,
      frequency: 'weekly',
    },
  },
  
} as const;

export type ServiceConfig = typeof serviceConfig;
export type VehicleType = (typeof serviceConfig.vehicleTypes)[number];
export type WashService = (typeof serviceConfig.serviceOptions.wash)[number];
export type ServiceAddon = (typeof serviceConfig.serviceOptions.addons)[number];
