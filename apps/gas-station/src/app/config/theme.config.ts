/**
 * ⛽ Gas Station 대시보드 테마 설정
 */
export const themeConfig = {
  // 대시보드 색상 팔레트
  colors: {
    primary: {
      main: '#06B6D4', // cyan-500
      hover: '#0891B2', // cyan-600
      light: '#67E8F9', // cyan-300
      dark: '#0E7490', // cyan-700
    },
    secondary: {
      main: '#3B82F6', // blue-500
      hover: '#2563EB', // blue-600
      light: '#93C5FD', // blue-300
    },
    // 연료 타입별 네온 색상
    fuel: {
      gasoline: '#EF4444', // red-500
      diesel: '#22C55E', // green-500
      lpg: '#A855F7', // purple-500
      kerosene: '#F97316', // orange-500
    },
    // 상태 색상
    status: {
      operational: '#22C55E', // green-500
      busy: '#F97316', // orange-500
      maintenance: '#EF4444', // red-500
      offline: '#6B7280', // gray-500
    },
    // 대시보드 배경
    dashboard: {
      bg: '#020617', // slate-950
      surface: '#0F172A', // slate-900
      card: '#1E293B', // slate-800
      border: '#334155', // slate-700
    },
  },

  // 타이포그래피
  fonts: {
    primary: 'Space Grotesk, sans-serif',
    mono: 'JetBrains Mono, monospace',
    futuristic: 'Orbitron, sans-serif',
  },

  // 애니메이션 설정
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // 레이아웃
  layout: {
    maxWidth: '1400px',
    headerHeight: '80px',
    sidebarWidth: '320px',
    containerPadding: '1rem',
  },

  // 대시보드 특화 설정
  dashboard: {
    cardRadius: '12px',
    glowIntensity: '20px',
    pulseSpeed: '2s',
    scanlineSpeed: '3s',
  },
} as const;
