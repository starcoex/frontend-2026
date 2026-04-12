import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type {
  DeliveryDriver,
  DriverStatus,
  VehicleType,
} from '@starcoex-frontend/delivery';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import { DRIVER_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

const STATUS_OPTIONS: { value: DriverStatus; label: string }[] = [
  { value: 'PENDING', label: '승인 대기' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
  { value: 'SUSPENDED', label: '정지' },
  { value: 'TERMINATED', label: '해지' },
];

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'BICYCLE', label: '자전거' },
  { value: 'MOTORCYCLE', label: '오토바이' },
  { value: 'CAR', label: '자동차' },
  { value: 'TRUCK', label: '트럭' },
];

const editSchema = z.object({
  // 프로필 수정 (UpdateDriverProfileInput)
  name: z.string().min(2, '이름은 2자 이상 입력하세요.'),
  phone: z.string().min(10, '전화번호를 입력하세요.'),
  email: z.string().email().optional().or(z.literal('')),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']), // ✅ 추가
  vehicleNumber: z.string().optional(),
  vehicleModel: z.string().optional(),
  workingAreas: z.string(),
  // 상태 변경 (UpdateDriverStatusInput)
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED']),
  statusReason: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function DeliveryDriverEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchDriverById, updateDriverProfile, updateDriverStatus } =
    useDelivery();

  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    fetchDriverById(parseInt(id))
      .then((res) => {
        if (res?.success && res.data) {
          const d = res.data;
          setDriver(d);
          form.reset({
            name: d.name,
            phone: d.phone,
            email: d.email ?? '',
            vehicleType: d.vehicleType, // ✅ 추가
            vehicleNumber: d.vehicleNumber ?? '',
            vehicleModel: d.vehicleModel ?? '',
            workingAreas: ((d.workingAreas as unknown as string[]) ?? []).join(
              ', '
            ),
            status: d.status,
            statusReason: '',
          });
        }
      })
      .finally(() => setIsFetching(false));
  }, [id, fetchDriverById, form]);

  const onSubmit = async (data: EditFormValues) => {
    if (!driver) return;

    const workingAreas = data.workingAreas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // 1. 프로필 수정
    const profileRes = await updateDriverProfile({
      driverId: driver.id,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      vehicleType: data.vehicleType, // ✅ 추가
      vehicleNumber: data.vehicleNumber || undefined,
      vehicleModel: data.vehicleModel || undefined,
      workingAreas,
    });

    if (!profileRes.success) {
      toast.error(profileRes.error?.message ?? '프로필 수정에 실패했습니다.');
      return;
    }

    // 2. 상태가 변경된 경우에만 상태 변경 API 호출
    if (data.status !== driver.status) {
      const statusRes = await updateDriverStatus({
        driverId: driver.id,
        status: data.status,
        reason: data.statusReason || undefined,
      });

      if (!statusRes.success) {
        toast.error(statusRes.error?.message ?? '상태 변경에 실패했습니다.');
        return;
      }
    }

    toast.success('기사 정보가 수정되었습니다.');
    navigate(`${DELIVERY_ROUTES.DRIVERS}/${driver.id}`);
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            기사 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">기사 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate(DELIVERY_ROUTES.DRIVERS)}>
          기사 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const currentStatus = form.watch('status');
  const statusChanged = currentStatus !== driver.status;

  return (
    <>
      <PageHead
        title={`${driver.name} 수정 - ${COMPANY_INFO.name}`}
        description="배달기사 정보를 수정합니다."
        keywords={['배달기사 수정', driver.name, COMPANY_INFO.name]}
        og={{
          title: `${driver.name} 수정`,
          description: '배달기사 정보 수정',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{driver.name} 수정</h1>
            <p className="text-muted-foreground font-mono text-sm">
              {driver.driverCode}
            </p>
          </div>
          <Badge variant={DRIVER_STATUS_CONFIG[driver.status].variant}>
            현재: {DRIVER_STATUS_CONFIG[driver.status].label}
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="홍길동" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="010-1234-5678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 차량 정보 카드에 vehicleType 추가 */}
            <Card>
              <CardHeader>
                <CardTitle>차량 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* ✅ 차량 타입 Select 추가 */}
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>차량 타입 *</FormLabel>
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
                              {VEHICLE_TYPES.map((v) => (
                                <SelectItem key={v.value} value={v.value}>
                                  {v.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>차량 번호</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12가 3456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>차량 모델</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="혼다 PCX 125" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 근무 지역 */}
            <Card>
              <CardHeader>
                <CardTitle>근무 지역</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="workingAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="제주시, 서귀포시, 애월읍"
                        />
                      </FormControl>
                      <FormDescription>콤마(,)로 구분하여 입력</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 상태 변경 */}
            <Card>
              <CardHeader>
                <CardTitle>기사 상태</CardTitle>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 상태 변경 시 사유 입력 */}
                {statusChanged && (
                  <>
                    <Separator />
                    <FormField
                      control={form.control}
                      name="statusReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            상태 변경 사유
                            <span className="text-muted-foreground ml-1 text-xs">
                              (선택)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="상태 변경 사유를 입력하세요."
                            />
                          </FormControl>
                          <FormDescription>
                            {driver.status} → {currentStatus} 변경 사유
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* 저장/취소 */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(`${DELIVERY_ROUTES.DRIVERS}/${driver.id}`)
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
