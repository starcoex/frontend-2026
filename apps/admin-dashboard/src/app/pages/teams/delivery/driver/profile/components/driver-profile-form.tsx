import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save, X, Plus } from 'lucide-react';
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
  FormDescription,
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VEHICLE_TYPE_CONFIG } from '@/app/pages/teams/delivery/driver/data/driver-data';
import {
  DriverProfileSchema,
  type DriverProfileFormValues,
} from '../driver-profile-form.schema';

interface DriverProfileFormProps {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

// workingAreas JSON → string[] 변환 헬퍼
function parseWorkingAreas(raw: Record<string, unknown> | unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v) => typeof v === 'string');
  return [];
}

export function DriverProfileForm({
  driver,
  onUpdated,
}: DriverProfileFormProps) {
  const { updateDriverProfile } = useDelivery();
  const [areaInput, setAreaInput] = useState('');
  const areaInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DriverProfileFormValues>({
    resolver: zodResolver(DriverProfileSchema),
    defaultValues: {
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? '',
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber ?? '',
      vehicleModel: driver.vehicleModel ?? '',
      workingAreas: parseWorkingAreas(driver.workingAreas),
    },
  });

  // driver 변경 시 폼 초기화
  useEffect(() => {
    form.reset({
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? '',
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber ?? '',
      vehicleModel: driver.vehicleModel ?? '',
      workingAreas: parseWorkingAreas(driver.workingAreas),
    });
  }, [driver, form]);

  // ── 지역 태그 추가 ────────────────────────────────────────────────────────────
  const handleAddArea = () => {
    const trimmed = areaInput.trim();
    if (!trimmed) return;
    const current = form.getValues('workingAreas');
    if (current.includes(trimmed)) {
      toast.info('이미 추가된 지역입니다.');
      return;
    }
    form.setValue('workingAreas', [...current, trimmed], {
      shouldValidate: true,
    });
    setAreaInput('');
    areaInputRef.current?.focus();
  };

  const handleRemoveArea = (area: string) => {
    const current = form.getValues('workingAreas');
    form.setValue(
      'workingAreas',
      current.filter((a) => a !== area),
      { shouldValidate: true }
    );
  };

  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddArea();
    }
  };

  // ── 저장 ─────────────────────────────────────────────────────────────────────
  const onSubmit = async (values: DriverProfileFormValues) => {
    const res = await updateDriverProfile({
      driverId: driver.id,
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      vehicleType: values.vehicleType,
      vehicleNumber: values.vehicleNumber || undefined,
      vehicleModel: values.vehicleModel || undefined,
      workingAreas: values.workingAreas,
    });

    if (res.success && res.data?.driver) {
      toast.success('프로필이 수정되었습니다.');
      onUpdated(res.data.driver);
    } else {
      toast.error(res.error?.message ?? '프로필 수정에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const watchedAreas = form.watch('workingAreas');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ── 기본 정보 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <Input {...field} placeholder="010-0000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

        {/* ── 차량 정보 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">차량 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* ── 담당 지역 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">담당 지역</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="workingAreas"
              render={() => (
                <FormItem>
                  <FormLabel>배송 가능 지역 *</FormLabel>
                  <FormDescription>
                    지역명을 입력하고 Enter 또는 추가 버튼을 누르세요.
                    <br />
                    예: 제주시, 서귀포시 중앙동
                  </FormDescription>

                  {/* 입력 행 */}
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        ref={areaInputRef}
                        value={areaInput}
                        onChange={(e) => setAreaInput(e.target.value)}
                        onKeyDown={handleAreaKeyDown}
                        placeholder="예: 제주시"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddArea}
                      disabled={!areaInput.trim()}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      추가
                    </Button>
                  </div>

                  {/* 태그 목록 */}
                  {watchedAreas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {watchedAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => handleRemoveArea(area)}
                            className="hover:text-destructive ml-0.5 rounded-full"
                            aria-label={`${area} 제거`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

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
