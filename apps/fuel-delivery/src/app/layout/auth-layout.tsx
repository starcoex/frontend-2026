import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, Truck, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 인증 페이지 타입 확인
  const getAuthPageType = () => {
    if (location.pathname.includes('login')) {
      return {
        type: 'login',
        title: '로그인',
        subtitle: '난방유 배달 서비스에 오신 것을 환영합니다',
      };
    }
    if (location.pathname.includes('register')) {
      return {
        type: 'register',
        title: '회원가입',
        subtitle: '간편하게 가입하고 당일 배송을 이용하세요',
      };
    }
    return {
      type: 'auth',
      title: '인증',
      subtitle: '서비스 이용을 위해 인증이 필요합니다',
    };
  };

  const pageInfo = getAuthPageType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900">
      {/* 인증 전용 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 뒤로가기 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 h-auto hover:bg-orange-50"
            >
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </Button>

            {/* 로고 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-orange-900">
                  난방유 배달
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs -mt-1 border-orange-300 text-orange-600"
                >
                  by 스타코엑스
                </Badge>
              </div>
            </div>

            {/* 빈 공간 (균형 맞추기) */}
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* 인증 페이지 소개 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">{pageInfo.title}</h2>
          <p className="text-orange-100 mb-6">{pageInfo.subtitle}</p>

          {/* 서비스 특징 */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>당일 배송</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>안전한 배송</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>통합 서비스</span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* 하단 안내 */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border-t border-orange-200/50 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-semibold text-orange-900 mb-3">
              🌟 스타코엑스 통합 서비스의 장점
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200">
                <div className="text-lg mb-2">⛽</div>
                <div className="font-medium text-orange-900 mb-1">
                  주유소 연계
                </div>
                <div className="text-orange-600">실시간 유가 정보</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200">
                <div className="text-lg mb-2">🚗</div>
                <div className="font-medium text-orange-900 mb-1">
                  세차 서비스
                </div>
                <div className="text-orange-600">전문 카케어</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200">
                <div className="text-lg mb-2">🚛</div>
                <div className="font-medium text-orange-900 mb-1">
                  배달 서비스
                </div>
                <div className="text-orange-600">당일 배송</div>
              </div>
            </div>

            <p className="text-xs text-orange-600 mt-4">
              한 번의 가입으로 모든 스타코엑스 서비스를 자동 연결하여
              이용하세요!
            </p>
          </div>
        </div>
      </div>

      {/* 고객지원 플로팅 */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-orange-200 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-orange-600 hover:bg-orange-50"
            onClick={() => window.open('tel:1588-9999')}
          >
            📞 도움말
          </Button>
        </div>
      </div>
    </div>
  );
};
