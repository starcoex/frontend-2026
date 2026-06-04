// ============================================================================
// Push Subscription 타입
// (백엔드: push-subscription.controller.ts 기준)
// ============================================================================

/** POST /push/subscribe 요청 바디 */
export interface SubscribePushInput {
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  deviceId?: string;
}

/** GET /push/vapid-key 응답 */
export interface VapidPublicKeyResponse {
  publicKey: string;
}

/** POST /push/subscribe, DELETE /push/unsubscribe 공통 응답 */
export interface PushApiResponse {
  success: boolean;
}

/** 백엔드가 push 발송 시 사용하는 페이로드 구조 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}
