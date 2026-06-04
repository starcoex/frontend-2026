import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import type { RegisterWithIdentityVerificationInput } from '@starcoex-frontend/graphql';

export type IdentityVerificationStep =
  | 'idle'
  | 'requesting' // 서버 레코드 생성 중
  | 'pending' // PortOne 팝업 진행 중 (컴포넌트가 관리)
  | 'verified' // 서버 검증 완료
  | 'failed'; // 실패

export interface PortOneConfig {
  storeId: string;
  channelKey: string;
}

export interface UseIdentityVerificationReturn {
  step: IdentityVerificationStep;
  identityVerificationId: string | null;
  isLoading: boolean;
  error: string | null;
  /**
   * 1단계: 백엔드 config 조회 + 서버 레코드 생성
   * 컴포넌트에서 PortOne SDK 호출에 필요한 { ivId, config } 반환
   */
  startVerification(): Promise<{ ivId: string; config: PortOneConfig } | null>;
  /**
   * 2단계: PortOne 팝업 완료 후 서버 검증
   */
  completeVerification(identityVerificationId: string): Promise<boolean>;
  /**
   * 3단계-A: 본인인증 완료 후 회원가입
   */
  registerWithVerification(
    input: Omit<RegisterWithIdentityVerificationInput, 'identityVerificationId'>
  ): Promise<boolean>;
  /**
   * 3단계-B: 본인인증 완료 후 로그인
   */
  loginWithVerification(): Promise<boolean>;
  reset(): void;
}

export const useIdentityVerification = (): UseIdentityVerificationReturn => {
  const {
    getIdentityVerificationConfig,
    requestIdentityVerification,
    verifyIdentityVerification,
    registerWithIdentityVerification,
    loginWithIdentityVerification,
  } = useAuth();

  const [step, setStep] = useState<IdentityVerificationStep>('idle');
  const [identityVerificationId, setIdentityVerificationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 백엔드 config 캐싱 (매번 재요청 방지)
  const configRef = useRef<PortOneConfig | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setIdentityVerificationId(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const startVerification = useCallback(async (): Promise<{
    ivId: string;
    config: PortOneConfig;
  } | null> => {
    setIsLoading(true);
    setError(null);
    setStep('requesting');

    try {
      // ✅ 백엔드에서 storeId, channelKey 수신
      if (!configRef.current) {
        const configRes = await getIdentityVerificationConfig();
        if (!configRes.success || !configRes.data) {
          throw new Error('본인인증 설정을 불러올 수 없습니다.');
        }
        configRef.current = JSON.parse(
          configRes.data.getIdentityVerificationConfig
        ) as PortOneConfig;
      }

      const { storeId, channelKey } = configRef.current;
      const ivId = `iv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // ✅ 서버에 본인인증 레코드 생성
      const reqRes = await requestIdentityVerification({
        storeId,
        channelKey,
        identityVerificationId: ivId,
      });

      if (!reqRes.success) {
        throw new Error(
          reqRes.error?.message ?? '본인인증 요청에 실패했습니다.'
        );
      }

      // ✅ PortOne 팝업은 컴포넌트가 담당하므로 pending으로 전환 후 반환
      setStep('pending');
      return { ivId, config: configRef.current };
    } catch (e) {
      const msg = e instanceof Error ? e.message : '본인인증 요청 오류';
      setError(msg);
      setStep('failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getIdentityVerificationConfig, requestIdentityVerification]);

  const completeVerification = useCallback(
    async (ivId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await verifyIdentityVerification({
          identityVerificationId: ivId,
        });

        if (!res.success) {
          throw new Error(
            res.error?.message ?? '본인인증 검증에 실패했습니다.'
          );
        }

        setIdentityVerificationId(ivId);
        setStep('verified');
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : '본인인증 검증 오류';
        setError(msg);
        setStep('failed');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [verifyIdentityVerification]
  );

  const registerWithVerification = useCallback(
    async (
      input: Omit<
        RegisterWithIdentityVerificationInput,
        'identityVerificationId'
      >
    ): Promise<boolean> => {
      if (!identityVerificationId) {
        setError('본인인증을 먼저 완료해주세요.');
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await registerWithIdentityVerification({
          ...input,
          identityVerificationId,
        });
        if (!res.success) {
          throw new Error(res.error?.message ?? '회원가입에 실패했습니다.');
        }
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : '회원가입 오류');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [identityVerificationId, registerWithIdentityVerification]
  );

  const loginWithVerification = useCallback(async (): Promise<boolean> => {
    if (!identityVerificationId) {
      setError('본인인증을 먼저 완료해주세요.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginWithIdentityVerification(identityVerificationId);
      if (!res.success) {
        throw new Error(res.error?.message ?? '로그인에 실패했습니다.');
      }
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인 오류');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [identityVerificationId, loginWithIdentityVerification]);

  return {
    step,
    identityVerificationId,
    isLoading,
    error,
    startVerification,
    completeVerification,
    registerWithVerification,
    loginWithVerification,
    reset,
  };
};
