import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Gift, ArrowRight, X } from 'lucide-react';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Card, CardContent, Button, Badge, Progress } from '../ui';

interface WelcomeRewardsBannerProps {
  className?: string;
  dismissible?: boolean;
}

const BANNER_DISMISSED_KEY = 'welcome_banner_dismissed';

export const WelcomeRewardsBanner: React.FC<WelcomeRewardsBannerProps> = ({
  className,
  dismissible = true,
}) => {
  const navigate = useNavigate();
  const { membership, coupons } = useLoyalty();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
  });

  // 웰컴 쿠폰이 있는지 확인
  const welcomeCoupons = coupons.filter(
    (c) => c.issueType === 'WELCOME' && c.status === 'ACTIVE'
  );
  const hasWelcomeCoupon = welcomeCoupons.length > 0;

  // WELCOME 등급인지 확인 (신규 회원)
  const isWelcomeTier = membership?.currentTier === 'WELCOME';
  const availableStars = membership?.availableStars || 0;
  const starsToNextCoupon = Math.max(12 - availableStars, 0);
  const progressPercent = Math.min((availableStars / 12) * 100, 100);

  // 배너 표시 조건: 웰컴 쿠폰이 있거나, WELCOME 등급이면서 아직 12별 미만
  const shouldShow =
    !isDismissed &&
    (hasWelcomeCoupon || (isWelcomeTier && availableStars < 12));

  if (!shouldShow) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800 ${className}`}
    >
      {/* 닫기 버튼 */}
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-100"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* 아이콘 */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          {/* 내용 */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                웰컴 혜택을 사용해보세요!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                별표주유소와 함께하는 첫 걸음, 특별한 혜택으로 시작하세요.
              </p>
            </div>

            {/* 혜택 상세 */}
            <div className="flex flex-wrap gap-3">
              {/* 웰컴 쿠폰 */}
              {hasWelcomeCoupon && (
                <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 rounded-full px-3 py-1.5">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {welcomeCoupons[0].name}
                  </span>
                  <Badge className="bg-green-600 text-xs">사용 가능</Badge>
                </div>
              )}

              {/* 별 진행률 */}
              {isWelcomeTier && (
                <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 rounded-full px-3 py-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {availableStars}/12별
                  </span>
                  <span className="text-xs text-green-600">
                    ({starsToNextCoupon}개 더!)
                  </span>
                </div>
              )}
            </div>

            {/* 별 진행 바 */}
            {isWelcomeTier && availableStars < 12 && (
              <div className="max-w-xs">
                <div className="flex justify-between text-xs text-green-700 dark:text-green-300 mb-1">
                  <span>다음 쿠폰까지</span>
                  <span>{starsToNextCoupon}별 남음</span>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-2 bg-green-200"
                />
              </div>
            )}
          </div>

          {/* CTA 버튼 */}
          <Button
            className="bg-green-600 hover:bg-green-700 shrink-0"
            onClick={() => navigate('/dashboard/coupons')}
          >
            혜택 확인하기
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
