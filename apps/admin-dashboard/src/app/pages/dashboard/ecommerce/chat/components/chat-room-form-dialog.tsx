import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useChats } from '@starcoex-frontend/chats';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { ChatRoom } from '@starcoex-frontend/chats';

// ── 상수 ──────────────────────────────────────────────────────────────────────

const ROOM_TYPE_OPTIONS = [
  { value: 'CUSTOMER_SUPPORT', label: '고객 지원' },
  { value: 'ORDER_INQUIRY', label: '주문 문의' },
  { value: 'DELIVERY_SUPPORT', label: '배송 지원' },
  { value: 'TECHNICAL_SUPPORT', label: '기술 지원' },
  { value: 'GROUP_CHAT', label: '그룹 채팅' },
  { value: 'PRIVATE_CHAT', label: '1:1 채팅' },
  { value: 'GUEST_SUPPORT', label: '게스트 지원' },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'ORDER_INQUIRY', label: '주문 문의' },
  { value: 'DELIVERY_INQUIRY', label: '배송 문의' },
  { value: 'PAYMENT_INQUIRY', label: '결제 문의' },
  { value: 'PRODUCT_INQUIRY', label: '상품 문의' },
  { value: 'REFUND_REQUEST', label: '환불 요청' },
  { value: 'TECHNICAL_SUPPORT', label: '기술 지원' },
  { value: 'GENERAL_INQUIRY', label: '일반 문의' },
  { value: 'COMPLAINT', label: '불만 신고' },
] as const;

// ── 스키마 ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(100, '100자 이하로 입력해주세요.'),
  description: z.string().optional(),
  type: z.string().min(1, '채팅방 유형을 선택해주세요.'),
  category: z.string().optional(),
  chatPriority: z.string().optional(),
  isAutoAssign: z.boolean(),
  allowGuest: z.boolean(),
  maxParticipants: z
    .number({ message: '최대 참여자 수를 입력해주세요.' })
    .int()
    .min(2, '최소 2명 이상이어야 합니다.')
    .max(100, '100명 이하로 입력해주세요.'),
});

type FormValues = z.infer<typeof schema>;

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChatRoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTarget?: ChatRoom | null;
  onSuccess?: () => void;
}

// ── 컴포넌트 ───────────────────────────────────────────────────────────────────

export function ChatRoomFormDialog({
  open,
  onOpenChange,
  editTarget,
  onSuccess,
}: ChatRoomFormDialogProps) {
  const { createChatRoom, fetchAdminChatRooms } = useChats();
  const isEdit = !!editTarget;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      type: 'CUSTOMER_SUPPORT',
      category: undefined,
      chatPriority: 'NORMAL',
      isAutoAssign: true,
      allowGuest: true,
      maxParticipants: 10,
    },
  });

  // 수정 모드: editTarget 값으로 폼 초기화
  useEffect(() => {
    if (editTarget) {
      form.reset({
        title: editTarget.title,
        description: editTarget.description ?? '',
        type: editTarget.type,
        category: editTarget.category ?? undefined,
        chatPriority: editTarget.chatPriority ?? 'NORMAL',
        isAutoAssign: editTarget.isAutoAssign,
        allowGuest: editTarget.allowGuest,
        maxParticipants: editTarget.maxParticipants,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        type: 'CUSTOMER_SUPPORT',
        category: undefined,
        chatPriority: 'NORMAL',
        isAutoAssign: true,
        allowGuest: true,
        maxParticipants: 10,
      });
    }
  }, [editTarget, open, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (isEdit && editTarget) {
      // 수정: 상태/제목 등 변경 — 현재 API는 updateChatRoomStatus만 제공
      // 제목·설명 등 필드 변경이 필요하면 백엔드에 updateChatRoom mutation 추가 필요
      // 여기서는 상태 변경만 처리 (현재 스키마 기준)
      toast.info('채팅방 수정은 상태 변경을 통해 처리됩니다.');
      handleClose();
      return;
    }

    // 생성
    const res = await createChatRoom({
      title: values.title,
      description: values.description || undefined,
      type: values.type as any,
      category: values.category as any,
      chatPriority: values.chatPriority as any,
      isAutoAssign: values.isAutoAssign,
      allowGuest: values.allowGuest,
      maxParticipants: values.maxParticipants,
      tags: [],
    });

    if (res.success) {
      toast.success(res.data?.message ?? '채팅방이 생성되었습니다.');
      await fetchAdminChatRooms();
      onSuccess?.();
      handleClose();
    } else {
      toast.error(res.error?.message ?? '채팅방 생성에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '채팅방 수정' : '채팅방 생성'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채팅방 제목 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 주문 #1234 문의" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      aria-label="채팅방 설명"
                      {...field}
                      className="resize-none"
                      rows={2}
                      placeholder="채팅방 설명을 입력하세요."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 유형 */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채팅방 유형 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROOM_TYPE_OPTIONS.map((opt) => (
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

            {/* 카테고리 + 우선순위 (2열) */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select
                      value={field.value ?? 'NONE'}
                      onValueChange={(v) =>
                        field.onChange(v === 'NONE' ? undefined : v)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="선택 안 함" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NONE">선택 안 함</SelectItem>
                        {CATEGORY_OPTIONS.map((opt) => (
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
                name="chatPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>우선순위</FormLabel>
                    <Select
                      value={field.value ?? 'NORMAL'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((opt) => (
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
            </div>

            {/* 최대 참여자 수 */}
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최대 참여자 수 *</FormLabel>
                  <FormControl>
                    <Input
                      aria-label="최대 참여자 수"
                      {...field}
                      type="number"
                      min={2}
                      max={100}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 토글 2개 */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isAutoAssign"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>자동 상담원 배정</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        채팅방 생성 시 상담원을 자동 배정합니다.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowGuest"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>게스트 참여 허용</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        비로그인 게스트도 참여할 수 있습니다.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEdit ? '저장' : '생성'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
