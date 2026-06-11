import React, { useEffect } from 'react';
import { Star, Loader2, ShoppingBag, Gift, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { cn } from '@/lib/utils';

// CouponHistoryItem.action: 'USED' | 'GIFTED_SENT' | 'GIFTED_RECEIVED' | 'EXCHANGED'
const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; style: string }
> = {
  USED: {
    label: '사용',
    icon: <ShoppingBag className="w-4 h-4 text-blue-500" />,
    style: 'bg-blue-50 dark:bg-blue-900/20',
  },
  GIFTED_SENT: {
    label: '선물 발송',
    icon: <Gift className="w-4 h-4 text-purple-500" />,
    style: 'bg-purple-50 dark:bg-purple-900/20',
  },
  GIFTED_RECEIVED: {
    label: '선물 수령',
    icon: <Gift className="w-4 h-4 text-green-500" />,
    style: 'bg-green-50 dark:bg-green-900/20',
  },
  EXCHANGED: {
    label: '교환',
    icon: <Ticket className="w-4 h-4 text-yellow-500" />,
    style: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
};

export const StarHistoryTab: React.FC = () => {
  const { fetchCouponHistory, couponHistory, isLoading } = useLoyalty();

  useEffect(() => {
    fetchCouponHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (couponHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <Star className="w-10 h-10 opacity-30" />
        <p className="text-sm">별 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="divide-y">
        {couponHistory.map((item) => {
          const config = ACTION_CONFIG[item.action] ?? {
            label: item.action,
            icon: <Ticket className="w-4 h-4 text-muted-foreground" />,
            style: 'bg-muted',
          };
          return (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    config.style
                  )}
                >
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.couponName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.actionDate), 'yyyy.MM.dd HH:mm', {
                      locale: ko,
                    })}
                  </p>
                  {item.relatedUserName && (
                    <p className="text-xs text-muted-foreground">
                      {item.action === 'GIFTED_SENT' ? '받는 분' : '보낸 분'}:{' '}
                      {item.relatedUserName}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground shrink-0">
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
