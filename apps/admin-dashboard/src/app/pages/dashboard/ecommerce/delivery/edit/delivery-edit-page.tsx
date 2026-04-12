import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Search, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery, useDrivers } from '@starcoex-frontend/delivery'; // ✅ useDrivers로 교체
import type {
  Delivery,
  DeliveryStatus,
  DeliveryDriver,
} from '@starcoex-frontend/delivery';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import {
  DELIVERY_STATUS_CONFIG,
  DELIVERY_PRIORITY_CONFIG,
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

const editSchema = z.object({
  status: z.enum([
    'PENDING',
    'DRIVER_ASSIGNED',
    'ACCEPTED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'FAILED',
    'CANCELLED',
    'RETURNED',
  ]),
  specialInstructions: z.string().optional(),
  customerNotes: z.string().optional(),
  driverNotes: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const STATUS_OPTIONS: { value: DeliveryStatus; label: string }[] = [
  { value: 'PENDING', label: '대기' },
  { value: 'DRIVER_ASSIGNED', label: '기사 배정' },
  { value: 'ACCEPTED', label: '수락됨' },
  { value: 'PICKED_UP', label: '픽업 완료' },
  { value: 'IN_TRANSIT', label: '배송 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'FAILED', label: '실패' },
  { value: 'CANCELLED', label: '취소' },
  { value: 'RETURNED', label: '반송' },
];

export default function DeliveryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ 배송 관련 — useDelivery
  const {
    fetchDeliveryById,
    updateDeliveryStatus,
    assignDriver,
    unassignDriver,
  } = useDelivery();

  // ✅ 기사 검색 전용 — useDrivers (useDeliveryDriver 제거)
  const { fetchDrivers } = useDrivers();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // ✅ 검색 결과는 컨텍스트 상태가 아닌 로컬 state로 관리
  const [driverSearch, setDriverSearch] = useState('');
  const [searchedDrivers, setSearchedDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DeliveryDriver | null>(
    null
  );
  const [isDriverSearchOpen, setIsDriverSearchOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    fetchDeliveryById(parseInt(id))
      .then((res) => {
        if (res?.success && res.data) {
          const d = res.data;
          setDelivery(d);
          setSelectedDriver(d.driver ?? null);
          form.reset({
            status: d.status,
            specialInstructions: d.specialInstructions ?? '',
            customerNotes: d.customerNotes ?? '',
            driverNotes: d.driverNotes ?? '',
          });
        }
      })
      .finally(() => setIsFetching(false));
  }, [id, fetchDeliveryById, form]);

  // ✅ fetchDrivers 반환값을 로컬 state에 저장
  const handleDriverSearch = useCallback(async () => {
    const res = await fetchDrivers({
      search: driverSearch.trim() || undefined,
      status: 'ACTIVE',
      isAvailable: true,
      limit: 20,
    });
    if (res.success && res.data) {
      setSearchedDrivers(res.data.drivers);
    }
    setIsDriverSearchOpen(true);
  }, [driverSearch, fetchDrivers]);

  // ✅ assignDriver({ deliveryId, driverId }) 시그니처로 수정
  const handleAssignDriver = async () => {
    if (!delivery || !selectedDriver) return;
    setIsAssigning(true);
    try {
      const res = await assignDriver({
        deliveryId: delivery.id,
        driverId: selectedDriver.id,
      });
      if (res.success && res.data?.delivery) {
        toast.success(`${selectedDriver.name} 기사가 배정되었습니다.`);
        setDelivery(res.data.delivery);
        form.setValue('status', 'DRIVER_ASSIGNED');
        setIsDriverSearchOpen(false);
      } else {
        toast.error(res.error?.message ?? '기사 배정에 실패했습니다.');
      }
    } finally {
      setIsAssigning(false);
    }
  };

  // ✅ unassignDriver({ deliveryId }) 별도 호출로 분리
  const handleUnassignDriver = async () => {
    if (!delivery) return;
    setIsAssigning(true);
    try {
      const res = await unassignDriver({ deliveryId: delivery.id });
      if (res.success && res.data?.delivery) {
        toast.success('배달기사 배정이 해제되었습니다.');
        setDelivery(res.data.delivery);
        setSelectedDriver(null);
        form.setValue('status', 'PENDING');
        setIsDriverSearchOpen(false);
      } else {
        toast.error(res.error?.message ?? '기사 배정 해제에 실패했습니다.');
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const onSubmit = async (data: EditFormValues) => {
    if (!delivery) return;
    if (data.status !== delivery.status) {
      const res = await updateDeliveryStatus(delivery.id, data.status);
      if (!res.success) {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
        return;
      }
    }
    toast.success('배송 정보가 수정되었습니다.');
    navigate(DELIVERY_ROUTES.DETAIL.replace(':id', String(delivery.id)));
  };

  if (isFetching) {
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

  if (!delivery) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">배송 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate(DELIVERY_ROUTES.LIST)}>
          배송 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const currentStatus = form.watch('status');
  const statusChanged = currentStatus !== delivery.status;

  return (
    <>
      <PageHead
        title={`배송 ${delivery.deliveryNumber} 수정 - ${COMPANY_INFO.name}`}
        description="배송 정보를 수정합니다."
        keywords={['배송 수정', delivery.deliveryNumber, COMPANY_INFO.name]}
        og={{
          title: `배송 ${delivery.deliveryNumber} 수정`,
          description: '배송 정보 수정',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate(
                DELIVERY_ROUTES.DETAIL.replace(':id', String(delivery.id))
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {delivery.deliveryNumber} 수정
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={DELIVERY_STATUS_CONFIG[delivery.status].variant}>
                현재: {DELIVERY_STATUS_CONFIG[delivery.status].label}
              </Badge>
              <Badge
                variant={DELIVERY_PRIORITY_CONFIG[delivery.priority].variant}
              >
                {DELIVERY_PRIORITY_CONFIG[delivery.priority].label}
              </Badge>
            </div>
          </div>
        </div>

        {/* 배송 요약 (읽기 전용) */}
        <Card>
          <CardHeader>
            <CardTitle>배송 정보 (읽기 전용)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문 ID</span>
              <span className="font-medium">#{delivery.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">매장 ID</span>
              <span className="font-medium">#{delivery.storeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송비</span>
              <span className="font-medium">
                {formatDeliveryFee(delivery.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">기사 수령액</span>
              <span className="font-medium">
                {formatDeliveryFee(delivery.driverFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">아이템 수</span>
              <span className="font-medium">{delivery.itemCount}개</span>
            </div>
          </CardContent>
        </Card>

        {/* 배달기사 배정 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>배달기사 배정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 현재 배정된 기사 */}
            {selectedDriver ? (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium">{selectedDriver.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {selectedDriver.phone} ·{' '}
                      {VEHICLE_TYPE_CONFIG[selectedDriver.vehicleType].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      DRIVER_STATUS_CONFIG[selectedDriver.status].variant
                    }
                  >
                    {DRIVER_STATUS_CONFIG[selectedDriver.status].label}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUnassignDriver}
                    disabled={isAssigning}
                  >
                    {isAssigning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserX className="h-3.5 w-3.5" />
                    )}
                    <span className="ml-1">배정 해제</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-3">
                <UserX className="text-muted-foreground h-5 w-5" />
                <p className="text-muted-foreground text-sm">
                  배달기사가 배정되지 않았습니다.
                </p>
              </div>
            )}

            {/* 기사 검색 */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                기사 검색 (가용 상태 · ACTIVE)
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="이름 또는 전화번호로 검색"
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDriverSearch();
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDriverSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* ✅ searchedDrivers 로컬 state 사용 */}
              {isDriverSearchOpen && searchedDrivers.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-lg border">
                  {searchedDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      type="button"
                      className="hover:bg-muted flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsDriverSearchOpen(false);
                      }}
                    >
                      <div>
                        <span className="font-medium">{driver.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {driver.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {VEHICLE_TYPE_CONFIG[driver.vehicleType].label}
                        </span>
                        <Badge variant="success" className="text-xs">
                          가용
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isDriverSearchOpen && searchedDrivers.length === 0 && (
                <p className="text-muted-foreground rounded-lg border border-dashed p-3 text-center text-sm">
                  검색 결과가 없습니다.
                </p>
              )}

              {/* 선택 후 배정 버튼 */}
              {selectedDriver && selectedDriver.id !== delivery.driverId && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleAssignDriver}
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  {selectedDriver.name} 기사 배정 확정
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 상태 변경 */}
            <Card>
              <CardHeader>
                <CardTitle>배송 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상태 *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {statusChanged && (
                        <FormDescription className="text-orange-600">
                          {DELIVERY_STATUS_CONFIG[delivery.status].label} →{' '}
                          {
                            DELIVERY_STATUS_CONFIG[
                              currentStatus as DeliveryStatus
                            ]?.label
                          }
                          으로 변경됩니다.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 메모/지시사항 */}
            <Card>
              <CardHeader>
                <CardTitle>메모 및 지시사항</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>특별 지시사항</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="배송 시 특별 주의사항"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>고객 요청사항</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="고객이 요청한 사항"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기사 메모</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="배달기사용 메모"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    DELIVERY_ROUTES.DETAIL.replace(':id', String(delivery.id))
                  )
                }
              >
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '저장'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
