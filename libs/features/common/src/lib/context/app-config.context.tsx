import React, { createContext, useContext, ReactNode } from 'react';

export interface AppConfigContextType {
  // 기본 앱 정보
  appName: string;
  siteName: string;

  // SEO
  getSeoTitle: (pageTitle: string) => string;

  // 경로
  routes: {
    home: string;
    login: string;
    register: string;
    registerPersonal: string;
    dashboard: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
    verifyPhone: string;
    verifySocial: string;
    verifySocialCode: string;
    terms: string;
    privacy: string;
  };

  // 커스텀 래퍼 (배경, 애니메이션 등)
  PageWrapper?: React.ComponentType<{ children: ReactNode }>;

  // 스타일 오버라이드
  styles?: {
    card?: string;
    input?: string;
    button?: string;
    primaryButton?: string;
  };
}

const defaultConfig: AppConfigContextType = {
  appName: '스타코엑스',
  siteName: '스타코엑스',
  getSeoTitle: (pageTitle) => `${pageTitle} - 스타코엑스`,
  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    registerPersonal: '/auth/register/personal',
    dashboard: '/dashboard',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    verifyPhone: '/auth/verify-phone',
    verifySocial: '/auth/verify-social',
    verifySocialCode: '/auth/verify-social-code',
    terms: '/terms',
    privacy: '/privacy',
  },
};

const AppConfigContext = createContext<AppConfigContextType>(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

export interface AppConfigProviderProps {
  config: Partial<AppConfigContextType>;
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({
  config,
  children,
}) => {
  const mergedConfig: AppConfigContextType = {
    ...defaultConfig,
    ...config,
    routes: { ...defaultConfig.routes, ...config.routes },
    styles: { ...defaultConfig.styles, ...config.styles },
  };

  return (
    <AppConfigContext.Provider value={mergedConfig}>
      {children}
    </AppConfigContext.Provider>
  );
};
