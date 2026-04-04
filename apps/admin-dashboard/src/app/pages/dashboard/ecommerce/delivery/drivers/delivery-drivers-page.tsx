import { useEffect, useState } from 'react';
import {
  LoadingSpinner,
  ErrorAlert,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
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
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Search, PlusCircle, Power, PowerOff } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'BICYCLE', label: '자전거' },
  { value: 'MOTORCYCLE', label: '오토바이' },
  { value: 'CAR', label: '자동차' },
  { value: 'TRUCK', label: '트럭' },
] as const;

const DRIVER_STATUS_CONFIG: Record<
  DeliveryDriver['status'],
  {
    label: string;
    variant:
      | 'default'
      | 'outline'
      | 'destructive'
      | 'warning'
      | 'secondary'
      | 'success';
  }
> = {
  PENDING: { label: '대기', variant: 'outline' },
  ACTIVE: { label: '활성', variant: 'success' },
  INACTIVE: { label: '비활성', variant: 'secondary' },
  SUSPENDED: { label: '정지', variant: 'warning' },
  TERMINATED: { label: '해지', variant: 'destructive' },
};

const createDriverSchema = z.object({
  userId: z.number({ message: '사용자 ID를 입력해주세요.' }).min(1),
  driverCode: z
    .string()
    .min(2, { message: '기사 코드는 최소 2자 이상이어야 합니다.' }),
  name: z.string().min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }),
  phone: z.string().min(10, { message: '전화번호를 입력해주세요.' }),
  email: z
    .string()
    .email({ message: '이메일 형식이 올바르지 않습니다.' })
    .optional()
    .or(z.literal('')),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']),
  vehicleNumber: z.string().optional(),
  paymentType: z.enum(['PER_DELIVERY', 'HOURLY', 'MONTHLY']),
  ratePerDelivery: z.number().min(0).optional(),
  maxConcurrentOrders: z.number().min(1).max(10),
});

type CreateDriverForm = z.infer<typeof createDriverSchema>;

export default function DeliveryDriversPage() {
  const {
    isLoading,
    error,
    createDeliveryDriver,
    updateDriverAvailability,
    deactivateDriver,
    fetchDeliveries,
  } = useDelivery();

  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // 드라이버 목록은 배송 데이터에서 추출 (별도 listDrivers API 없음)
  useEffect(() => {
    fetchDeliveries({ includeDriver: true }).then((res) => {
      if (res?.success && res.data) {
        const driverMap = new Map<number, DeliveryDriver>();
        res.data.deliveries.forEach((d) => {
          if (d.driver) driverMap.set(d.driver.id, d.driver);
        });
        setDrivers(Array.from(driverMap.values()));
      }
    });
  }, [fetchDeliveries]);

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.driverCode.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const form = useForm<CreateDriverForm>({
    resolver: zodResolver(createDriverSchema),
    mode: 'onChange',
    defaultValues: {
      userId: undefined,
      driverCode: '',
      name: '',
      phone: '',
      email: '',
      vehicleType: 'MOTORCYCLE',
      vehicleNumber: '',
      paymentType: 'PER_DELIVERY',
      ratePerDelivery: 0,
      maxConcurrentOrders: 3,
    },
  });

  const handleCreate = async (data: CreateDriverForm) => {
    const res = await createDeliveryDriver({
      userId: data.userId,
      driverCode: data.driverCode,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber || undefined,
      paymentType: data.paymentType,
      ratePerDelivery: data.ratePerDelivery,
      maxConcurrentOrders: data.maxConcurrentOrders,
      workingAreas: [],
    });
    if (res.success && res.data?.driver) {
      toast.success(res.data.creationMessage ?? '기사가 등록되었습니다.');
      setDrivers((prev) => [...prev, res.data!.driver!]);
      form.reset();
      setCreateOpen(false);
    } else {
      toast.error(res.error?.message ?? '기사 등록에 실패했습니다.');
    }
  };

  const handleToggleAvailability = async (
    driverId: number,
    current: boolean
  ) => {
    const res = await updateDriverAvailability(driverId, !current);
    if (res.success && res.data) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId ? { ...d, isAvailable: res.data!.isAvailable } : d
        )
      );
      toast.success('가용 상태가 변경되었습니다.');
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  const handleDeactivate = async (driverId: number) => {
    const res = await deactivateDriver(driverId);
    if (res.success) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, status: 'INACTIVE' } : d))
      );
      toast.success('기사가 비활성화되었습니다.');
    } else {
      toast.error(res.error?.message ?? '비활성화에 실패했습니다.');
    }
  };

  if (isLoading)
    return <LoadingSpinner message="기사 데이터를 불러오는 중..." />;

  return (
    <>
      <PageHead
        title={`배달기사 관리 - ${COMPANY_INFO.name}`}
        description="배달기사를 등록하고 관리하세요."
        keywords={['배달기사', '기사 관리', COMPANY_INFO.name]}
        og={{
          title: `배달기사 관리 - ${COMPANY_INFO.name}`,
          description: '배달기사 등록 및 관리 시스템',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {error && (
          <ErrorAlert error={error} onRetry={() => fetchDeliveries()} />
        )}

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: '전체 기사', value: drivers.length },
            {
              label: '활성 기사',
              value: drivers.filter((d) => d.status === 'ACTIVE').length,
            },
            {
              label: '현재 가용',
              value: drivers.filter((d) => d.isAvailable).length,
            },
            {
              label: '평균 평점',
              value:
                drivers.length > 0
                  ? (
                      drivers.reduce((sum, d) => sum + (d.avgRating ?? 0), 0) /
                      drivers.length
                    ).toFixed(1)
                  : '-',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* 검색 + 추가 버튼 */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
            <Input
              placeholder="이름, 코드, 전화번호 검색..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            기사 등록
          </Button>
        </div>

        {/* 기사 테이블 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>기사 정보</TableHead>
                <TableHead>차량</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가용</TableHead>
                <TableHead className="text-right">총 배송</TableHead>
                <TableHead className="text-right">평점</TableHead>
                <TableHead className="w-[120px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground h-24 text-center"
                  >
                    등록된 배달기사가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-muted-foreground font-mono text-xs">
                          {driver.driverCode}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {driver.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{driver.vehicleType}</p>
                        {driver.vehicleNumber && (
                          <p className="text-muted-foreground font-mono text-xs">
                            {driver.vehicleNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={DRIVER_STATUS_CONFIG[driver.status].variant}
                      >
                        {DRIVER_STATUS_CONFIG[driver.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={driver.isAvailable}
                        onCheckedChange={() =>
                          handleToggleAvailability(
                            driver.id,
                            driver.isAvailable
                          )
                        }
                        disabled={driver.status !== 'ACTIVE'}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {driver.totalDeliveries}건
                    </TableCell>
                    <TableCell className="text-right">
                      {driver.avgRating
                        ? `⭐ ${driver.avgRating.toFixed(1)}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={driver.status === 'INACTIVE'}
                        onClick={() => handleDeactivate(driver.id)}
                        title="비활성화"
                      >
                        {driver.status === 'ACTIVE' ? (
                          <PowerOff className="h-4 w-4 text-destructive" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 기사 등록 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>배달기사 등록</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사용자 ID *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="사용자 ID"
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기사 코드 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="DRV-001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>차량번호</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12가 3456" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ratePerDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>건당 수수료 (원)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          placeholder="3000"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxConcurrentOrders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>동시 배송 최대</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          max={10}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 3)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? '등록 중...' : '등록'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
