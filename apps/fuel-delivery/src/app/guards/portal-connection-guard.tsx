import React, { useEffect, useState, useCallback } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Truck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { portalConfig } from '@/app/config/portal.config';
import { LoadingPage } from '@starcoex-frontend/common';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PortalConnectionGuardProps {
  children: React.ReactNode;
  showSuccessMessage?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
}

export const PortalConnectionGuard: React.FC<PortalConnectionGuardProps> = ({
  children,
  showSuccessMessage = false,
  autoRetry = true,
  maxRetries = 3,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'connected' | 'disconnected' | 'error'
  >('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkPortalConnection = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      setErrorMessage('');

      // 로컬 스토리지에서 토큰 확인
      const token = localStorage.getItem(
        portalConfig.auth.storageKeys.portalToken
      );

      if (!token) {
        setConnectionStatus('disconnected');
        setErrorMessage('스타코엑스 포털 인증이 필요합니다.');
        return;
      }

      // 토큰 만료 시간 확인
      const tokenExpiry = localStorage.getItem(
        portalConfig.auth.storageKeys.tokenExpiry
      );

      if (tokenExpiry && new Date(tokenExpiry) <= new Date()) {
        localStorage.removeItem(portalConfig.auth.storageKeys.portalToken);
        localStorage.removeItem(portalConfig.auth.storageKeys.tokenExpiry);
        setConnectionStatus('disconnected');
        setErrorMessage('포털 인증이 만료되었습니다.');
        return;
      }

      // 포털 연결 상태 확인 API 호출
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch(
        `${portalConfig.api.baseUrl}${portalConfig.api.endpoints.validateToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0',
            'X-Service-Type': 'fuel-delivery',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        setConnectionStatus('connected');
        setLastChecked(new Date());
        localStorage.setItem(
          portalConfig.auth.storageKeys.connectionStatus,
          'connected'
        );

        // 토큰 갱신이 필요한 경우
        if (data.newToken) {
          localStorage.setItem(
            portalConfig.auth.storageKeys.portalToken,
            data.newToken
          );
        }
      } else if (response.status === 401) {
        // 토큰이 유효하지 않음
        localStorage.removeItem(portalConfig.auth.storageKeys.portalToken);
        localStorage.removeItem(portalConfig.auth.storageKeys.tokenExpiry);
        setConnectionStatus('disconnected');
        setErrorMessage('포털 인증이 만료되었습니다.');
      } else {
        setConnectionStatus('error');
        setErrorMessage(`서버 연결 오류: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Portal connection check failed:', error);

      if (error.name === 'AbortError') {
        setErrorMessage('연결 시간이 초과되었습니다.');
      } else if (error.code === 'NETWORK_ERROR') {
        setErrorMessage('네트워크 연결을 확인해주세요.');
      } else {
        setErrorMessage('포털 연결 확인 중 오류가 발생했습니다.');
      }

      setConnectionStatus('error');
    }
  }, []);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      checkPortalConnection();
    }
  };

  const handleGoToPortal = () => {
    const currentUrl = window.location.href;
    const portalUrl = `https://${
      portalConfig.currentPortalDomain
    }/auth/login?redirect=${encodeURIComponent(
      currentUrl
    )}&service=fuel-delivery`;
    window.location.href = portalUrl;
  };

  // 자동 재시도 로직
  useEffect(() => {
    if (autoRetry && connectionStatus === 'error' && retryCount < maxRetries) {
      const retryTimeout = setTimeout(() => {
        handleRetry();
      }, Math.pow(2, retryCount) * 1000); // 지수 백오프

      return () => clearTimeout(retryTimeout);
    }
  }, [connectionStatus, retryCount, autoRetry, maxRetries]);

  // 초기 연결 확인
  useEffect(() => {
    checkPortalConnection();
  }, [checkPortalConnection]);

  // 주기적 연결 상태 확인 (5분마다)
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(() => {
        checkPortalConnection();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [connectionStatus, checkPortalConnection]);

  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900">
        <LoadingPage message="스타코엑스 포털 연결 확인 중..." />
      </div>
    );
  }

  if (connectionStatus === 'connected' && showSuccessMessage) {
    return (
      <div className="mb-4">
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            스타코엑스 포털과 성공적으로 연결되었습니다.
            {lastChecked && (
              <Badge
                variant="outline"
                className="text-xs ml-2 border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
              >
                마지막 확인: {lastChecked.toLocaleTimeString('ko-KR')}
              </Badge>
            )}
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  if (connectionStatus === 'connected') {
    return <>{children}</>;
  }

  // 연결 실패 또는 오류 상태
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                난방유 배달
              </h1>
              <Badge
                variant="outline"
                className="text-xs border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400"
              >
                by 스타코엑스
              </Badge>
            </div>
          </div>

          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-200 dark:border-orange-800">
            {connectionStatus === 'disconnected' ? (
              <WifiOff className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2">
            {connectionStatus === 'disconnected'
              ? '포털 연결 필요'
              : '연결 오류'}
          </h2>
          <p className="text-orange-700 dark:text-orange-300 mb-2">
            {connectionStatus === 'disconnected'
              ? '스타코엑스 포털과의 연결이 필요합니다.'
              : '포털 연결 중 문제가 발생했습니다.'}
          </p>
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800">
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            {connectionStatus === 'disconnected' ? (
              <>
                <strong>난방유 배달 서비스</strong>를 이용하려면 스타코엑스 포털
                계정이 필요합니다. 포털에서 로그인하면 자동으로 모든 서비스 앱이
                연결됩니다.
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span>⛽</span>
                    <span>주유소 서비스 연동</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚗</span>
                    <span>세차 예약 서비스 연동</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚛</span>
                    <span>난방유 배달 서비스</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                일시적인 네트워크 문제이거나 서버 점검 중일 수 있습니다. 잠시 후
                다시 시도해주시거나 포털에서 다시 로그인해주세요.
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button
            onClick={handleGoToPortal}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
            size="lg"
          >
            <ExternalLink className="mr-2 w-5 h-5" />
            스타코엑스 포털에서 로그인하기
          </Button>

          <Button
            onClick={handleRetry}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/30"
            size="lg"
            disabled={retryCount >= maxRetries}
          >
            <RefreshCw
              className={`mr-2 w-4 h-4 ${
                retryCount >= maxRetries ? '' : 'animate-spin'
              }`}
            />
            {retryCount >= maxRetries
              ? '최대 재시도 횟수 초과'
              : '연결 상태 다시 확인'}
          </Button>
        </div>

        {/* 하단 정보 */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            포털에서 로그인하면 모든 스타코엑스 서비스를 자동으로 이용할 수
            있습니다
          </p>
          {retryCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400"
            >
              재시도 횟수: {retryCount}/{maxRetries}
            </Badge>
          )}

          {/* 고객지원 */}
          <div className="pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
            <button
              onClick={() => window.open('tel:1588-9999')}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors"
            >
              📞 도움이 필요하시면 1588-9999로 연락주세요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
