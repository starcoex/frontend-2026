import type { GraphQLFormattedError } from 'graphql/error';
import { ApiResponse } from '../types/common.types';

/**
 * 공통 API 에러 코드
 * - 백엔드/프론트에서 함께 사용할 수 있는 수준으로 정의
 */
export enum ApiErrorCode {
  // 인증/권한
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN = 'FORBIDDEN',

  // 요청/리소스
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',

  // 토큰/세션
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 서버/서비스
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  SERVICE_NOT_INITIALIZED = 'SERVICE_NOT_INITIALIZED',

  // 네트워크/타임아웃
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // GraphQL
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
}

/**
 * 도메인 공통 에러 객체
 * - 런타임에서 throw 가능한 에러
 * - ApiResponse.error 와 매핑 가능
 */
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode?: number;
  public readonly details?: unknown;
  public readonly graphQLErrors?: GraphQLFormattedError[];
  public readonly timestamp: Date;
  public readonly retryable: boolean;

  constructor(
    message: string,
    code: ApiErrorCode,
    options?: {
      statusCode?: number;
      details?: unknown;
      graphQLErrors?: GraphQLFormattedError[];
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.graphQLErrors = options?.graphQLErrors;
    this.timestamp = new Date();

    this.retryable = ApiError.isRetryable(code, options?.statusCode);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * 재시도 가능 여부 판단 로직
   */
  static isRetryable(code: ApiErrorCode, statusCode?: number): boolean {
    if (
      code === ApiErrorCode.NETWORK_ERROR ||
      code === ApiErrorCode.TIMEOUT_ERROR ||
      code === ApiErrorCode.SERVICE_UNAVAILABLE
    ) {
      return true;
    }

    // 5xx 서버 에러는 재시도 가능
    return !!(statusCode && statusCode >= 500);
  }

  /**
   * ApiResponse.error 형태로 변환
   */
  toApiErrorPayload(): ApiResponse['error'] {
    return {
      message: this.message,
      code: this.code,
      details: {
        statusCode: this.statusCode,
        details: this.details,
        graphQLErrors: this.graphQLErrors,
        timestamp: this.timestamp.toISOString(),
        retryable: this.retryable,
      },
    };
  }

  /**
   * JSON 직렬화
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      graphQLErrors: this.graphQLErrors,
      timestamp: this.timestamp.toISOString(),
      retryable: this.retryable,
    };
  }

  override toString(): string {
    const status = this.statusCode ? ` (HTTP ${this.statusCode})` : '';
    return `${this.name} [${this.code}]${status}: ${this.message}`;
  }
}

/**
 * ApiError를 이용해 ApiResponse<T> 실패 응답 생성
 */
export function createErrorResponse<T = unknown>(
  error: ApiError
): ApiResponse<T> {
  return {
    success: false,
    data: undefined,
    message: error.message,
    error: error.toApiErrorPayload(),
    graphQLErrors: error.graphQLErrors,
  };
}

/**
 * HTTP Response + body 기반 에러 생성
 */
export function apiErrorFromHttp(response: Response, body?: any): ApiError {
  const statusCode = response.status;
  const backendCode: string | undefined = body?.error?.code || body?.code;

  let code: ApiErrorCode;

  switch (statusCode) {
    case 400:
      code = ApiErrorCode.BAD_REQUEST;
      break;
    case 401:
      code = ApiErrorCode.UNAUTHENTICATED;
      break;
    case 403:
      code = ApiErrorCode.FORBIDDEN;
      break;
    case 404:
      code = ApiErrorCode.NOT_FOUND;
      break;
    case 409:
      code = ApiErrorCode.CONFLICT;
      break;
    case 422:
      code = ApiErrorCode.VALIDATION_ERROR;
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      code = ApiErrorCode.INTERNAL_SERVER_ERROR;
      break;
    default:
      code = ApiErrorCode.BAD_REQUEST;
  }

  const message =
    body?.error?.message ||
    body?.message ||
    response.statusText ||
    'HTTP 요청 처리 중 오류가 발생했습니다.';

  return new ApiError(message, code, {
    statusCode,
    details: {
      backendCode,
      responseBody: body,
    },
  });
}

/**
 * 네트워크 오류에서 ApiError 생성
 */
export function apiErrorFromNetwork(error: unknown): ApiError {
  if (error instanceof Error && error.name === 'AbortError') {
    return new ApiError(
      '요청 시간이 초과되었습니다.',
      ApiErrorCode.TIMEOUT_ERROR
    );
  }

  const message =
    (error as any)?.message ??
    '네트워크 오류가 발생했습니다. 다시 시도해 주세요.';

  return new ApiError(message, ApiErrorCode.NETWORK_ERROR, {
    details: error,
  });
}

/**
 * GraphQL 에러 배열에서 ApiError 생성
 * - Apollo, fetch 등에서 가져온 GraphQLFormattedError 배열을 그대로 사용
 */
export function apiErrorFromGraphQLErrors(
  errors: GraphQLFormattedError[]
): ApiError {
  const first = errors[0];
  const gqlCode =
    (first?.extensions?.code as string | undefined) ?? 'GRAPHQL_ERROR';

  const code =
    (ApiErrorCode[gqlCode as keyof typeof ApiErrorCode] as ApiErrorCode) ??
    ApiErrorCode.GRAPHQL_ERROR;

  const message = first?.message || 'GraphQL 요청 처리 중 오류가 발생했습니다.';

  return new ApiError(message, code, {
    graphQLErrors: errors,
  });
}

/**
 * 알 수 없는 오류에서 ApiError 생성
 * - 마지막 fallback 용
 */
export function apiErrorFromUnknown(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof Error) {
    return new ApiError(error.message, ApiErrorCode.INTERNAL_SERVER_ERROR, {
      details: error,
    });
  }

  return new ApiError(
    '알 수 없는 오류가 발생했습니다.',
    ApiErrorCode.INTERNAL_SERVER_ERROR,
    { details: error }
  );
}
