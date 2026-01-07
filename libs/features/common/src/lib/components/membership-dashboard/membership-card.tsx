import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Card, CardContent, Progress, Button, Skeleton } from '../ui';

const tierConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: string;
    nextTier?: string;
    starsToNext?: number;
  }
> = {
  WELCOME: {
    label: 'Welcome',
    color: 'bg-slate-500',
    icon: '👋',
    nextTier: 'SHINE',
    starsToNext: 50,
  },
  SHINE: {
    label: 'Shine',
    color: 'bg-blue-500',
    icon: '✨',
    nextTier: 'STAR',
    starsToNext: 200,
  },
  STAR: {
    label: 'Star',
    color: 'bg-amber-500',
    icon: '⭐',
  },
};

interface MembershipCardProps {
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  compact = false,
  showActions = true,
  className,
}) => {
  const navigate = useNavigate();
  const { membership, coupons, isLoading } = useLoyalty();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-24 mb-4" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentTier = membership?.currentTier || 'WELCOME';
  const tier = tierConfig[currentTier] || tierConfig.WELCOME;
  const availableStars = membership?.availableStars || 0;
  const tierStars = membership?.tierStars || 0;
  const activeCoupons = coupons.filter((c) => c.status === 'ACTIVE').length;

  // 다음 등급까지 진행률
  const progressToNext = tier.starsToNext
    ? Math.min((tierStars / tier.starsToNext) * 100, 100)
    : 100;

  if (compact) {
    return (
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={() => navigate('/membership')}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${tier.color} flex items-center justify-center text-lg`}
              >
                {tier.icon}
              </div>
              <div>
                <p className="font-medium">{tier.label} 등급</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{availableStars}별</span>
                  <span className="mx-1">•</span>
                  <span>쿠폰 {activeCoupons}장</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* 등급 배너 */}
      <div className={`${tier.color} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tier.icon}</span>
            <div>
              <p className="text-sm opacity-90">현재 등급</p>
              <h2 className="text-2xl font-bold">{tier.label}</h2>
            </div>
          </div>
          {currentTier === 'STAR' && <Crown className="h-8 w-8 opacity-80" />}
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* 별 현황 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">보유 별</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              <span className="text-3xl font-bold">{availableStars}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">사용 가능 쿠폰</p>
            <p className="text-3xl font-bold mt-1">{activeCoupons}장</p>
          </div>
        </div>

        {/* 다음 등급 진행률 */}
        {tier.nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">다음 등급까지</span>
              <span>
                <span className="font-medium">{tierStars}</span>
                <span className="text-muted-foreground">
                  {' '}
                  / {tier.starsToNext}별
                </span>
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>
                {tier.starsToNext! - tierStars}별 더 모으면{' '}
                <span className="font-medium text-foreground">
                  {tierConfig[tier.nextTier].label}
                </span>{' '}
                등급!
              </span>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        {showActions && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/coupons')}
            >
              내 쿠폰
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/coupons/exchange')}
            >
              쿠폰 교환
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
