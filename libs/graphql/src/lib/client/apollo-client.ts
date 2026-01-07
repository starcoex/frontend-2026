import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  Observable,
  split,
  gql,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { REFRESH_TOKEN } from '../gql/auth.queries.js';
// REFRESH_TOKEN 은 auth.queries.ts (또는 codegen 결과)에서 import

// ============================================================================
// 📝 Types & Config
// ============================================================================

export interface ApolloClientConfig {
  appName?: string;
  appVersion?: string;
  enableDevtools?: boolean;
  authConfig?: {
    onAuthError?: () => void; // 최종 인증 실패 (로그아웃/리다이렉트)
    onTokenRefreshed?: (result?: any) => void; // 토큰 갱신 성공 콜백
  };
}

// 백엔드 GraphQL 에러 code 기준
const AUTH_ERROR_CODES = [
  'UNAUTHENTICATED',
  'UNAUTHORIZED',
  'TOKEN_EXPIRED',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_TOKEN_INVALID',
] as const;

// Auth 서버로 보낼 operationName 목록(스키마에 맞게 조정)
const AUTH_OPERATIONS = [
  'LoginStep1',
  'LoginStep2',
  'RefreshToken',
  'Logout',
  'LogoutAll',
] as const;

const isAuthOperation = (operationName?: string): boolean =>
  AUTH_OPERATIONS.includes(operationName as (typeof AUTH_OPERATIONS)[number]);

// ============================================================================
// 🌐 Endpoint Helpers
// ============================================================================

const getGraphQLUri = (isDev: boolean): string =>
  isDev ? '/graphql' : 'http://localhost:4000/graphql';

const getAuthGraphQLUri = (isDev: boolean): string =>
  isDev ? '/auth/graphql' : 'http://localhost:4102/graphql';

// ============================================================================
// 💾 Cache
// ============================================================================

const createCache = (): InMemoryCache =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getLoggedInUser: { merge: false },
        },
      },
    },
  });

// ============================================================================
// 🔗 Links
// ============================================================================

/**
 * Auth 서버 vs Gateway 서버로 라우팅하는 Link
 */
const createDirectionalLink = (isDev: boolean): ApolloLink => {
  const authLink = createHttpLink({
    uri: getAuthGraphQLUri(isDev),
    credentials: 'include', // 쿠키 기반 인증
  });

  const gatewayLink = createHttpLink({
    uri: getGraphQLUri(isDev),
    credentials: 'include',
  });

  return split(
    (operation) => isAuthOperation(operation.operationName),
    authLink,
    gatewayLink
  );
};

/**
 * 공통 헤더 설정 (app name, version 등)
 */
const createAuthContextLink = (config: ApolloClientConfig): ApolloLink =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      'x-app-name': config.appName || 'app',
      'x-client-version': config.appVersion || '1.0.0',
    },
  }));

/**
 * 에러 로깅 Link
 */
const createErrorLoggingLink = (): ApolloLink =>
  onError(({ forward, error, operation, result }) => {
    // GraphQL 에러 (result.errors)
    const graphQLErrors = result?.errors;

    if (graphQLErrors && graphQLErrors.length > 0) {
      graphQLErrors.forEach((err) => {
        // getLoggedInUser 실패는 조용히 처리하고 싶으면 필터링
        if (operation.operationName === 'GetLoggedInUser') return;
        console.error('[GraphQL Error]', {
          operation: operation.operationName,
          message: err.message,
          code: (err as any).extensions?.code,
        });
      });
    }

    // 네트워크/Link 에러 (error)
    if (error) {
      console.error('[Network/Link Error]', {
        operation: operation.operationName,
        message: error.message,
      });
    }

    // 이 Link는 로깅만 하고 흐름은 그대로 다음 Link로 넘김
    return forward(operation);
  });

/**
 * 네트워크 재시도 Link (옵션)
 */
const createRetryLink = (): RetryLink =>
  new RetryLink({
    delay: { initial: 300, max: 3000, jitter: true },
    attempts: {
      max: 2,
      retryIf: (error) => {
        const isNetworkError =
          (error as any).response && !(error as any).graphQLErrors;

        return isNetworkError || error.message.includes('fetch failed');
      },
    },
  });

/**
 * 🔄 토큰 갱신 Link
 * - accessToken 만료시 RefreshToken mutation 호출
 * - 동시에 여러 요청이 터질 때 refresh는 딱 1번만
 */
const createTokenRefreshLink = (
  config: ApolloClientConfig,
  client: ApolloClient
): ApolloLink => {
  let isRefreshing = false;
  let pendingRequests: Array<() => void> = [];

  const addPendingRequest = (cb: () => void) => {
    pendingRequests.push(cb);
  };

  const resolvePendingRequests = () => {
    pendingRequests.forEach((cb) => cb());
    pendingRequests = [];
  };

  return onError(({ error, result, operation, forward }) => {
    const operationName = operation.operationName;
    const graphQLErrors = result?.errors;

    if (!graphQLErrors || graphQLErrors.length === 0) {
      return;
    }

    // RefreshToken 자체에서의 에러는 재시도하지 않고 바로 AuthError 처리
    if (operationName === 'RefreshToken') {
      config.authConfig?.onAuthError?.();
      return;
    }

    const authError = graphQLErrors.find((err) =>
      AUTH_ERROR_CODES.includes(err.extensions?.code as any)
    );

    if (!authError) {
      return; // 인증 관련 에러가 아니면 토큰 갱신 안 함
    }

    // 이미 갱신 중이면, 새 요청은 큐에 넣었다가 갱신 후 재시도
    if (isRefreshing) {
      return new Observable((observer) => {
        addPendingRequest(() => {
          forward(operation).subscribe(observer);
        });
      });
    }

    // 여기부터 실제 refresh 흐름
    isRefreshing = true;

    return new Observable((observer) => {
      client
        .mutate({
          mutation: REFRESH_TOKEN,
          fetchPolicy: 'network-only',
        })
        .then((result) => {
          const refreshData = (result.data as any)?.refreshToken;

          // 스키마에 따라 success/ok 필드 이름이 다를 수 있음 → 환경에 맞게 조정
          const ok = refreshData?.success ?? refreshData?.ok ?? false;

          if (!ok) {
            throw new Error(
              refreshData?.error?.message || '토큰 갱신에 실패했습니다.'
            );
          }

          // ✅ 토큰 갱신 성공
          // - 서버에서 쿠키/헤더 갱신했다고 가정
          // - 다른 레이어(서비스/컨텍스트/다른 탭)에게 알림
          window.dispatchEvent(
            new CustomEvent('auth:token-refreshed', {
              detail: { timestamp: new Date().toISOString() },
            })
          );
          config.authConfig?.onTokenRefreshed?.(refreshData);

          // 대기 중인 요청들 재시도
          resolvePendingRequests();

          // 현재 요청 재시도
          forward(operation).subscribe(observer);
        })
        .catch((error) => {
          console.error('[Auth] Token refresh failed:', error);
          pendingRequests = [];
          config.authConfig?.onAuthError?.();
          observer.error(error);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  });
};

// ============================================================================
// 🚀 Apollo Client Factory
// ============================================================================

export const createApolloClient = (
  config: ApolloClientConfig = {}
): ApolloClient => {
  const isDev = process.env.NODE_ENV === 'development';

  // refresh link에서 사용할 임시 client (HTTP 라우팅만 필요)
  const tempClient = new ApolloClient({
    cache: createCache(),
    link: createDirectionalLink(isDev),
  });

  const link = from([
    createErrorLoggingLink(),
    createTokenRefreshLink(config, tempClient),
    createRetryLink(),
    createAuthContextLink(config),
    createDirectionalLink(isDev),
  ]);

  return new ApolloClient({
    link,
    cache: createCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
      },
      mutate: {
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network', // ⚠️ 이 부분이 문제!
        nextFetchPolicy: 'cache-first', // ✅ 첫 실행 후엔 캐시 우선으로 변경
      },
    },
    devtools: {
      enabled: config.enableDevtools ?? isDev,
      name: config.appName || 'app',
    },
  });
};

// ============================================================================
// 🌐 Global Client 관리
// ============================================================================

let globalClient: ApolloClient | null = null;

export const initializeApolloClient = (
  config: ApolloClientConfig = {}
): ApolloClient => {
  if (!globalClient) {
    globalClient = createApolloClient(config);
    console.log(`✅ Apollo Client initialized: ${config.appName || 'app'}`);
  }
  return globalClient;
};

export const getApolloClient = (): ApolloClient => {
  if (!globalClient) {
    throw new Error('Apollo Client가 초기화되지 않았습니다.');
  }
  return globalClient;
};

export const resetApolloClient = (): void => {
  globalClient?.stop();
  globalClient = null;
};

// ============================================================================
// 🧹 Cache Utilities
// ============================================================================

export const apolloUtils = {
  clearAuthCache: (): void => {
    const client = getApolloClient();
    client.cache.evict({ fieldName: 'getLoggedInUser' });
    client.cache.gc();
  },
  resetCache: async (): Promise<void> => {
    const client = getApolloClient();
    await client.resetStore();
  },
};

// 사용 편의를 위해 gql 재export
export { gql };
