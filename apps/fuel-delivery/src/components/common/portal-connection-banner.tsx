import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, X, Wifi } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const PortalConnectionBanner: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'connected' | 'disconnected' | 'hidden'
  >('checking');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setConnectionStatus('hidden');
      return;
    }

    // 배너 닫힘 상태 확인
    const dismissed = localStorage.getItem('portal_banner_dismissed');
    if (dismissed === 'true') {
      setBannerDismissed(true);
    }

    // 포털 연결 상태 확인
    const checkConnection = () => {
      const portalToken = localStorage.getItem('starcoex_portal_token');
      const connectionFlag = localStorage.getItem('starcoex_portal_connected');

      if (portalToken && connectionFlag === 'true') {
        setConnectionStatus('connected');
      } else if (currentUser && !portalToken) {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('hidden');
      }
    };

    checkConnection();

    // 주기적 상태 확인 (30초마다)
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, currentUser]);

  const handleGoToPortal = () => {
    const currentUrl = window.location.href;
    const portalUrl = `https://${
      process.env.REACT_APP_PORTAL_DOMAIN || 'portal.starcoex.com'
    }/auth/login?redirect=${encodeURIComponent(
      currentUrl
    )}&service=fuel-delivery`;
    window.location.href = portalUrl;
  };

  const handleDismiss = () => {
    setBannerDismissed(true);
    localStorage.setItem('portal_banner_dismissed', 'true');
  };

  // 배너를 표시하지 않는 경우
  if (
    connectionStatus === 'hidden' ||
    connectionStatus === 'checking' ||
    bannerDismissed
  ) {
    return null;
  }

  // 연결됨 상태 (성공 배너)
  if (connectionStatus === 'connected') {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <Wifi className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  🎉 {currentUser?.name || '사용자'}님, 스타코엑스 통합 서비스가
                  연결되었습니다!
                </div>
                <div className="text-xs text-green-100 flex items-center gap-3">
                  <span>⛽ 주유소</span>
                  <span>🚗 세차</span>
                  <span>🚛 난방유 배달</span>
                  <span>- 모든 서비스 자동 로그인 완료</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white text-xs">
                통합 연결 완료
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/10 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 연결 안됨 상태 (안내 배너)
  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">
                💡 더 많은 혜택을 받으세요!
              </div>
              <div className="text-xs text-orange-100">
                스타코엑스 포털과 연결하면 주유소, 세차 등 다른 서비스도 함께
                이용할 수 있어요
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleGoToPortal}
              className="bg-white text-orange-600 hover:bg-orange-50 text-xs h-8 px-3"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              포털 연결하기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/10 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
