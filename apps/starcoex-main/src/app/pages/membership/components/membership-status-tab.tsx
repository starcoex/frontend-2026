import React, { useEffect } from 'react';
import { Star, Ticket, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Skeleton } from '@/components/ui/skeleton';

const TIER_STYLE: Record<
  string,
  { bg: string; text: string; border: string; badge: string }
> = {
  WELCOME: {
    bg: 'bg-gray-50 dark:bg-gray-900',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  SHINE: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-700',
    badge:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  },
  STAR: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
};

const TIER_ORDER = ['WELCOME', 'SHINE', 'STAR'];

export const MembershipStatusTab: React.FC = () => {
  const {
    fetchMembershipConfig,
    config,
    membership,
    currentTierDisplayName,
    availableStars,
    tierStars,
    tierProgress,
    starsToNextTier,
    starsToNextCoupon,
    couponProgress,
    exchangeableCoupons,
    daysUntilReview,
    isLoading,
  } = useLoyalty();

  useEffect(() => {
    fetchMembershipConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tier = currentTierDisplayName;
  const style = TIER_STYLE[tier] ?? TIER_STYLE['WELCOME'];

  if (isLoading && !membership) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 현재 등급 카드 */}
      <div
        className={cn(
          'rounded-2xl border p-5 space-y-3',
          style.bg,
          style.border
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className={cn('w-5 h-5', style.text)} />
            <span className="text-sm text-muted-foreground">현재 등급</span>
          </div>
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              style.badge
            )}
          >
            {tier}
          </span>
        </div>

        <div className="flex items-end gap-2">
          <span className={cn('text-3xl font-bold', style.text)}>
            {tierStars.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground mb-1">별 적립</span>
        </div>

        {starsToNextTier !== null ? (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>다음 등급까지</span>
              <span className="font-medium">
                {starsToNextTier.toLocaleString()}별 필요
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  style.text.replace('text-', 'bg-')
                )}
                style={{ width: `${Math.min(tierProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(tierProgress)}% 달성
            </p>
          </div>
        ) : (
          <p className="text-sm font-medium text-primary">🎉 최고 등급 달성!</p>
        )}

        {daysUntilReview > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t">
            <Clock className="w-3.5 h-3.5" />
            <span>
              등급 심사까지 <strong>{daysUntilReview}일</strong> 남음
            </span>
          </div>
        )}
      </div>

      {/* 사용 가능한 별 */}
      <div className="rounded-xl border bg-card p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>사용 가능한 별</span>
        </div>
        <p className="text-2xl font-bold">
          {availableStars.toLocaleString()}{' '}
          <span className="text-base font-normal text-muted-foreground">
            별
          </span>
        </p>
      </div>

      {/* 쿠폰 진행률 */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Ticket className="w-4 h-4 text-green-500" />
            <span>쿠폰 교환</span>
          </div>
          {exchangeableCoupons > 0 && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
              {exchangeableCoupons}장 교환 가능
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>쿠폰 1장까지</span>
            <span className="font-medium">{starsToNextCoupon}별 필요</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(couponProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 등급 안내 */}
      {config && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold">등급 기준 안내</p>
          <div className="space-y-2">
            {TIER_ORDER.map((t) => {
              const s = TIER_STYLE[t];
              const thresholds: Record<string, string> = {
                WELCOME: '0별 ~',
                SHINE: `${config.tierThresholds.SHINE.toLocaleString()}별 ~`,
                STAR: `${config.tierThresholds.STAR.toLocaleString()}별 ~`,
              };
              const isCurrent = t === tier;
              return (
                <div
                  key={t}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                    isCurrent ? cn(s.bg, s.border, 'border') : 'bg-muted/40'
                  )}
                >
                  <span
                    className={cn(
                      'font-medium',
                      isCurrent ? s.text : 'text-muted-foreground'
                    )}
                  >
                    {t} {isCurrent && '← 현재'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {thresholds[t]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
