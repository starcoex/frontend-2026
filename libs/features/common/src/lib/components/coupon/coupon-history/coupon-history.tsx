import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  History,
  Gift,
  Ticket,
  CheckCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '../../ui';
import { cn } from '../../../utils';

const actionConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  EXCHANGE: { label: '교환', icon: Ticket, color: 'text-blue-500 bg-blue-50' },
  USE: {
    label: '사용',
    icon: CheckCircle,
    color: 'text-green-500 bg-green-50',
  },
  GIFT_SENT: {
    label: '선물 보냄',
    icon: Gift,
    color: 'text-pink-500 bg-pink-50',
  },
  GIFT_RECEIVED: {
    label: '선물 받음',
    icon: Gift,
    color: 'text-purple-500 bg-purple-50',
  },
};

interface CouponHistoryProps {
  maxItems?: number;
  className?: string;
}

export const CouponHistory: React.FC<CouponHistoryProps> = ({
  maxItems = 10,
  className,
}) => {
  const { couponHistory, isLoading, error, fetchCouponHistory } = useLoyalty();

  useEffect(() => {
    fetchCouponHistory({ limit: maxItems });
  }, [fetchCouponHistory, maxItems]);

  if (isLoading && couponHistory.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          이용 내역
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchCouponHistory({ limit: maxItems })}
          disabled={isLoading}
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
      </CardHeader>

      <CardContent>
        {error ? (
          <p className="text-destructive text-center py-4">{error}</p>
        ) : couponHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>아직 이용 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {couponHistory.map((item) => {
              const config = actionConfig[item.action] || actionConfig.USE;
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      config.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{config.label}</span>
                      {item.relatedUserName && (
                        <>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {item.relatedUserName}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.couponName}
                    </p>
                    {item.message && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{item.message}"
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground text-right shrink-0">
                    {format(new Date(item.actionDate), 'MM.dd', { locale: ko })}
                    <br />
                    {format(new Date(item.actionDate), 'HH:mm', { locale: ko })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
