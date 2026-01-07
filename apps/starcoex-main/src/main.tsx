import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { initializeApolloClient } from '@starcoex-frontend/graphql';
import { initAuthService } from '@starcoex-frontend/auth';
import { AuthProvider } from '@starcoex-frontend/auth';
import { ApolloProvider } from '@apollo/client/react';
import { HelmetProvider } from '@starcoex-frontend/common';

// 1) Apollo Client 초기화
const apolloClient = initializeApolloClient({
  appName: 'starcoex-main',
  appVersion: '1.0.0',
  enableDevtools: import.meta.env.DEV,
  authConfig: {
    onAuthError: () => {
      // 토큰 갱신 실패 등 최종 인증 에러 시 처리 (예: 로그인 페이지로 이동)
      console.warn('[Auth] 최종 인증 에러 발생, 로그아웃 처리 필요');
    },
    onTokenRefreshed: () => {
      console.log('[Auth] 토큰이 갱신되었습니다');
    },
  },
});

// 2) AuthService 초기화 (ApolloClient 주입)

initAuthService(apolloClient as any);

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
