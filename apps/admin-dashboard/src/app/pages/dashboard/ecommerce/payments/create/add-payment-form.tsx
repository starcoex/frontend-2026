import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, CreditCard, FileText, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayments } from '@starcoex-frontend/payments';

// ── 유틸: 수동 결제 ID 자동 생성 ─────────────────────────────────────────────

const generateManualPaymentId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `MANUAL-${timestamp}-${random}`;
};

// ── Zod 스키마 ────────────────────────────────────────────────────────────────

const FormSchema = z.object({
  portOneId: z.string().min(1, '결제 ID를 입력하세요.'),
  orderName: z.string().min(1, '주문명을 입력하세요.'),
  amount: z
    .number({ message: '금액을 입력하세요.' })
    .min(1, '1원 이상 입력하세요.'),
  currency: z.string().min(1),
  reservationId: z.number().optional(),
  orderId: z.number().optional(),
  userId: z.number().optional(),
  guestEmail: z
    .string()
    .email('올바른 이메일을 입력하세요.')
    .optional()
    .or(z.literal('')),
});

type FormValues = z.infer<typeof FormSchema>;

// ── 폼 컴포넌트 ───────────────────────────────────────────────────────────────

export function AddPaymentForm() {
  const navigate = useNavigate();
  const { createPayment, isSubmitting } = usePayments();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      portOneId: generateManualPaymentId(),
      orderName: '',
      amount: 0,
      currency: 'KRW',
      reservationId: undefined,
      orderId: undefined,
      userId: undefined,
      guestEmail: '',
    },
  });

  async function onSubmit(data: FormValues) {
    const res = await createPayment({
      portOneId: data.portOneId,
      orderName: data.orderName,
      amount: data.amount,
      currency: data.currency,
      reservationId: data.reservationId,
      orderId: data.orderId,
      userId: data.userId,
      guestEmail: data.guestEmail || undefined,
    });

    if (res.success) {
      toast.success('결제가 등록되었습니다.');
      navigate('/admin/payments');
    } else {
      toast.error(res.error?.message ?? '결제 등록에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ── 헤더 ── */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/payments">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">결제 등록</h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '등록하기'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* ── 좌측: 결제 기본 정보 ── */}
          <div className="space-y-4 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-4 opacity-60" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="portOneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>결제 ID *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="font-mono text-sm"
                          placeholder="MANUAL-..."
                        />
                      </FormControl>
                      <FormDescription>
                        수동 결제 시 자동 생성됩니다. 포트원 결제 ID와 중복되지
                        않아야 합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주문명 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="예: 세차 서비스 현장 결제"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>결제 금액 (원) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="10000"
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : 0
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
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>통화</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="KRW" />
                        </FormControl>
                        <FormDescription>기본값: KRW</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── 우측: 연결 정보 ── */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-4 opacity-60" />
                  연결 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="reservationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>예약 ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="예약 ID (선택)"
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
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주문 ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="주문 ID (선택)"
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
                <CardTitle className="flex items-center gap-2">
                  <User className="size-4 opacity-60" />
                  고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사용자 ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="회원 ID (선택)"
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
                      <FormDescription>
                        회원 결제 시 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비회원 이메일</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="guest@example.com"
                        />
                      </FormControl>
                      <FormDescription>
                        비회원 결제 시 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
