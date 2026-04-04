import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDelivery } from '@starcoex-frontend/delivery';
import { Loader2, Edit3Icon, MapPin, Package, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import {
  DELIVERY_PRIORITY_CONFIG,
  DELIVERY_STATUS_CONFIG,
  DRIVER_STATUS_CONFIG,
  formatDeliveryFee,
  formatEstimatedTime,
  VEHICLE_TYPE_CONFIG,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: '배송비',
              value: formatDeliveryFee(d.deliveryFee),
              icon: Package,
            },
            {
              label: '기사 수령액',
              value: formatDeliveryFee(d.driverFee),
              icon: User,
            },
            {
              label: '아이템 수',
              value: `${d.itemCount}개`,
              icon: Package,
            },
            {
              label: '예상 소요시간',
              value: d.estimatedTime
                ? formatEstimatedTime(d.estimatedTime)
                : '-',
              icon: Truck,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-muted hover:border-primary/30 grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4"
            >
              <item.icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  {item.label}
                </span>
                <span className="text-lg font-semibold">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

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

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-2">
              {/* 배송 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle>배송 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">주문 ID</TableCell>
                        <TableCell className="text-right">
                          #{d.orderId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">매장 ID</TableCell>
                        <TableCell className="text-right">
                          #{d.storeId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          요청일시
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {new Date(d.requestedAt).toLocaleString('ko-KR')}
                        </TableCell>
                      </TableRow>
                      {d.acceptedAt && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            수락일시
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {new Date(d.acceptedAt).toLocaleString('ko-KR')}
                          </TableCell>
                        </TableRow>
                      )}
                      {d.pickedUpAt && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            픽업일시
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {new Date(d.pickedUpAt).toLocaleString('ko-KR')}
                          </TableCell>
                        </TableRow>
                      )}
                      {d.deliveredAt && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            완료일시
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {new Date(d.deliveredAt).toLocaleString('ko-KR')}
                          </TableCell>
                        </TableRow>
                      )}
                      {d.totalWeight && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            총 무게
                          </TableCell>
                          <TableCell className="text-right">
                            {d.totalWeight}kg
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-semibold">
                          플랫폼 수수료
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDeliveryFee(d.platformFee)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 주소 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle>주소 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary size-4" />
                      <span className="text-sm font-semibold">픽업 주소</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {(d.pickupAddress as { address?: string }).address ??
                        JSON.stringify(d.pickupAddress)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-destructive size-4" />
                      <span className="text-sm font-semibold">배송 주소</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {(d.deliveryAddress as { address?: string }).address ??
                        JSON.stringify(d.deliveryAddress)}
                    </p>
                  </div>
                  {d.specialInstructions && (
                    <div className="space-y-1">
                      <span className="text-sm font-semibold">
                        특별 지시사항
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {d.specialInstructions}
                      </p>
                    </div>
                  )}
                  {d.customerNotes && (
                    <div className="space-y-1">
                      <span className="text-sm font-semibold">
                        고객 요청사항
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {d.customerNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 배달기사 탭 */}
          <TabsContent value="driver" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>배달기사 정보</CardTitle>
                {d.driver && (
                  <CardAction>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={DELIVERY_ROUTES.DRIVERS}>기사 목록 →</Link>
                    </Button>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent>
                {d.driver ? (
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">이름</TableCell>
                        <TableCell className="text-right">
                          {d.driver.name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          전화번호
                        </TableCell>
                        <TableCell className="text-right">
                          {d.driver.phone}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          차량 타입
                        </TableCell>
                        <TableCell className="text-right">
                          {VEHICLE_TYPE_CONFIG[d.driver.vehicleType].label}
                        </TableCell>
                      </TableRow>
                      {d.driver.vehicleNumber && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            차량번호
                          </TableCell>
                          <TableCell className="text-right">
                            {d.driver.vehicleNumber}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-semibold">
                          가용 상태
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              d.driver.isAvailable ? 'success' : 'secondary'
                            }
                          >
                            {d.driver.isAvailable ? '가용' : '비가용'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          기사 상태
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              DRIVER_STATUS_CONFIG[d.driver.status].variant
                            }
                          >
                            {DRIVER_STATUS_CONFIG[d.driver.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          총 배송 건수
                        </TableCell>
                        <TableCell className="text-right">
                          {d.driver.totalDeliveries}건
                        </TableCell>
                      </TableRow>
                      {d.driver.avgRating && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            평균 평점
                          </TableCell>
                          <TableCell className="text-right">
                            ⭐ {d.driver.avgRating.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-sm">
                      배달기사가 아직 배정되지 않았습니다.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 상태 이력 탭 */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>상태 변경 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {d.statusHistory.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-sm">
                      상태 변경 이력이 없습니다.
                    </p>
                  </div>
                ) : (
                  <ol className="relative border-l border-gray-200 dark:border-gray-700">
                    {d.statusHistory.map((history) => (
                      <li key={history.id} className="mb-6 ml-4">
                        <div className="bg-primary absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white dark:border-gray-900" />
                        <div className="flex items-center gap-2">
                          {history.fromStatus && (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {
                                  DELIVERY_STATUS_CONFIG[history.fromStatus]
                                    .label
                                }
                              </Badge>
                              <span className="text-muted-foreground text-xs">
                                →
                              </span>
                            </>
                          )}
                          <Badge
                            variant={
                              DELIVERY_STATUS_CONFIG[history.toStatus].variant
                            }
                            className="text-xs"
                          >
                            {DELIVERY_STATUS_CONFIG[history.toStatus].label}
                          </Badge>
                        </div>
                        <time className="text-muted-foreground mt-1 block text-xs">
                          {new Date(history.createdAt).toLocaleString('ko-KR')}
                        </time>
                        {history.reason && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {history.reason}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
