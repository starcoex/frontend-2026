/**
 * 🎨 테마 및 디자인 시스템 설정
 */
export const themeConfig = {
  // 브랜드 컬러 (세차 서비스 특화)
  colors: {
    primary: '#0ea5e9',        // 깨끗한 파란색
    primaryRgb: '14, 165, 233',
    secondary: '#06b6d4',      // 청록색
    accent: '#3b82f6',         // 강조 파란색
    
    // 상태별 컬러
    success: '#10b981',        // 완료 (녹색)
    warning: '#f59e0b',        // 대기 (노란색)  
    error: '#ef4444',          // 오류 (빨간색)
    info: '#0ea5e9',          // 정보 (파란색)
    
    // 배경 컬러
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      gradient: 'from-blue-50 to-cyan-50',
    },
    
    // 텍스트 컬러
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8',
    },
  },
  
  // 타이포그래피
  typography: {
    fontFamily: {
      primary: 'Inter',
      fallback: 'system-ui, sans-serif',
    },
    
    fontWeights: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  
  // 간격 및 크기
  spacing: {
    component: '1rem',
    section: '2rem',
    page: '1.5rem',
  },
  
  // 애니메이션
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  
  // 컴포넌트별 스타일 변수
  components: {
    card: {
      borderRadius: '0.75rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    
    button: {
      borderRadius: '0.5rem',
      paddingX: '1.5rem',
      paddingY: '0.625rem',
    },
  },
  
} as const;
