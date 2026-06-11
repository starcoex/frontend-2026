import React, { useEffect } from 'react';
import { Star, Ticket, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TIER_STYLE: Record<string, { bg: string; text: string; border: string }> =
  {
    WELCOME: {
      bg: 'bg-gray-50 dark:bg-gray-900',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
    },
    SHINE: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-700',
    },
    STAR: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-700',
    },
  };

export const MembershipCard: React.FC = () => {
  const navigate = useNavigate();
  const {
    fetchMembershipConfig,
    currentTierDisplayName,
    availableStars,
    tierStars,
    tierProgress,
    starsToNextTier,
    starsToNextCoupon,
    couponProgress,
    exchangeableCoupons,
    membership,
    isLoading,
  } = useLoyalty();

  useEffect(() => {
    fetchMembershipConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tier = currentTierDisplayName;
  const style = TIER_STYLE[tier] ?? TIER_STYLE['WELCOME'];

  if (isLoading && !membership) {
    return (
      <div className="rounded-2xl border p-10 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn('rounded-2xl border p-5 space-y-4', style.bg, style.border)}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className={cn('w-5 h-5', style.text)} />
          <span className={cn('font-bold text-lg', style.text)}>{tier}</span>
          <span className="text-sm text-muted-foreground">등급</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => navigate('/membership')}
        >
          자세히 <ChevronRight className="w-3 h-3 ml-0.5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 보유 별 */}
        <div className="rounded-xl bg-background border p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5" />
            사용 가능 별
          </div>
          <div className="text-2xl font-bold">
            {availableStars.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            이번 등급 적립 <strong>{tierStars.toLocaleString()}별</strong>
          </p>
          {starsToNextTier !== null ? (
            <>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(tierProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                다음 등급까지{' '}
                <strong>{starsToNextTier.toLocaleString()}별</strong> 필요
              </p>
            </>
          ) : (
            <p className="text-xs text-primary font-medium">
              최고 등급 달성! 🎉
            </p>
          )}
        </div>

        {/* 쿠폰 */}
        <div className="rounded-xl bg-background border p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ticket className="w-3.5 h-3.5" />
            쿠폰
          </div>
          <div className="text-2xl font-bold">{exchangeableCoupons}장</div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(couponProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            쿠폰까지 <strong>{starsToNextCoupon}별</strong> 필요
          </p>
        </div>
      </div>

      {exchangeableCoupons > 0 && (
        <Button
          size="sm"
          className="w-full"
          onClick={() => navigate('/membership')}
        >
          쿠폰 {exchangeableCoupons}장 교환하기
        </Button>
      )}
    </div>
  );
};
