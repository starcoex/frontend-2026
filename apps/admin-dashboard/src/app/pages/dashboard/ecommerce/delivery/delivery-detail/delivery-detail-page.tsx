import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDelivery } from '@starcoex-frontend/delivery';
import { Loader2, Edit3Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import {
  DELIVERY_PRIORITY_CONFIG,
  DELIVERY_STATUS_CONFIG,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DeliverySummaryCards } from './components/delivery-summary-cards';
import { DeliveryInfoCard } from './components/delivery-info-card';
import { DeliveryAddressCard } from './components/delivery-address-card';
import { DeliveryDriverCard } from './components/delivery-driver-card';
import { DeliveryHistoryTab } from './components/delivery-history-tab';

export default function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDelivery, isLoading, error, fetchDeliveryById } =
    useDelivery();

  useEffect(() => {
    if (id) fetchDeliveryById(parseInt(id));
  }, [id, fetchDeliveryById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            배송 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentDelivery) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '배송 정보를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate(DELIVERY_ROUTES.LIST)}>
          배송 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const d = currentDelivery;

  return (
    <>
      <PageHead
        title={`배송 ${d.deliveryNumber} - ${COMPANY_INFO.name}`}
        description="배송 상세 정보를 확인하세요."
        keywords={['배송 상세', d.deliveryNumber, COMPANY_INFO.name]}
        og={{
          title: `배송 ${d.deliveryNumber} - ${COMPANY_INFO.name}`,
          description: '배송 상세 정보',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
              {d.deliveryNumber}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={DELIVERY_STATUS_CONFIG[d.status].variant}>
                {DELIVERY_STATUS_CONFIG[d.status].label}
              </Badge>
              <Badge variant={DELIVERY_PRIORITY_CONFIG[d.priority].variant}>
                {DELIVERY_PRIORITY_CONFIG[d.priority].label}
              </Badge>
              {d.issueReported && (
                <Badge variant="destructive">이슈 발생</Badge>
              )}
            </div>
          </div>
          <Button
            onClick={() =>
              navigate(DELIVERY_ROUTES.EDIT.replace(':id', String(d.id)))
            }
          >
            <Edit3Icon className="mr-2 h-4 w-4" />
            수정
          </Button>
        </div>

        {/* 요약 카드 */}
        <DeliverySummaryCards d={d} />

        {/* 탭 */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              개요
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex-1">
              배달기사
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              상태 이력
              {d.statusHistory.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {d.statusHistory.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <DeliveryInfoCard d={d} />
              <DeliveryAddressCard d={d} />
            </div>
          </TabsContent>

          <TabsContent value="driver" className="mt-4">
            <DeliveryDriverCard d={d} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <DeliveryHistoryTab d={d} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
