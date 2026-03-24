import { useForm, useFieldArray } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '@starcoex-frontend/reservations';

const schema = z.object({
  name: z.string().min(1, '정책 이름을 입력하세요.'),
  description: z.string().optional(),
  allowRefund: z.boolean(),
  minimumRefundAmount: z.number().min(0),
  refundFee: z.number().min(0),
  refundRules: z
    .array(
      z.object({
        hoursBeforeService: z.number().min(0, '0 이상이어야 합니다.'),
        refundRate: z.number().min(0).max(1, '0~1 사이여야 합니다.'),
      })
    )
    .min(1, '환불 규칙을 1개 이상 추가하세요.'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RefundPolicyCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { createRefundPolicy } = useReservations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      allowRefund: true,
      minimumRefundAmount: 0,
      refundFee: 0,
      refundRules: [
        { hoursBeforeService: 24, refundRate: 1.0 },
        { hoursBeforeService: 2, refundRate: 0.5 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'refundRules',
  });

  const onSubmit = async (data: FormValues) => {
    const res = await createRefundPolicy({
      name: data.name,
      description: data.description,
      allowRefund: data.allowRefund,
      minimumRefundAmount: data.minimumRefundAmount,
      refundFee: data.refundFee,
      refundRules: data.refundRules,
    });

    if (res.success) {
      toast.success('환불 정책이 생성되었습니다.');
      onOpenChange(false);
      onSuccess();
      form.reset();
    } else {
      toast.error(res.error?.message ?? '생성에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>환불 정책 추가</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정책 이름 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 기본 환불 정책" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="정책 설명을 입력하세요"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minimumRefundAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 환불 금액 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="refundFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>환불 수수료 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allowRefund"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                  <FormLabel className="cursor-pointer">환불 허용</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 환불 규칙 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>환불 규칙 *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ hoursBeforeService: 0, refundRate: 1.0 })
                  }
                >
                  <Plus className="mr-1 size-3" />
                  규칙 추가
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                서비스 시작 N시간 전 취소 시 환불율 (0=0%, 1=100%)
              </p>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-end gap-2 rounded-md border p-3"
                >
                  <FormField
                    control={form.control}
                    name={`refundRules.${index}.hoursBeforeService`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">N시간 전</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`refundRules.${index}.refundRate`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">환불율 (0~1)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 size-9 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {form.formState.errors.refundRules?.root && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.refundRules.root.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                생성
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
