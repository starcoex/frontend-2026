import React, { useState } from 'react';
import { Snowflake, Sun, X, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const SeasonalNotice: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('seasonal_notice_dismissed') === 'true';
  });

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12

    // 겨울 성수기 (11월~3월)
    if ([11, 12, 1, 2, 3].includes(month)) {
      return 'winter';
    }

    // 여름 점검기 (6월~8월)
    if ([6, 7, 8].includes(month)) {
      return 'summer';
    }

    return null;
  };

  const season = getCurrentSeason();

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('seasonal_notice_dismissed', 'true');

    // 24시간 후에 다시 표시
    setTimeout(() => {
      localStorage.removeItem('seasonal_notice_dismissed');
    }, 24 * 60 * 60 * 1000);
  };

  if (isDismissed || !season) {
    return null;
  }

  const getSeasonContent = () => {
    switch (season) {
      case 'winter':
        return {
          icon: Snowflake,
          bgClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          title: '❄️ 겨울 성수기 안내',
          message:
            '추운 겨울, 난방유 수요가 급증합니다. 조기 주문으로 안정적인 공급을 확보하세요!',
          details: [
            '⏰ 배송 시간: 평일 1-2일, 주말 2-3일',
            '📦 대용량 주문 시 배송비 할인',
            '🔥 정기 배송 고객 우선 공급',
          ],
          actionText: '지금 주문하기',
        };

      case 'summer':
        return {
          icon: Sun,
          bgClass: 'bg-gradient-to-r from-orange-500 to-yellow-500',
          title: '☀️ 여름철 정기 점검',
          message:
            '안전한 난방유 공급을 위해 정기 점검이 진행됩니다. 미리 주문해 주세요!',
          details: [
            '🔧 저장 탱크 점검: 7월 1주차',
            '🚛 배송 차량 정비: 매주 화요일',
            '📋 품질 검사: 월 2회 실시',
          ],
          actionText: '점검 일정 보기',
        };

      default:
        return null;
    }
  };

  const content = getSeasonContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className={`${content.bgClass} text-white`}>
      <div className="container mx-auto px-4 py-4">
        <Alert className="border-0 bg-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 mt-0.5 text-white animate-pulse" />

            <div className="flex-1">
              <AlertDescription className="text-white">
                <div className="font-semibold text-sm mb-2">
                  {content.title}
                </div>
                <div className="text-sm mb-3 opacity-95">{content.message}</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs opacity-90">
                  {content.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => {
                      if (season === 'winter') {
                        window.location.href = '/order';
                      } else {
                        window.location.href = '/help';
                      }
                    }}
                  >
                    {content.actionText}
                  </Button>

                  <span className="text-xs opacity-75">
                    💡 정기 배송으로 편리하게 이용하세요
                  </span>
                </div>
              </AlertDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/10 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
};
