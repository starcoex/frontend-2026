import React, { useCallback } from 'react';
import * as PortOne from '@portone/browser-sdk/v2';
import { Button } from '../ui';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useIdentityVerification } from '@starcoex-frontend/auth';

interface IdentityVerificationButtonProps {
  onVerified: (identityVerificationId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const IdentityVerificationButton: React.FC<
  IdentityVerificationButtonProps
> = ({ onVerified, onError, disabled, className }) => {
  const { step, isLoading, startVerification, completeVerification } =
    useIdentityVerification();

  const handleClick = useCallback(async () => {
    // 1단계: 백엔드 config 조회 + 서버 레코드 생성
    const result = await startVerification();
    if (!result) {
      onError?.('본인인증 요청에 실패했습니다.');
      return;
    }

    const { ivId, config } = result;

    try {
      // 2단계: PortOne 본인인증 팝업 실행
      // ✅ storeId, channelKey는 백엔드 config에서 수신 (클라이언트 환경변수 불필요)
      const response = await PortOne.requestIdentityVerification({
        storeId: config.storeId,
        identityVerificationId: ivId,
        channelKey: config.channelKey,
      });

      if (response?.code !== undefined) {
        onError?.(response.message ?? '본인인증이 취소되었습니다.');
        return;
      }

      // 3단계: 서버 검증
      const verified = await completeVerification(ivId);
      if (verified) {
        onVerified(ivId);
      } else {
        onError?.('본인인증 서버 검증에 실패했습니다.');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '본인인증 처리 중 오류';
      onError?.(msg);
    }
  }, [startVerification, completeVerification, onVerified, onError]);

  const isPending = isLoading || step === 'requesting';

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending || step === 'verified'}
      className={className}
      variant={step === 'verified' ? 'outline' : 'default'}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          인증 진행 중...
        </>
      ) : step === 'verified' ? (
        <>
          <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
          본인인증 완료
        </>
      ) : (
        <>
          <ShieldCheck className="w-4 h-4 mr-2" />
          본인 인증
        </>
      )}
    </Button>
  );
};
