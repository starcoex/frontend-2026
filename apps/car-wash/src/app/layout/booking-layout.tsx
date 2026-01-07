import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const BookingLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 예약 단계별 진행률
  const getBookingProgress = () => {
    const path = location.pathname;

    if (path === '/booking')
      return { step: 1, progress: 33, title: '세차 옵션 선택' };
    if (path === '/booking/confirm')
      return { step: 2, progress: 66, title: '예약 정보 확인' };
    if (path.includes('/booking/success'))
      return { step: 3, progress: 100, title: '예약 완료' };

    return { step: 1, progress: 33, title: '세차 예약' };
  };

  const bookingInfo = getBookingProgress();

  const handleBack = () => {
    if (location.pathname === '/booking') {
      navigate('/');
    } else if (location.pathname === '/booking/confirm') {
      navigate('/booking');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-900/10 dark:via-blue-900/10 dark:to-gray-900">
      {/* 예약 전용 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 뒤로가기 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 h-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* 진행 단계 */}
            <div className="flex-1 max-w-md mx-4">
              <div className="text-center mb-2">
                <h1 className="text-lg font-semibold">{bookingInfo.title}</h1>
                <p className="text-xs text-muted-foreground">
                  {bookingInfo.step}/3 단계
                </p>
              </div>

              <Progress value={bookingInfo.progress} className="h-2" />

              {/* 단계 인디케이터 */}
              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      bookingInfo.step >= 1 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">선택</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      bookingInfo.step >= 2 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">확인</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      bookingInfo.step >= 3 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">완료</span>
                </div>
              </div>
            </div>

            {/* 사용자 정보 */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.name}님
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 예약 플로우 안내 */}
      {bookingInfo.step < 3 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div
                className={`flex items-center gap-1 ${
                  bookingInfo.step === 1
                    ? 'text-blue-600 font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>옵션 선택</span>
              </div>

              <div className="w-4 h-px bg-gray-300" />

              <div
                className={`flex items-center gap-1 ${
                  bookingInfo.step === 2
                    ? 'text-blue-600 font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>정보 확인</span>
              </div>

              <div className="w-4 h-px bg-gray-300" />

              <div
                className={`flex items-center gap-1 ${
                  bookingInfo.step === 3
                    ? 'text-green-600 font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>결제 완료</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* 예약 도움말 플로팅 */}
      {bookingInfo.step < 3 && (
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-lg"
            onClick={() => {
              // 도움말 모달 열기
              console.log('예약 도움말');
            }}
          >
            <span className="text-sm">💬 도움이 필요하세요?</span>
          </Button>
        </div>
      )}
    </div>
  );
};
