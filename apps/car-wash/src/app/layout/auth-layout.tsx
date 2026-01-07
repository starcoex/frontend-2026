import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Car } from 'lucide-react';
import { APP_CONFIG } from '../config/app.config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (
      location.pathname === '/auth/login' ||
      location.pathname === '/auth/register'
    ) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const getPageInfo = () => {
    if (location.pathname === '/auth/login') {
      return { title: '로그인', subtitle: '세차 서비스에 로그인하세요' };
    }
    if (location.pathname === '/auth/register') {
      return {
        title: '회원가입',
        subtitle: '간편하게 가입하고 세차 서비스를 시작하세요',
      };
    }
    return { title: '인증', subtitle: '계정 처리 중입니다' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/10 dark:via-gray-900 dark:to-purple-900/10">
      {/* 상단 네비게이션 */}
      <header className="relative p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center">
            {/* 뒤로가기 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 h-auto text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* 로고 */}
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-primary">
                    {APP_CONFIG.app.shortName}
                  </h1>
                  <Badge variant="outline" className="text-xs">
                    세차 전용
                  </Badge>
                </div>
              </div>
            </div>

            {/* 홈으로 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 h-auto text-muted-foreground hover:text-foreground"
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>

          {/* 페이지 정보 */}
          <div className="text-center mt-6">
            <h2 className="text-xl font-semibold mb-1">{pageInfo.title}</h2>
            <p className="text-sm text-muted-foreground">{pageInfo.subtitle}</p>
          </div>
        </div>
      </header>

      {/* 포털 연동 안내 */}
      <div className="max-w-lg mx-auto px-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔗</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                스타코엑스 통합 로그인
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                포털 계정으로 모든 서비스 앱이 자동 연결됩니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-start justify-center px-6 pb-8">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </main>

      {/* 하단 정보 */}
      <footer className="pb-8">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              © 2024 {APP_CONFIG.app.name}. 스타코엑스 통합 서비스의 일부입니다.
            </p>
            <p className="mt-1">문의: 1588-1234 | 운영시간: 08:00-20:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
