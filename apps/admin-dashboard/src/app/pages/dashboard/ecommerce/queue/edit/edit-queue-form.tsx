import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { User, Car, Info } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQueue } from '@starcoex-frontend/queue';
import type { QueueSession } from '@starcoex-frontend/queue';
import { FormPageHeader } from '@starcoex-frontend/common';
import { QueueStatusBadge } from '../components/queue-status-badge';
import type { QueueStatusValue } from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ── Zod 스키마 — 스키마 기준 필드만 ──────────────────────────────────────────
const FormSchema = z.object({
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestVehicleNumber: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditQueueForm({ session }: { session: QueueSession }) {
  const navigate = useNavigate();
  const { updateQueueSession } = useQueue();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guestName: session.guestName ?? '',
      guestPhone: session.guestPhone ?? '',
      guestVehicleNumber: session.guestVehicleNumber ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      guestName: session.guestName ?? '',
      guestPhone: session.guestPhone ?? '',
      guestVehicleNumber: session.guestVehicleNumber ?? '',
    });
  }, [session, form]);

  const isGuestInfoChanged =
    form.watch('guestName') !== (session.guestName ?? '') ||
    form.watch('guestPhone') !== (session.guestPhone ?? '') ||
    form.watch('guestVehicleNumber') !== (session.guestVehicleNumber ?? '');

  const isSubmitting = form.formState.isSubmitting;
  const isMember = !!session.userId;

  async function onSubmit(data: FormValues) {
    if (!isGuestInfoChanged) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const res = await updateQueueSession({
      id: session.id,
      guestName: data.guestName || undefined,
      guestPhone: data.guestPhone || undefined,
      guestVehicleNumber: data.guestVehicleNumber || undefined,
    });

    if (res.success) {
      toast.success('고객 정보가 수정되었습니다.');
      navigate('/admin/queue');
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormPageHeader
          backTo="/admin/queue"
          title="대기열 세션 수정"
          subtitle={session.ticketNumber}
          actions={[
            {
              label: '취소',
              variant: 'secondary',
              onClick: () => navigate(-1),
            },
            {
              label: '저장',
              type: 'submit',
              isLoading: isSubmitting,
              // ✅ 회원 세션이거나 변경사항 없으면 비활성
              disabled: isSubmitting || !isGuestInfoChanged || isMember,
            },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-6">
          {/* ── 좌측: 세션 정보 요약 ────────────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-4">
            {/* 스키마 안내 */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                상태 변경은 대기열 목록에서 <strong>상태 변경</strong> 버튼을
                사용하세요. 이 페이지에서는 <strong>비회원 고객 정보</strong>만
                수정할 수 있습니다.
              </AlertDescription>
            </Alert>

            {/* 세션 기본 정보 (읽기 전용) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">세션 정보</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">티켓 번호</span>
                  <span className="font-mono font-medium">
                    {session.ticketNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">지점 ID</span>
                  <span>#{session.storeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">서비스 ID</span>
                  <span>#{session.serviceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">순번</span>
                  <span>{session.position}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">현재 상태</span>
                  <QueueStatusBadge
                    status={session.status as QueueStatusValue}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">예상 입장</span>
                  <span>
                    {format(new Date(session.estimatedEntryAt), 'MM/dd HH:mm', {
                      locale: ko,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">접수 시각</span>
                  <span>
                    {format(new Date(session.createdAt), 'MM/dd HH:mm', {
                      locale: ko,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 고객 정보 수정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  고객 정보 수정
                  {isMember && (
                    <span className="text-xs text-muted-foreground font-normal">
                      (회원 #{session.userId} — 수정 불가)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isMember ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      회원 접수 세션은 고객 정보를 수정할 수 없습니다.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">고객 이름</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="홍길동"
                              className="text-sm"
                            />
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
                          <FormLabel className="text-xs">전화번호</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="010-0000-0000"
                              className="text-sm"
                            />
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
                          <FormLabel className="text-xs">차량번호</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="12가 3456"
                              className="text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── 우측: 상태 안내 + 차량 요약 ─────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 현재 상태 (읽기 전용) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">현재 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QueueStatusBadge status={session.status as QueueStatusValue} />
                <p className="text-xs text-muted-foreground">
                  상태 변경은 대기열 목록의 액션 메뉴에서 할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* 차량 정보 요약 */}
            {(session.guestVehicleNumber ||
              form.watch('guestVehicleNumber')) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Car className="h-4 w-4" />
                    차량 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono">
                    {form.watch('guestVehicleNumber') ||
                      session.guestVehicleNumber}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
