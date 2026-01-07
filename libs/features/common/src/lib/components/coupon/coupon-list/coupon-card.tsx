import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Gift, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { RewardCoupon, CouponStatus } from '@starcoex-frontend/graphql';
import { cn } from '../../../utils';
import { Card, CardContent, Badge } from '../../ui';

interface CouponCardProps {
  coupon: RewardCoupon;
  onClick?: (coupon: RewardCoupon) => void;
  className?: string;
}

const statusConfig: Record<
  CouponStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  ACTIVE: { label: '사용 가능', variant: 'default', icon: CheckCircle },
  USED: { label: '사용 완료', variant: 'secondary', icon: CheckCircle },
  EXPIRED: { label: '만료됨', variant: 'destructive', icon: XCircle },
};

const couponTypeLabels: Record<string, string> = {
  PREMIUM_WASH: '프리미엄 세차',
  BASIC_WASH: '기본 세차',
  FUEL_DISCOUNT: '주유 할인',
};

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onClick,
  className,
}) => {
  const status = statusConfig[coupon.status] || statusConfig.ACTIVE;
  const StatusIcon = status.icon;
  const isUsable = coupon.status === 'ACTIVE';
  const isExpiringSoon =
    isUsable &&
    coupon.expiresAt &&
    new Date(coupon.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 cursor-pointer group',
        isUsable
          ? 'hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5'
          : 'opacity-60',
        className
      )}
      onClick={() => onClick?.(coupon)}
    >
      {/* 왼쪽 컬러 바 */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5',
          isUsable ? 'bg-primary' : 'bg-muted'
        )}
      />

      {/* 만료 임박 리본 */}
      {isExpiringSoon && (
        <div className="absolute top-0 right-0">
          <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
            곧 만료
          </div>
        </div>
      )}

      {/* 선물 받은 쿠폰 표시 */}
      {coupon.isGifted && (
        <div className="absolute top-2 right-2">
          <Gift className="h-4 w-4 text-pink-500" />
        </div>
      )}

      <CardContent className="p-4 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* 쿠폰 타입 */}
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {couponTypeLabels[coupon.type] || coupon.type}
            </p>

            {/* 쿠폰 이름 */}
            <h3 className="text-lg font-bold mt-1 truncate">{coupon.name}</h3>

            {/* 쿠폰 코드 */}
            <p className="text-sm text-muted-foreground font-mono mt-1">
              {coupon.code}
            </p>

            {/* 유효기간 */}
            <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {coupon.expiresAt
                  ? `${format(new Date(coupon.expiresAt), 'yyyy.MM.dd', {
                      locale: ko,
                    })}까지`
                  : '무기한'}
              </span>
            </div>
          </div>

          {/* 상태 및 화살표 */}
          <div className="flex flex-col items-end justify-between h-full gap-4">
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>

            {isUsable && (
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>
      </CardContent>

      {/* 티켓 스타일 데코레이션 */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-background rounded-full border" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-background rounded-full border" />
    </Card>
  );
};
