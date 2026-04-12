import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import type { SelectedDriver } from '@starcoex-frontend/common';
import { DriverGqlLicenseVerify } from '@/app/pages/dashboard/ecommerce/delivery/drivers/components/driver-gql-license-verify';

const VEHICLE_TYPES = [
  { value: 'BICYCLE', label: '자전거' },
  { value: 'MOTORCYCLE', label: '오토바이' },
  { value: 'CAR', label: '자동차' },
  { value: 'TRUCK', label: '트럭' },
] as const;

const PAYMENT_TYPES = [
  { value: 'PER_DELIVERY', label: '건당 수수료' },
  { value: 'HOURLY', label: '시급' },
  { value: 'MONTHLY', label: '월급' },
] as const;

const schema = z.object({
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']),
  vehicleNumber: z.string().optional(),
  vehicleModel: z.string().optional(),
  paymentType: z.enum(['PER_DELIVERY', 'HOURLY', 'MONTHLY']),
  ratePerDelivery: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  workingAreas: z.string(),
  maxConcurrentOrders: z.number().min(1).max(10),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  selectedDriver: SelectedDriver | null;
  onSuccess: (driver: DeliveryDriver) => void;
  onCancel: () => void;
}

export function DriverRegisterForm({
  selectedDriver,
  onSuccess,
  onCancel,
}: Props) {
  const { createDeliveryDriver } = useDelivery();

  // ✅ 면허 확인 상태 (등록 전 필수)
  const [verifiedLicenseNumber, setVerifiedLicenseNumber] = useState<
    string | null
  >(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      vehicleType: 'MOTORCYCLE',
      vehicleNumber: '',
      vehicleModel: '',
      paymentType: 'PER_DELIVERY',
      ratePerDelivery: 0,
      hourlyRate: 0,
      workingAreas: '',
      maxConcurrentOrders: 3,
    },
  });

  const paymentType = form.watch('paymentType');

  const handleLicenseVerified = (licenseNumber: string) => {
    setVerifiedLicenseNumber(licenseNumber);
    toast.success('면허 진위 확인 완료! 이제 기사를 등록할 수 있습니다.');
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedDriver) {
      toast.error('배달기사 유저를 먼저 검색하여 선택해주세요.');
      return;
    }
    if (!verifiedLicenseNumber) {
      toast.error('운전면허 진위 확인을 먼저 완료해주세요.');
      return;
    }

    const workingAreasArray = data.workingAreas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await createDeliveryDriver({
      userId: selectedDriver.userId,
      name: selectedDriver.name,
      phone: selectedDriver.phone,
      email: selectedDriver.email,
      licenseNumber: verifiedLicenseNumber, // ✅ 진위 확인된 번호 자동 입력
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber || undefined,
      vehicleModel: data.vehicleModel || undefined,
      paymentType: data.paymentType,
      ratePerDelivery:
        data.paymentType === 'PER_DELIVERY' ? data.ratePerDelivery : undefined,
      hourlyRate: data.paymentType === 'HOURLY' ? data.hourlyRate : undefined,
      workingAreas: workingAreasArray,
      maxConcurrentOrders: data.maxConcurrentOrders,
    });

    if (res.success && res.data?.driver) {
      toast.success(res.data.creationMessage ?? '기사가 등록되었습니다.');
      form.reset();
      onSuccess(res.data.driver);
    } else {
      toast.error(res.error?.message ?? '기사 등록에 실패했습니다.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="license">
          <TabsList className="w-full">
            {/* ✅ 면허 확인이 첫 번째 탭 */}
            <TabsTrigger value="license" className="flex-1">
              면허 확인
              {verifiedLicenseNumber ? (
                <span className="ml-1.5 text-xs">✅</span>
              ) : (
                <span className="ml-1.5 text-xs text-destructive">*필수</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="flex-1">
              차량 정보
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">
              정산 정보
            </TabsTrigger>
            <TabsTrigger value="work" className="flex-1">
              근무 설정
            </TabsTrigger>
          </TabsList>

          {/* ✅ 면허 확인 탭 — 첫 번째 */}
          <TabsContent value="license" className="space-y-4 pt-4">
            {/* 선택된 유저 정보 표시 */}
            {selectedDriver && (
              <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                <p className="font-medium">등록 대상 유저</p>
                <p className="text-muted-foreground">
                  이름: {selectedDriver.name}
                </p>
                <p className="text-muted-foreground">
                  전화: {selectedDriver.phone}
                </p>
                {selectedDriver.email && (
                  <p className="text-muted-foreground">
                    이메일: {selectedDriver.email}
                  </p>
                )}
              </div>
            )}

            {/* 면허 확인 완료 표시 */}
            {verifiedLicenseNumber ? (
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    면허 진위 확인 완료
                  </p>
                  <p className="font-mono text-xs text-green-700">
                    {verifiedLicenseNumber}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="ml-auto cursor-pointer border-green-300 text-green-700"
                  onClick={() => setVerifiedLicenseNumber(null)}
                >
                  재확인
                </Badge>
              </div>
            ) : (
              // ✅ driverId 없이 면허 확인: 등록 전이므로 userId를 임시로 전달
              // 백엔드에서 driverId가 필수라면 0 또는 -1로 처리 후 등록 시 업데이트
              // → 백엔드와 협의하여 pre-verify 방식 사용 권장
              <DriverGqlLicenseVerify
                driverId={0} // ✅ 등록 전이므로 임시값 (백엔드 협의 필요)
                onVerified={handleLicenseVerified}
                preVerifyMode // ✅ 등록 전 확인 모드 prop 추가
              />
            )}
          </TabsContent>

          {/* 차량 정보 탭 */}
          <TabsContent value="vehicle" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>차량 타입 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
          </TabsContent>

          {/* 정산 정보 탭 */}
          <TabsContent value="payment" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정산 방식 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {PAYMENT_TYPES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {paymentType === 'PER_DELIVERY' && (
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
                    <FormDescription>배달 1건당 지급할 금액</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {paymentType === 'HOURLY' && (
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시급 (원)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="12000"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>

          {/* 근무 설정 탭 */}
          <TabsContent value="work" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="workingAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>근무 지역</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="제주시, 서귀포시, 애월읍" />
                  </FormControl>
                  <FormDescription>
                    콤마(,)로 구분 — 예: 제주시, 서귀포시
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxConcurrentOrders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>동시 배송 최대 건수</FormLabel>
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
                  <FormDescription>
                    한 번에 처리 가능한 최대 배송 건수 (1~10)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              !selectedDriver ||
              !verifiedLicenseNumber // ✅ 면허 확인 완료 전 등록 버튼 비활성화
            }
          >
            {form.formState.isSubmitting ? '등록 중...' : '등록'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
