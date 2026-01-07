import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import {
  ExternalLink,
  Fuel,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const QuickActionFab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const user = (useAuth() as any).user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 스크롤에 따른 FAB 표시/숨김
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 특정 페이지에서는 FAB 숨김
  const shouldHideFab = () => {
    const hiddenPaths = ['/auth/', '/dashboard/'];
    return hiddenPaths.some((path) => location.pathname.startsWith(path));
  };

  if (shouldHideFab()) return null;

  // Gas Station용 FAB 액션들
  const fabActions = isAuthenticated
    ? [
        {
          id: 'dashboard',
          icon: <TrendingUp className="w-5 h-5" />,
          label: '대시보드',
          color: 'bg-blue-600 hover:bg-blue-700',
          onClick: () => navigate('/dashboard'),
        },
        {
          id: 'stations',
          icon: <MapPin className="w-5 h-5" />,
          label: '주유소 찾기',
          color: 'bg-green-600 hover:bg-green-700',
          onClick: () => navigate('/stations'),
        },
        {
          id: 'prices',
          icon: <Fuel className="w-5 h-5" />,
          label: '실시간 가격',
          color: 'bg-purple-600 hover:bg-purple-700',
          onClick: () => navigate('/prices'),
        },
        {
          id: 'portal',
          icon: <ExternalLink className="w-5 h-5" />,
          label: '포털 이동',
          color: 'bg-indigo-600 hover:bg-indigo-700',
          onClick: () =>
            window.open(
              `https://${APP_CONFIG.portal.currentPortalDomain}`,
              '_blank'
            ),
        },
      ]
    : [
        {
          id: 'register',
          icon: <User className="w-5 h-5" />,
          label: '간편 가입',
          color: 'bg-blue-600 hover:bg-blue-700',
          onClick: () => navigate('/auth/register'),
        },
        {
          id: 'stations',
          icon: <MapPin className="w-5 h-5" />,
          label: '주유소 찾기',
          color: 'bg-green-600 hover:bg-green-700',
          onClick: () => navigate('/stations'),
        },
        {
          id: 'prices',
          icon: <Fuel className="w-5 h-5" />,
          label: '실시간 가격',
          color: 'bg-purple-600 hover:bg-purple-700',
          onClick: () => navigate('/prices'),
        },
      ];

  const supportActions = [
    {
      id: 'call',
      icon: <Phone className="w-4 h-4" />,
      label: '전화',
      onClick: () => (window.location.href = 'tel:1588-1234'),
    },
    {
      id: 'chat',
      icon: <MessageCircle className="w-4 h-4" />,
      label: '채팅',
      onClick: () => console.log('채팅 상담'),
    },
  ];

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      {/* 확장된 액션 버튼들 */}
      {isExpanded && (
        <div className="space-y-3 mb-4">
          <div className="space-y-3">
            {fabActions.map((action, index) => (
              <div
                key={action.id}
                className={`transform transition-all duration-300 ${
                  isExpanded
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Button
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  className={`${action.color} text-white shadow-lg hover:shadow-xl transition-all w-12 h-12 rounded-full p-0 group relative`}
                >
                  {action.icon}

                  {/* 툴팁 */}
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    {action.label}
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* 고객 지원 */}
          <div className="border-t pt-3 space-y-2">
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                고객 지원
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              {supportActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={action.onClick}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm h-8 px-3"
                >
                  {action.icon}
                  <span className="ml-1 text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 메인 FAB 버튼 */}
      <div className="relative">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all ${
            isExpanded
              ? 'bg-red-600 hover:bg-red-700 rotate-45'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          } text-white`}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>

        {/* 사용자 상태 표시 */}
        {isAuthenticated && user && !isExpanded && (
          <div className="absolute -top-2 -left-2">
            <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        )}

        {/* 신규 사용자를 위한 펄스 애니메이션 */}
        {!isAuthenticated && !isExpanded && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
        )}
      </div>

      {/* 첫 방문자를 위한 안내 */}
      {!isAuthenticated && !isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 max-w-48 opacity-0 animate-fade-up animation-delay-1000">
          <div className="text-sm font-medium mb-1">⛽ 빠른 접근</div>
          <div className="text-xs text-muted-foreground">
            버튼을 눌러 주유소 찾기와 실시간 가격을 확인하세요!
          </div>
        </div>
      )}
    </div>
  );
};
