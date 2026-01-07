import {
  SocialProvider,
  SocialProviderConfig,
  AppType,
} from '@starcoex-platform/api-client';

/**
 * 소셜 제공자별 설정
 */
export const SOCIAL_PROVIDER_CONFIGS: Record<
  SocialProvider,
  SocialProviderConfig
> = {
  KAKAO: {
    provider: 'KAKAO',
    name: 'kakao',
    displayName: '카카오',
    icon: '💛',
    // CSS 변수 기반으로 변경
    buttonClass:
      'bg-[hsl(var(--kakao))] hover:bg-[hsl(var(--kakao-hover))] text-[hsl(var(--kakao-foreground))] border-[hsl(var(--kakao))] transition-all duration-200 hover:scale-105 hover:shadow-lg',
    enabled: true,
    scope: ['profile_nickname', 'profile_image', 'account_email'],
  },

  NAVER: {
    provider: 'NAVER',
    name: 'naver',
    displayName: '네이버',
    icon: '🟢',
    buttonClass:
      'bg-[hsl(var(--naver))] hover:bg-[hsl(var(--naver-hover))] text-[hsl(var(--naver-foreground))] border-[hsl(var(--naver))] transition-all duration-200 hover:scale-105 hover:shadow-lg',
    enabled: true,
    scope: ['name', 'email', 'profile_image'],
  },

  GOOGLE: {
    provider: 'GOOGLE',
    name: 'google',
    displayName: '구글',
    icon: '🔴',
    buttonClass:
      'bg-background hover:bg-muted text-foreground border-border hover:shadow-md transition-all duration-200',
    enabled: false,
    scope: ['profile', 'email'],
  },

  APPLE: {
    provider: 'APPLE',
    name: 'apple',
    displayName: '애플',
    icon: '⚫',
    buttonClass:
      'bg-foreground hover:bg-foreground/90 text-background border-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg',
    enabled: false,
    scope: ['name', 'email'],
  },

  FACEBOOK: {
    provider: 'FACEBOOK',
    name: 'facebook',
    displayName: '페이스북',
    icon: '🔵',
    buttonClass:
      'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg',
    enabled: false,
    scope: ['public_profile', 'email'],
  },
};

/**
 * 모든 소셜 제공자 목록 (상수로 정의)
 */
const ALL_SOCIAL_PROVIDERS: SocialProvider[] = [
  'KAKAO',
  'NAVER',
  'GOOGLE',
  'APPLE',
  'FACEBOOK',
];

/**
 * 앱별로 사용 가능한 소셜 제공자 목록
 */
export const APP_SOCIAL_PROVIDERS: Record<AppType, SocialProvider[]> = {
  'starcoex-main': ['KAKAO', 'NAVER'],
  'gas-station': ['KAKAO', 'NAVER'],
  'car-wash': ['KAKAO', 'NAVER'],
  'fuel-delivery': ['KAKAO', 'NAVER'],
  'admin-dashboard': [], // 소셜 로그인 비활성화
};

/**
 * 소셜 제공자 설정 가져오기
 */
export function getSocialProviderConfig(
  provider: SocialProvider
): SocialProviderConfig {
  return SOCIAL_PROVIDER_CONFIGS[provider];
}

/**
 * 활성화된 소셜 제공자 목록 가져오기
 */
export function getEnabledSocialProviders(): SocialProvider[] {
  return ALL_SOCIAL_PROVIDERS.filter(
    (provider) => SOCIAL_PROVIDER_CONFIGS[provider].enabled
  );
}

/**
 * 앱별 사용 가능한 소셜 제공자 목록 가져오기
 */
export function getAppSocialProviders(appType: AppType): SocialProvider[] {
  return APP_SOCIAL_PROVIDERS[appType] || [];
}

/**
 * 앱별 활성화된 소셜 제공자 목록 가져오기
 */
export function getAppEnabledSocialProviders(
  appType: AppType
): SocialProviderConfig[] {
  const appProviders = getAppSocialProviders(appType);
  return appProviders
    .filter((provider) => SOCIAL_PROVIDER_CONFIGS[provider].enabled)
    .map((provider) => SOCIAL_PROVIDER_CONFIGS[provider]);
}

/**
 * 소셜 제공자가 특정 앱에서 사용 가능한지 확인
 */
export function isSocialProviderEnabledForApp(
  provider: SocialProvider,
  appType: AppType
): boolean {
  const appProviders = getAppSocialProviders(appType);
  return (
    appProviders.includes(provider) && SOCIAL_PROVIDER_CONFIGS[provider].enabled
  );
}
