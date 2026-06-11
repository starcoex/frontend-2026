import React, { useEffect } from 'react';
import { Ticket, Loader2, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const COUPON_STATUS_LABEL: Record<string, { label: string; style: string }> = {
  ACTIVE: {
    label: '사용 가능',
    style:
      'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  },
  USED: {
    label: '사용 완료',
    style: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  },
  EXPIRED: {
    label: '만료',
    style: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  },
};

export const CouponListTab: React.FC = () => {
  const {
    fetchMyCoupons,
    exchangeCoupon,
    coupons,
    exchangeableCoupons,
    isLoading,
  } = useLoyalty();

  useEffect(() => {
    fetchMyCoupons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExchange = async () => {
    // ExchangeCouponInput: { type?: string } — type 없이 호출하면 기본 교환
    const res = await exchangeCoupon({});
    if (res.success) {
      toast.success('쿠폰이 교환되었습니다!');
      fetchMyCoupons();
    } else {
      toast.error('쿠폰 교환에 실패했습니다.');
    }
  };

  if (isLoading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exchangeableCoupons > 0 && (
        <Button
          className="w-full"
          onClick={handleExchange}
          disabled={isLoading}
        >
          <Gift className="w-4 h-4 mr-2" />
          쿠폰 {exchangeableCoupons}장 교환하기
        </Button>
      )}

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <Ticket className="w-10 h-10 opacity-30" />
          <p className="text-sm">보유한 쿠폰이 없습니다.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden divide-y">
          {coupons.map((coupon) => {
            const statusInfo = COUPON_STATUS_LABEL[coupon.status] ?? {
              label: coupon.status,
              style: 'bg-gray-100 text-gray-500',
            };
            const isActive = coupon.status === 'ACTIVE';
            return (
              <div
                key={coupon.code}
                className={cn(
                  'flex items-center justify-between px-4 py-3 gap-4',
                  !isActive && 'opacity-50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {coupon.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {coupon.code}
                    </p>
                    {coupon.expiresAt && (
                      <p className="text-xs text-muted-foreground">
                        만료:{' '}
                        {format(new Date(coupon.expiresAt), 'yyyy.MM.dd', {
                          locale: ko,
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-1 rounded-full shrink-0',
                    statusInfo.style
                  )}
                >
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
