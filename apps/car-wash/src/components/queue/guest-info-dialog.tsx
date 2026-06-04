import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { GuestInfo } from '@/hooks/use-guest-queue-modal';

const FormSchema = z.object({
  guestName: z.string().min(1, '이름을 입력하세요.'),
  guestPhone: z.string().min(10, '전화번호를 입력하세요.'),
  guestVehicleNumber: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface GuestInfoDialogProps {
  open: boolean;
  onConfirm: (info: GuestInfo) => void;
  onCancel: () => void;
}

export function GuestInfoDialog({
  open,
  onConfirm,
  onCancel,
}: GuestInfoDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guestName: '',
      guestPhone: '',
      guestVehicleNumber: '',
    },
  });

  function onSubmit(data: FormValues) {
    onConfirm({
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestVehicleNumber: data.guestVehicleNumber || undefined,
    });
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>비회원 접수</DialogTitle>
          <DialogDescription>
            간단한 정보를 입력하시면 대기열에 등록됩니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="guestName"
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
              name="guestPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="010-0000-0000" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guestVehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량번호 (선택)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="12가 3456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                접수하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
