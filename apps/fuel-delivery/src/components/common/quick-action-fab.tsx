import React, { useState, useEffect } from 'react';
import {
  Phone,
  Plus,
  ShoppingCart,
  MapPin,
  Clock,
  X,
  Truck,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { Button } from '@/components/ui/button';

export const QuickActionFab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤에 따라 FAB 숨기기/보이기
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // 아래로 스크롤 시 숨기기
        setIsOpen(false); // 메뉴도 닫기
      } else {
        setIsVisible(true); // 위로 스크롤 시 보이기
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 페이지 변경 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // FAB를 숨길 페이지들
  const shouldHideFab = () => {
    return (
      location.pathname.startsWith('/auth/') ||
      location.pathname.includes('/order/success') ||
      location.pathname === '/404'
    );
  };

  if (shouldHideFab()) {
    return null;
  }

  const quickActions = [
    {
      icon: ShoppingCart,
      label: '바로 주문',
      description: '난방유 주문하기',
      action: () => {
        if (isAuthenticated) {
          navigate('/order');
        } else {
          navigate('/auth/login?redirect=%2Forder');
        }
      },
      primary: true,
    },
    {
      icon: MapPin,
      label: '배송 추적',
      description: '실시간 배송 현황',
      action: () => navigate('/tracking'),
      primary: false,
    },
    {
      icon: Clock,
      label: '주문 내역',
      description: '내 주문 확인',
      action: () => {
        if (isAuthenticated) {
          navigate('/profile/orders');
        } else {
          navigate('/auth/login?redirect=%2Fprofile%2Forders');
        }
      },
      primary: false,
    },
    {
      icon: Phone,
      label: '긴급 주문',
      description: '전화 주문 (24시간)',
      action: () => {
        window.open('tel:1588-9999');
      },
      primary: false,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={handleBackdropClick}
        />
      )}

      {/* FAB 컨테이너 */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        {/* 퀵 액션 메뉴들 */}
        <div
          className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 라벨 */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-3 py-2 border border-orange-200 dark:border-orange-800">
                  <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    {action.label}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    {action.description}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <Button
                  onClick={action.action}
                  className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                    action.primary
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 border-2 border-orange-200 dark:border-orange-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* 메인 FAB */}
        <Button
          onClick={toggleMenu}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <Plus className="w-6 h-6 transition-transform duration-200" />
          )}
        </Button>

        {/* 난방유 배달 브랜딩 */}
        {!isOpen && (
          <div className="absolute -top-2 -left-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-orange-200 dark:border-orange-800">
            <Truck className="w-4 h-4 text-orange-600" />
          </div>
        )}
      </div>

      {/* 도움말 텍스트 (처음 방문자용) */}
      {!isOpen && location.pathname === '/' && (
        <div className="fixed bottom-24 right-6 z-40 max-w-48 pointer-events-none">
          <div
            className="bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-200 text-xs rounded-lg px-3 py-2 shadow-sm border border-orange-200 dark:border-orange-800 opacity-0 animate-in fade-in-0 duration-500"
            style={{ animationDelay: '2s', animationFillMode: 'forwards' }}
          >
            💡 빠른 주문과 배송 추적이 가능해요!
            <div className="absolute bottom-full right-6 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-orange-100 dark:border-b-orange-950/50"></div>
          </div>
        </div>
      )}
    </>
  );
};
