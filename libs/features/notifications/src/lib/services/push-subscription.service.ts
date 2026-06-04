import type {
  SubscribePushInput,
  VapidPublicKeyResponse,
  PushApiResponse,
} from '../types';

/**
 * 백엔드 push-subscription.controller.ts REST API 클라이언트
 *
 * GET    /push/vapid-key     → VAPID 공개키 조회
 * POST   /push/subscribe     → 구독 등록
 * DELETE /push/unsubscribe   → 구독 해제
 */
export class PushSubscriptionService {
  private readonly baseUrl: string;

  constructor(baseUrl = '/api/push') {
    this.baseUrl = baseUrl;
  }

  // ============================================================================
  // VAPID 공개키 조회
  // ============================================================================

  /** GET /push/vapid-key */
  async getVapidPublicKey(): Promise<string> {
    const res = await fetch(`${this.baseUrl}/vapid-key`);

    if (!res.ok) {
      throw new Error(`VAPID 키 조회 실패: ${res.status}`);
    }

    const data: VapidPublicKeyResponse = await res.json();
    return data.publicKey;
  }

  // ============================================================================
  // 구독 등록
  // ============================================================================

  /** POST /push/subscribe */
  async subscribe(input: SubscribePushInput): Promise<PushApiResponse> {
    const res = await fetch(`${this.baseUrl}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`Push 구독 등록 실패: ${res.status}`);
    }

    return res.json();
  }

  // ============================================================================
  // 구독 해제
  // ============================================================================

  /** DELETE /push/unsubscribe */
  async unsubscribe(endpoint: string): Promise<PushApiResponse> {
    const res = await fetch(`${this.baseUrl}/unsubscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    });

    if (!res.ok) {
      throw new Error(`Push 구독 해제 실패: ${res.status}`);
    }

    return res.json();
  }
}

// ============================================================================
// 싱글톤 인스턴스 (service registry 패턴 유지)
// ============================================================================

let _instance: PushSubscriptionService | null = null;

export function getPushSubscriptionService(): PushSubscriptionService {
  if (!_instance) {
    _instance = new PushSubscriptionService('/api/push');
  }
  return _instance;
}

export function initPushSubscriptionService(
  baseUrl?: string
): PushSubscriptionService {
  _instance = new PushSubscriptionService(baseUrl);
  return _instance;
}
