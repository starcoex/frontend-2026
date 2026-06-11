import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PageHead, FormPageHeader } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCarCare } from '@starcoex-frontend/vehicles';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  VEHICLE_BODY_TYPE_OPTIONS,
  VEHICLE_SIZE_GRADE_OPTIONS,
  VehicleBodyTypeValue,
  VehicleSizeGradeValue,
} from '@/app/pages/dashboard/ecommerce/vehicles/data/vehicle-data';

const FormSchema = z.object({
  storeId: z.number().min(1),
  serviceTypeCode: z.string().min(1, '서비스 코드를 입력하세요.'),
  bodyType: z.enum(['PASSENGER', 'SUV', 'VAN', 'TRUCK'] as const),
  sizeGrade: z.enum(['S', 'M', 'L', 'XL', 'XXL'] as const),
  price: z.number().min(0, '가격을 입력하세요.'),
  unit: z.string(),
  productId: z.number().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CarCarePriceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prices, currentPrice, updateCarCarePrice } = useCarCare();

  // id로 현재 가격 찾기
  const price =
    prices.find((p) => p.id === parseInt(id ?? '0')) ?? currentPrice;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: price?.storeId ?? 0,
      serviceTypeCode: price?.serviceTypeCode ?? '',
      bodyType: (price?.bodyType as VehicleBodyTypeValue) ?? undefined,
      sizeGrade: (price?.sizeGrade as VehicleSizeGradeValue) ?? undefined,
      price: price?.price ?? 0,
      unit: price?.unit ?? 'WON',
      productId: price?.productId ?? undefined,
    },
  });

  useEffect(() => {
    if (price) {
      form.reset({
        storeId: price.storeId,
        serviceTypeCode: price.serviceTypeCode,
        bodyType: price.bodyType as VehicleBodyTypeValue,
        sizeGrade: price.sizeGrade as VehicleSizeGradeValue,
        price: price.price,
        unit: price.unit,
        productId: price.productId ?? undefined,
      });
    }
  }, [price, form]);

  if (!price) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">가격 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/admin/car-care/prices')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    const res = await updateCarCarePrice(parseInt(id!), {
      storeId: data.storeId,
      serviceTypeCode: data.serviceTypeCode,
      bodyType: data.bodyType as VehicleBodyTypeValue,
      sizeGrade: data.sizeGrade as VehicleSizeGradeValue,
      price: data.price,
      unit: data.unit,
      productId: data.productId,
    });

    if (res.success) {
      toast.success('세차 가격이 수정되었습니다.');
      navigate('/admin/car-care/prices');
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`세차 가격 수정 - ${COMPANY_INFO.name}`}
        description="세차 가격 정책을 수정하세요."
        keywords={['세차 가격 수정', COMPANY_INFO.name]}
        og={{
          title: `세차 가격 수정 - ${COMPANY_INFO.name}`,
          description: '세차 가격 정책 수정',
          image: '/images/og-car-care.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormPageHeader
              backTo="/admin/car-care/prices"
              title="세차 가격 수정"
              subtitle={`#${id}`}
              actions={[
                {
                  label: '취소',
                  variant: 'secondary',
                  onClick: () => navigate(-1),
                },
                {
                  label: '저장하기',
                  loadingLabel: '처리 중...',
                  type: 'submit',
                  isLoading: isSubmitting,
                  disabled: isSubmitting,
                },
              ]}
            />
            <div className="grid gap-4 lg:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>스토어 ID *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
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
                    name="serviceTypeCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>서비스 타입 코드 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: BASIC_WASH, PREMIUM_WASH"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연결 상품 ID (선택)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="상품 ID"
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">차량 등급 및 가격</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>차체 유형 *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="차체 유형 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_BODY_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sizeGrade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사이즈 등급 *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="사이즈 등급 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_SIZE_GRADE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>가격 (원) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
