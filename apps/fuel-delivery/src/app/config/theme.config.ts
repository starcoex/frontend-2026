/**
 * 🚛 Fuel Delivery 테마 설정
 */
export const themeConfig = {
  // 배송 테마 색상
  colors: {
    primary: {
      main: '#ea580c', // orange-600
      light: '#fb923c', // orange-400
      dark: '#c2410c', // orange-700
      contrast: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9', // sky-500
      light: '#38bdf8', // sky-400
      dark: '#0284c7', // sky-600
      contrast: '#ffffff',
    },
    accent: {
      main: '#22c55e', // green-500 (배송 성공)
      light: '#4ade80', // green-400
      dark: '#16a34a', // green-600
    },
    warning: {
      main: '#f59e0b', // amber-500 (배송 지연)
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
    },
    danger: {
      main: '#ef4444', // red-500 (배송 실패)
      light: '#f87171', // red-400
      dark: '#dc2626', // red-600
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },

  // 폰트 설정
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Noto Sans KR, sans-serif',
    mono: 'JetBrains Mono, Monaco, monospace',
  },

  // 배송 앱 특화 스타일
  delivery: {
    statusColors: {
      ordered: '#64748b', // gray-500
      confirmed: '#3b82f6', // blue-500
      preparing: '#f59e0b', // amber-500
      loaded: '#8b5cf6', // violet-500
      dispatched: '#06b6d4', // cyan-500
      in_transit: '#0ea5e9', // sky-500
      arrived: '#10b981', // emerald-500
      delivered: '#22c55e', // green-500
      failed: '#ef4444', // red-500
    },

    // 지도 관련 색상
    mapColors: {
      route: '#3b82f6', // 배송 경로
      vehicle: '#ea580c', // 배송 차량
      destination: '#dc2626', // 목적지
      serviceArea: '#22c55e', // 서비스 가능 지역
    },

    // 계절별 테마
    seasonal: {
      winter: {
        primary: '#dc2626', // 빨간색 계열 (따뜻함)
        gradient: 'from-red-500 to-orange-500',
      },
      summer: {
        primary: '#0ea5e9', // 파란색 계열 (시원함)
        gradient: 'from-blue-500 to-cyan-500',
      },
    },
  },

  // 반응형 브레이크포인트
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // 애니메이션 설정
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // 그림자 설정
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
