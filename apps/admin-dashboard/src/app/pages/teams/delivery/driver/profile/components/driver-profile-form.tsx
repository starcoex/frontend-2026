import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VEHICLE_TYPE_CONFIG } from '@/app/pages/teams/delivery/driver/data/driver-data';

// ── 스키마 (UpdateDriverProfileInput 기반) ────────────────────────────────────
const DriverProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().min(9, '올바른 전화번호를 입력해주세요.'),
  email: z
    .string()
    .email('올바른 이메일을 입력해주세요.')
    .optional()
    .or(z.literal('')),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']),
  vehicleNumber: z.string().optional(),
  vehicleModel: z.string().optional(),
});

type DriverProfileValues = z.infer<typeof DriverProfileSchema>;

interface DriverProfileFormProps {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

export function DriverProfileForm({
  driver,
  onUpdated,
}: DriverProfileFormProps) {
  const { updateDriverProfile } = useDelivery();

  const form = useForm<DriverProfileValues>({
    resolver: zodResolver(DriverProfileSchema),
    defaultValues: {
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? '',
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber ?? '',
      vehicleModel: driver.vehicleModel ?? '',
    },
  });

  // driver 변경 시 폼 초기화 (프로필 새로고침 후 반영)
  useEffect(() => {
    form.reset({
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? '',
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber ?? '',
      vehicleModel: driver.vehicleModel ?? '',
    });
  }, [driver, form]);

  const onSubmit = async (values: DriverProfileValues) => {
    const res = await updateDriverProfile({
      driverId: driver.id,
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      vehicleType: values.vehicleType,
      vehicleNumber: values.vehicleNumber || undefined,
      vehicleModel: values.vehicleModel || undefined,
    });

    if (res.success && res.data?.driver) {
      toast.success('프로필이 수정되었습니다.');
      onUpdated(res.data.driver);
    } else {
      toast.error(res.error?.message ?? '프로필 수정에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 이름 */}
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

            {/* 전화번호 */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="010-0000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="example@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">차량 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 차량 타입 */}
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량 종류 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="차량 종류 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(VEHICLE_TYPE_CONFIG).map(
                          ([value, { label }]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 차량 번호 */}
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

            {/* 차량 모델 */}
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량 모델</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="혼다 PCX 125" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              저장하기
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
