import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Payment, usePayments } from '@starcoex-frontend/payments';
import { formatAmount } from '../data/payment-data';

const schema = z.object({
  cancellationId: z.string().min(1, '취소 ID를 입력하세요.'),
  reason: z.string().optional(),
  cancelledAmount: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CancelPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  onSuccess: () => void;
}

export function CancelPaymentDialog({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: CancelPaymentDialogProps) {
  const { cancelPayment } = usePayments();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cancellationId: '',
      reason: '',
      cancelledAmount: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const success = await cancelPayment({
      cancellationId: data.cancellationId,
      paymentPortOneId: payment.portOneId,
      reason: data.reason || undefined,
      cancelledAmount: data.cancelledAmount,
    });

    if (success) {
      toast.success('결제 취소가 완료되었습니다.');
      onOpenChange(false);
      onSuccess();
      form.reset();
    } else {
      toast.error('결제 취소에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>결제 취소</DialogTitle>
        </DialogHeader>

        <div className="bg-muted rounded-md px-4 py-3 text-sm">
          <p className="font-medium">{payment.orderName}</p>
          <p className="text-muted-foreground mt-0.5">
            결제 금액: {formatAmount(payment.amount, payment.currency)}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cancellationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>취소 ID *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="고유 취소 ID를 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cancelledAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    취소 금액{' '}
                    <span className="text-muted-foreground font-normal text-xs">
                      (미입력 시 전액 취소)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`최대 ${payment.amount.toLocaleString()}원`}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>취소 사유</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="취소 사유를 입력하세요 (선택)"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                닫기
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                취소 처리
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
