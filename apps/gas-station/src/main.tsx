import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { initializeApolloClient } from '@starcoex-frontend/graphql';
import { initAuthService } from '@starcoex-frontend/auth';
import { AuthProvider } from '@starcoex-frontend/auth';
import { ApolloProvider } from '@apollo/client/react';
import { HelmetProvider } from '@starcoex-frontend/common';
import { registerSW } from 'virtual:pwa-register';

// 1) Apollo Client 초기화
const apolloClient = initializeApolloClient({
  appName: 'gas-station',
  appVersion: '1.0.0',
  enableDevtools: import.meta.env.DEV,
  authConfig: {
    onAuthError: () => {
      // 토큰 갱신 실패 등 최종 인증 에러 시 처리 (예: 로그인 페이지로 이동)
      console.warn('[Gas-Station] 최종 인증 에러 발생, 로그아웃 처리 필요');
    },
    onTokenRefreshed: () => {
      console.log('[Gas-Station] 토큰이 갱신되었습니다');
    },
  },
});

// AuthService를 FuelService와 동일한 패턴으로 초기화
initAuthService(apolloClient as any);

// 3) PWA Service Worker 등록
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.info('[PWA] 오프라인 사용 준비 완료');
  },
  onRegisterError(error) {
    console.error('[SW] 등록 실패:', error);
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ApolloProvider client={apolloClient as any}>
    <StrictMode>
      <AuthProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </AuthProvider>
    </StrictMode>
  </ApolloProvider>
);
