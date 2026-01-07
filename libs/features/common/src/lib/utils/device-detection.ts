/**
 * 디바이스 감지 관련 유틸리티 함수들
 */

/**
 * 현재 디바이스가 모바일인지 확인
 * @returns 모바일 디바이스 여부
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 현재 디바이스가 태블릿인지 확인
 * @returns 태블릿 디바이스 여부
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return /iPad|Android(?=.*Tablet)|(?=.*\bAndroid\b)(?=.*\b(?:Android|Tablet)\b)/i.test(
    navigator.userAgent
  );
};

/**
 * 현재 디바이스가 데스크톱인지 확인
 * @returns 데스크톱 디바이스 여부
 */
export const isDesktopDevice = (): boolean => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * 현재 디바이스가 iOS인지 확인
 * @returns iOS 디바이스 여부
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * 현재 디바이스가 Android인지 확인
 * @returns Android 디바이스 여부
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return /Android/i.test(navigator.userAgent);
};

/**
 * 터치 지원 디바이스인지 확인
 * @returns 터치 지원 여부
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * 전화 기능 지원 디바이스인지 확인
 * @returns 전화 기능 지원 여부
 */
export const supportsTelephone = (): boolean => {
  return isMobileDevice() && !isTabletDevice();
};

/**
 * 디바이스 타입을 문자열로 반환
 * @returns 디바이스 타입 ('mobile' | 'tablet' | 'desktop')
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

/**
 * 현재 디바이스의 플랫폼을 반환
 * @returns 플랫폼 타입 ('ios' | 'android' | 'desktop')
 */
export const getPlatform = (): 'ios' | 'android' | 'desktop' => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'desktop';
};

/**
 * 뷰포트 크기 기반 모바일 감지 (CSS 미디어쿼리와 일치)
 * @param breakpoint 모바일 기준 너비 (기본값: 768px)
 * @returns 모바일 뷰포트 여부
 */
export const isMobileViewport = (breakpoint = 768): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth < breakpoint;
};
