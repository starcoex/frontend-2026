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
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

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

// ============================================================================
// 🌐 Endpoint Helpers
// ============================================================================

// const PROD_GRAPHQL_URL = 'https://api.starcoex.com/graphql';
// const PROD_WS_URL = 'wss://api.starcoex.com/graphql';

/**
 * 개발/프로덕션 모두 상대경로(/graphql) 사용 → same-origin
 * - 개발: Vite 프록시(/graphql) → api.starcoex.com
 * - 프로덕션: Ingress(/graphql) → starcoex-gateway-service
 * → CORS 불필요, refreshToken 쿠키가 first-party로 정상 전송 (iOS ITP 회피)
 */
const getGraphQLUri = (isDev: boolean): string => '/graphql';

/**
 * WebSocket도 현재 호스트 기준 상대 경로로 구성
 * - http → ws, https → wss 자동 매핑
 */
const getWsUri = (isDev: boolean): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/graphql`;
};

// ============================================================================
// 💾 Cache
// ============================================================================

const createCache = (): InMemoryCache =>
  new InMemoryCache({
    dataIdFromObject(responseObject) {
      if (responseObject.id) {
        return `${responseObject.__typename}:${responseObject.id}`;
      }
      return false;
    },
    typePolicies: {
      Query: {
        fields: {
          getLoggedInUser: { merge: false },
          findCategoryTree: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          listCategories: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Order: {
        fields: {
          OrderStatusHistory: { merge: false },
          items: { merge: false },
        },
      },
      Delivery: {
        fields: {
          statusHistory: { merge: false },
          ratings: { merge: false },
        },
      },
      DeliveryDriver: {
        fields: {
          deliveries: { merge: false },
          settlements: { merge: false },
          ratings: { merge: false },
        },
      },
    },
  });

// ============================================================================
// 🔗 Links
// ============================================================================

const createDirectionalLink = (isDev: boolean): ApolloLink => {
  // HTTP Link (Query / Mutation)
  const httpLink = createHttpLink({
    uri: getGraphQLUri(isDev),
    credentials: 'include',
  });

  // WebSocket Link (Subscription)
  const wsLink = new GraphQLWsLink(
    createClient({
      url: getWsUri(isDev),
      connectionParams: () => ({}),
      shouldRetry: () => true,
      retryAttempts: 5,
      retryWait: (retries) =>
        new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * 2 ** retries, 10000))
        ),
      on: {
        connected: () => console.info('[WS] WebSocket 연결됨'),
        closed: () => console.info('[WS] WebSocket 연결 해제'),
        error: (err) => console.error('[WS] WebSocket 오류:', err),
      },
    })
  );

  // Subscription → WsLink, 나머지 → HttpLink
  return split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' && def.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
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
      retryIf: (error: any) => {
        // GraphQL 에러(서버가 정상 처리한 비즈니스 에러)는 재시도하지 않음
        if (error?.result?.errors?.length > 0) return false;

        // 실제 네트워크/서버 에러만 재시도
        const message: string = error?.message ?? '';
        const statusCode: number = error?.statusCode ?? 0;

        return (
          message.includes('fetch failed') ||
          message.includes('Failed to fetch') ||
          message.includes('NetworkError') ||
          statusCode >= 500
        );
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

    // ✅ 인증 체크 쿼리 / Refresh 자체는 토큰 갱신 시도하지 않음
    // → onAuthError 호출도 하지 않음 (로그아웃 방지)
    if (
      operationName === 'RefreshToken' ||
      operationName === 'GetLoggedInUser' ||
      operationName === 'CheckAuthStatus'
    ) {
      return; // ✅ 그냥 반환 — onAuthError 호출 X
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
      // ✅ tempClient 대신 주입받은 client 직접 사용
      client
        .mutate({
          mutation: REFRESH_TOKEN,
          fetchPolicy: 'network-only',
        })
        .then((result) => {
          const refreshData = (result.data as any)?.refreshToken;
          const ok = refreshData?.success ?? refreshData?.ok ?? false;

          if (!ok) {
            throw new Error(
              refreshData?.error?.message || '토큰 갱신에 실패했습니다.'
            );
          }

          window.dispatchEvent(
            new CustomEvent('auth:token-refreshed', {
              detail: { timestamp: new Date().toISOString() },
            })
          );
          config.authConfig?.onTokenRefreshed?.(refreshData);
          resolvePendingRequests();
          forward(operation).subscribe(observer);
        })
        .catch((error) => {
          console.error('[Auth] Token refresh failed:', error);
          pendingRequests = [];
          config.authConfig?.onAuthError?.(); // ✅ refresh 실패 시에만 로그아웃
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

  // ✅ tempClient 제거 — 순환 참조 없이 메인 client를 직접 사용
  const cache = createCache();
  const directionalLink = createDirectionalLink(isDev);

  // ✅ refresh 전용 httpLink — credentials 명시, 링크 체인 없이 순수 HTTP만
  const refreshHttpLink = createHttpLink({
    uri: getGraphQLUri(isDev),
    credentials: 'include', // ← 쿠키 반드시 포함
  });

  const refreshClient = new ApolloClient({
    cache: new InMemoryCache(), // ← 메인 cache와 분리 (캐시 오염 방지)
    link: refreshHttpLink,
    defaultOptions: {
      mutate: {
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      },
    },
  });

  const link = from([
    createErrorLoggingLink(),
    createTokenRefreshLink(config, refreshClient), // ← refresh 전용 client 사용
    createRetryLink(),
    createAuthContextLink(config),
    directionalLink,
  ]);

  return new ApolloClient({
    link,
    cache, // ✅ 동일 cache 인스턴스 공유
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
        errorPolicy: 'all', // ✅ 에러를 컴포넌트에 전달
        fetchPolicy: 'network-only', // ✅ 캐시를 무시하고 항상 네트워크 요청
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
