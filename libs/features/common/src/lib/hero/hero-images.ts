import starcoexHorizontal from '../logo/company/SVG/Starcoex-Horizontal.svg';

// 2. 프리셋 정의 (키값으로 관리)
export const HeroPresets = {
  main: starcoexHorizontal,

  // 필요한 만큼 정적 이미지를 여기에 추가
} as const;

export type HeroPresetKey = keyof typeof HeroPresets;
