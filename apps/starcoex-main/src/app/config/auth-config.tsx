import React, { ReactNode } from 'react';
import { AppConfigContextType } from '@starcoex-frontend/common';
import { APP_CONFIG } from './app.config';

// 기본 페이지 래퍼 (심플 - 래핑 없음)
const MainPageWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const mainAuthConfig: Partial<AppConfigContextType> = {
  appName: APP_CONFIG.app.name,
  siteName: APP_CONFIG.seo.siteName,
  getSeoTitle: (pageTitle) => `${pageTitle} - ${APP_CONFIG.seo.siteName}`,
  routes: APP_CONFIG.routes,
  PageWrapper: MainPageWrapper,
  // styles는 기본값 사용 (오버라이드 없음)
};
