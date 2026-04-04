import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import { useAuth } from '@starcoex-frontend/auth';
import type { DeliveryStatus } from '@starcoex-frontend/delivery';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  DELIVERY_STATUS_CONFIG,
  DELIVERY_STATUS_TIMELINE,
} from '../data/delivery-data';
import { DeliveryLiveTracker } from '@/app/pages/dashboard/ecommerce/delivery/tracking/components/deliver-live-tracker';

export default function DeliveryTrackingPage() {
  const { currentUser } = useAuth();
  const { trackingInfo, fetchTrackingInfo } = useDelivery({
    token: currentUser?.accessToken ?? null,
    joinDriversRoom: true,
  });

  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!deliveryNumber.trim()) {
      toast.error('배송번호를 입력해주세요.');
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetchTrackingInfo(deliveryNumber.trim());
      if (!res.success) {
        toast.error(res.error?.message ?? '배송 정보를 찾을 수 없습니다.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const currentStatusIndex = trackingInfo
    ? DELIVERY_STATUS_TIMELINE.indexOf(trackingInfo.status as DeliveryStatus)
    : -1;

  return (
    <>
      <PageHead
        title={`배송 추적 - ${COMPANY_INFO.name}`}
        description="배송번호로 실시간 배송 현황을 확인하세요."
        keywords={['배송 추적', '실시간 추적', COMPANY_INFO.name]}
        og={{
          title: `배송 추적 - ${COMPANY_INFO.name}`,
          description: '실시간 배송 추적 시스템',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <Tabs defaultValue="realtime">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="realtime" className="flex-1">
            실시간 대시보드
          </TabsTrigger>
          <TabsTrigger value="search" className="flex-1">
            배송번호 조회
          </TabsTrigger>
        </TabsList>

        {/* 실시간 전체 대시보드 */}
        <TabsContent value="realtime">
          <DeliveryLiveTracker showAllActive />
        </TabsContent>

        {/* 배송번호 개별 조회 */}
        <TabsContent value="search">
          <div className="mx-auto max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>배송번호로 조회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                    <Input
                      placeholder="배송번호를 입력하세요 (예: DLV-20240101-0001)"
                      className="pl-9"
                      value={deliveryNumber}
                      onChange={(e) => setDeliveryNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      '조회'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 조회 결과 */}
            {trackingInfo && (
              <div className="space-y-4">
                {/* 현재 상태 + 타임라인 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-mono text-lg">
                        {trackingInfo.deliveryNumber}
                      </CardTitle>
                      <Badge
                        variant={
                          DELIVERY_STATUS_CONFIG[
                            trackingInfo.status as DeliveryStatus
                          ].variant
                        }
                      >
                        {
                          DELIVERY_STATUS_CONFIG[
                            trackingInfo.status as DeliveryStatus
                          ].label
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 타임라인 */}
                    <div className="flex items-start justify-between">
                      {DELIVERY_STATUS_TIMELINE.map((status, idx) => {
                        const isCompleted = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;
                        return (
                          <div
                            key={status}
                            className="flex flex-1 flex-col items-center"
                          >
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                                isCurrent
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : isCompleted
                                  ? 'border-primary bg-primary/20 text-primary'
                                  : 'border-muted-foreground/30 text-muted-foreground'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`mt-1 text-center text-xs ${
                                isCompleted
                                  ? 'text-primary font-medium'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {DELIVERY_STATUS_CONFIG[status].label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* 단일 배송 실시간 지도 */}
                <DeliveryLiveTracker deliveryId={trackingInfo.id} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
