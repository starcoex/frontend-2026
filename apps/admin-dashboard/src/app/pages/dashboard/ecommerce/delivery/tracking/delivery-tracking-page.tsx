import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, Wifi, WifiOff } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
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
  // ✅ socketStatus, isSocketConnected — useDelivery return에 존재
  // ✅ useDeliverySocket은 useDelivery 내부에서 이미 호출됨 (직접 호출 불필요)
  const { trackingInfo, fetchTrackingInfo, socketStatus, isSocketConnected } =
    useDelivery();
  // joinDriversRoom 제거 — DeliveryLiveTracker(showAllActive)에서 이미 구독함

  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const trackedNumberRef = useRef<string>('');

  // ✅ 소켓 이벤트 → updateDeliveryInContext → deliveries 변화 감지 → trackingInfo 재조회
  // useDeliverySocket 내부에서 DELIVERY_STATUS_CHANGED 수신 시 updateDeliveryInContext 호출
  // → deliveries 배열이 리렌더링됨 → 추적 중인 배송 ID의 status가 바뀌면 재조회
  // useEffect(() => {
  //   if (!trackingInfo || !trackedNumberRef.current) return;
  //   const matched = deliveries.find((d) => d.id === trackingInfo.id);
  //   if (matched && matched.status !== trackingInfo.status) {
  //     fetchTrackingInfo(trackedNumberRef.current);
  //   }
  // }, [deliveries, trackingInfo, fetchTrackingInfo]);

  // ✅ deliveries 의존성 제거 — trackingInfo만 감지
  useEffect(() => {
    if (!trackingInfo || !trackedNumberRef.current) return;
    // trackingInfo는 별도 쿼리이므로 주기적 갱신으로 대체
  }, [trackingInfo]);

  const handleSearch = async () => {
    if (!deliveryNumber.trim()) {
      toast.error('배송번호를 입력해주세요.');
      return;
    }
    setIsSearching(true);
    trackedNumberRef.current = deliveryNumber.trim();
    try {
      const res = await fetchTrackingInfo(deliveryNumber.trim());
      if (!res.success) {
        toast.error(res.error?.message ?? '배송 정보를 찾을 수 없습니다.');
        trackedNumberRef.current = '';
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

      {/* ✅ socketStatus 활용 — 소켓 연결 상태 배너 */}
      <div
        className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
          isSocketConnected
            ? 'border-primary/30 bg-primary/5 text-primary'
            : socketStatus === 'connecting'
            ? 'border-yellow-300/30 bg-yellow-50 text-yellow-700'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isSocketConnected ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span>
          {isSocketConnected
            ? '실시간 연결됨 — 배송 상태가 자동으로 갱신됩니다.'
            : socketStatus === 'connecting'
            ? '실시간 서버에 연결 중...'
            : '실시간 연결이 끊겼습니다. 재연결 시도 중...'}
        </span>
      </div>

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
