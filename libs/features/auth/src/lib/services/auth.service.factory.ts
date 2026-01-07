import type { ApolloClient } from '@apollo/client';
import { AuthService } from './auth.service';
import { serviceRegistry } from './service-registry';

// AuthService 인스턴스를 직접 생성하고 싶을 때 사용
export const createAuthService = (client: ApolloClient): AuthService =>
  new AuthService(client);

// 모듈 로드 시 한 번만 factory 등록
serviceRegistry.registerService<AuthService>('auth', (ctx: ApolloClient) => {
  return new AuthService(ctx);
});

/**
 * AuthService 초기화
 * - ApolloClient를 주입해서 전역 레지스트리에 인스턴스를 생성
 */
export const initAuthService = (client: ApolloClient): AuthService => {
  return serviceRegistry.initializeService<AuthService>('auth', client);
};

/**
 * 이미 초기화된 AuthService 가져오기
 * - 초기화되지 않았으면 에러
 */
export const getAuthService = (): AuthService => {
  return serviceRegistry.getService<AuthService>('auth');
};
