import { useNavigate } from 'react-router-dom';
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
  storeId: z.number({ message: '스토어 ID를 입력하세요.' }).min(1),
  surchargeType: z.string().min(1, '추가금 타입을 선택하세요.'),
  description: z.string().min(1, '설명을 입력하세요.'),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CarCareSurchargeCreatePage() {
  const navigate = useNavigate();
  const { createCarCareSurcharge } = useCarCare();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: undefined,
      surchargeType: '',
      description: '',
      minAmount: undefined,
      maxAmount: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const res = await createCarCareSurcharge({
      storeId: data.storeId,
      surchargeType: data.surchargeType,
      description: data.description,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
    });

    if (res.success) {
      toast.success('추가금 정책이 추가되었습니다.');
      navigate('/admin/car-care/surcharges');
    } else {
      toast.error(res.error?.message ?? '추가에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`추가금 정책 추가 - ${COMPANY_INFO.name}`}
        description="새로운 세차 추가금 정책을 추가하세요."
        keywords={['추가금 정책 추가', COMPANY_INFO.name]}
        og={{
          title: `추가금 정책 추가 - ${COMPANY_INFO.name}`,
          description: '세차 추가금 정책 추가',
          image: '/images/og-car-care.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormPageHeader
              backTo="/admin/car-care/surcharges"
              title="추가금 정책 추가"
              actions={[
                {
                  label: '취소',
                  variant: 'secondary',
                  onClick: () => navigate(-1),
                },
                {
                  label: '추가하기',
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
                          placeholder="스토어 ID"
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
                        <Textarea
                          placeholder="예: 세차전용카드 없으면 2천원 추가"
                          rows={2}
                          {...field}
                        />
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
                            placeholder="0"
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
                        <FormLabel>최대 추가금 (원, 미입력시 고정)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="null이면 고정금액"
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
