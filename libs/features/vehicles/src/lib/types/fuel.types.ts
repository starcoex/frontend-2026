/**
 * 오피넷 연료 제품 코드
 * B027: 휘발유
 * D047: 경유
 * B034: 고급휘발유
 * C004: 실내등유
 * K015: LPG
 */
export type FuelProductCode = 'B027' | 'D047' | 'B034' | 'C004' | 'K015';

// 편의를 위해 Enum처럼 쓸 수 있는 객체도 함께 export (선택 사항)
export const FuelProductCode = {
  GASOLINE: 'B027', // 휘발유
  DIESEL: 'D047', // 경유
  PREMIUM_GASOLINE: 'B034', // 고급휘발유
  KEROSENE: 'C004', // 실내등유
  LPG: 'K015', // LPG
} as const;
