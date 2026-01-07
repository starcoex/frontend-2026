import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, RefreshCw } from 'lucide-react';
import { CouponStatus, RewardCoupon } from '@starcoex-frontend/graphql';
import { CouponCard } from './coupon-card';
import { CouponFilter } from './coupon-filter';
import { Button, Skeleton } from '../../ui';
import { useLoyalty } from '@starcoex-frontend/loyalty';

interface CouponListProps {
  onCouponClick?: (coupon: RewardCoupon) => void;
  showFilter?: boolean;
  showExchangeButton?: boolean;
  maxItems?: number;
  className?: string;
}

export const CouponList: React.FC<CouponListProps> = ({
  onCouponClick,
  showFilter = true,
  showExchangeButton = true,
  maxItems,
  className,
}) => {
  const navigate = useNavigate();
  const { coupons, isLoading, error, fetchMyCoupons } = useLoyalty();
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchMyCoupons();
  }, [fetchMyCoupons]);

  const filteredCoupons = useMemo(() => {
    let filtered = coupons;

    if (statusFilter !== 'ALL') {
      filtered = coupons.filter((c) => c.status === statusFilter);
    }

    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [coupons, statusFilter, maxItems]);

  const counts = useMemo(
    () => ({
      all: coupons.length,
      active: coupons.filter((c) => c.status === 'ACTIVE').length,
      used: coupons.filter((c) => c.status === 'USED').length,
      expired: coupons.filter((c) => c.status === 'EXPIRED').length,
    }),
    [coupons]
  );

  const handleCouponClick = (coupon: RewardCoupon) => {
    if (onCouponClick) {
      onCouponClick(coupon);
    } else {
      navigate(`/coupons/${coupon.code}`);
    }
  };

  const handleRefresh = () => {
    fetchMyCoupons();
  };

  if (isLoading && coupons.length === 0) {
    return (
      <div className={className}>
        {showFilter && <Skeleton className="h-10 w-full mb-4" />}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Ticket className="h-5 w-5" />내 쿠폰
          <span className="text-muted-foreground font-normal text-base">
            ({counts.active}장 사용 가능)
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>

          {showExchangeButton && (
            <Button size="sm" onClick={() => navigate('/coupons/exchange')}>
              쿠폰 교환
            </Button>
          )}
        </div>
      </div>

      {/* 필터 */}
      {showFilter && (
        <div className="mb-4">
          <CouponFilter
            currentStatus={statusFilter}
            onStatusChange={setStatusFilter}
            counts={counts}
          />
        </div>
      )}

      {/* 쿠폰 목록 */}
      {filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">쿠폰이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            {statusFilter === 'ALL'
              ? '별을 모아 쿠폰으로 교환해보세요!'
              : '해당 상태의 쿠폰이 없습니다.'}
          </p>
          {statusFilter === 'ALL' && (
            <Button onClick={() => navigate('/coupons/exchange')}>
              쿠폰 교환하기
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onClick={handleCouponClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
