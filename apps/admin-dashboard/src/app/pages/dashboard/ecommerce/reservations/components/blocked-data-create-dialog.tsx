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
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '@starcoex-frontend/reservations';

const schema = z
  .object({
    date: z.string().min(1, '날짜를 선택하세요.'),
    reason: z.string().optional(),
    isFullDay: z.boolean(),
    blockedStartTime: z.string().optional(),
    blockedEndTime: z.string().optional(),
  })
  .refine((d) => d.isFullDay || (!!d.blockedStartTime && !!d.blockedEndTime), {
    message: '부분 휴무 시 시작/종료 시간을 입력하세요.',
    path: ['blockedStartTime'],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number;
  onSuccess: () => void;
}

export function BlockedDateCreateDialog({
  open,
  onOpenChange,
  serviceId,
  onSuccess,
}: Props) {
  const { createScheduleBlockedDate } = useReservations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: '',
      reason: '',
      isFullDay: true,
      blockedStartTime: '',
      blockedEndTime: '',
    },
  });

  const isFullDay = form.watch('isFullDay');

  const onSubmit = async (data: FormValues) => {
    const res = await createScheduleBlockedDate({
      serviceId,
      date: data.date,
      reason: data.reason || undefined,
      isFullDay: data.isFullDay,
      blockedStartTime: data.isFullDay ? undefined : data.blockedStartTime,
      blockedEndTime: data.isFullDay ? undefined : data.blockedEndTime,
    });

    if (res.success) {
      toast.success('휴무일이 등록되었습니다.');
      onOpenChange(false);
      onSuccess();
      form.reset();
    } else {
      toast.error(res.error?.message ?? '휴무일 등록에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>휴무일 추가</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>날짜 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>사유</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 추석 연휴, 시설 점검" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFullDay"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                  <FormLabel className="cursor-pointer">종일 휴무</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isFullDay && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="blockedStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시작 시간</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockedEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종료 시간</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
                등록
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
