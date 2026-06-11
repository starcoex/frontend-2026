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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CAR_CARE_SURCHARGE_TYPE_OPTIONS } from '@/app/pages/dashboard/ecommerce/vehicles/data/car-care-data';

const FormSchema = z.object({
  storeId: z.number().min(1),
  surchargeType: z.string().min(1, '추가금 타입을 선택하세요.'),
  description: z.string().min(1, '설명을 입력하세요.'),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CarCareSurchargeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { surcharges, updateCarCareSurcharge } = useCarCare();

  const surcharge = surcharges.find((s) => s.id === parseInt(id ?? '0'));

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: surcharge?.storeId ?? 0,
      surchargeType: surcharge?.surchargeType ?? '',
      description: surcharge?.description ?? '',
      minAmount: surcharge?.minAmount ?? undefined,
      maxAmount: surcharge?.maxAmount ?? undefined,
    },
  });

  useEffect(() => {
    if (surcharge) {
      form.reset({
        storeId: surcharge.storeId,
        surchargeType: surcharge.surchargeType,
        description: surcharge.description,
        minAmount: surcharge.minAmount ?? undefined,
        maxAmount: surcharge.maxAmount ?? undefined,
      });
    }
  }, [surcharge, form]);

  if (!surcharge) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">추가금 정책을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/admin/car-care/surcharges')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    const res = await updateCarCareSurcharge({
      id: parseInt(id!),
      storeId: data.storeId,
      surchargeType: data.surchargeType,
      description: data.description,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
    });

    if (res.success) {
      toast.success('추가금 정책이 수정되었습니다.');
      navigate('/admin/car-care/surcharges');
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`추가금 정책 수정 - ${COMPANY_INFO.name}`}
        description="세차 추가금 정책을 수정하세요."
        keywords={['추가금 수정', COMPANY_INFO.name]}
        og={{
          title: `추가금 정책 수정 - ${COMPANY_INFO.name}`,
          description: '세차 추가금 정책 수정',
          image: '/images/og-car-care.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormPageHeader
              backTo="/admin/car-care/surcharges"
              title="추가금 정책 수정"
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
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">추가금 정책 정보</CardTitle>
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
                  name="surchargeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가금 타입 *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="타입 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAR_CARE_SURCHARGE_TYPE_OPTIONS.map((opt) => (
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명 *</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>최소 추가금 (원)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
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
                  <FormField
                    control={form.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>최대 추가금 (원)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
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
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}
