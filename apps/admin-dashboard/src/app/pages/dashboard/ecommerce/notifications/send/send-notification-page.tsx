import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Send, Info } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PageHead,
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import {
  useNotifications,
  NotificationType,
  NotificationChannel,
} from '@starcoex-frontend/notifications';
import { EntitySelector, type EntityType } from './components/entity-selector';
import type { SelectedEntity } from './components/entity-search.types';

// ── 이메일 템플릿 ────────────────────────────────────────────────────────────
const EMAIL_TEMPLATES = [
  {
    value: 'payment-complete',
    label: '결제 완료',
    desc: '결제 처리 완료 안내',
  },
  { value: 'reservation-confirm', label: '예약 확인', desc: '예약 확정 안내' },
  { value: 'order-confirm', label: '주문 확인', desc: '주문 접수 안내' },
  { value: 'general-notice', label: '일반 공지', desc: '일반 안내 메시지' },
] as const;

const TYPE_OPTIONS = [
  {
    value: NotificationType.GENERAL,
    label: '일반',
    desc: '일반적인 공지/안내',
  },
  { value: NotificationType.PAYMENT, label: '결제', desc: '결제 관련 알림' },
  {
    value: NotificationType.RESERVATION,
    label: '예약',
    desc: '예약 관련 알림',
  },
  { value: NotificationType.SECURITY, label: '보안', desc: '보안 경고' },
  { value: NotificationType.SYSTEM, label: '시스템', desc: '시스템 점검 등' },
  {
    value: NotificationType.MARKETING,
    label: '마케팅',
    desc: '이벤트/프로모션',
  },
  {
    value: NotificationType.REMINDER,
    label: '리마인더',
    desc: '예약/일정 리마인드',
  },
  { value: NotificationType.FUEL, label: '유류', desc: '유류 관련 알림' },
  { value: NotificationType.DELIVERY, label: '배달', desc: '배달 관련 알림' },
];

const CHANNEL_OPTIONS = [
  { value: NotificationChannel.PUSH, label: '푸시 알림' },
  { value: NotificationChannel.EMAIL, label: '이메일' },
  { value: NotificationChannel.SMS, label: 'SMS' },
  { value: NotificationChannel.KAKAO, label: '카카오 알림톡' },
];

const FormSchema = z.object({
  title: z.string().min(2, '제목은 최소 2자 이상이어야 합니다.'),
  message: z.string().min(5, '내용은 최소 5자 이상이어야 합니다.'),
  type: z.nativeEnum(NotificationType),
  channel: z.nativeEnum(NotificationChannel),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.number().min(1).optional(),
  actionUrl: z
    .string()
    .url('올바른 URL 형식이 아닙니다.')
    .optional()
    .or(z.literal('')),
  sendEmail: z.boolean(),
  emailTemplate: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function SendNotificationPage() {
  const navigate = useNavigate();
  const { sendNotification } = useNotifications();

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);
  const [entityType, setEntityType] = useState<EntityType | undefined>();
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      message: '',
      type: NotificationType.GENERAL,
      channel: NotificationChannel.PUSH,
      relatedEntityType: undefined,
      relatedEntityId: undefined,
      actionUrl: '',
      sendEmail: false,
      emailTemplate: undefined,
    },
  });

  const watchedChannel = form.watch('channel');
  const watchedSendEmail = form.watch('sendEmail');
  const watchedEmailTemplate = form.watch('emailTemplate');
  const isSubmitting = form.formState.isSubmitting;

  // EMAIL 채널 선택 시 sendEmail 자동 ON
  useEffect(() => {
    if (watchedChannel === NotificationChannel.EMAIL) {
      form.setValue('sendEmail', true);
    }
  }, [watchedChannel, form]);

  // 종류 변경 핸들러
  const handleTypeChange = (type: EntityType | undefined) => {
    setEntityType(type);
    // 종류 변경 시 선택 초기화
    handleClearEntity();
    form.setValue('relatedEntityType', type);
  };

  // 엔티티 선택 핸들러
  const handleSelectEntity = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    form.setValue('relatedEntityId', entity.id);
    // actionUrl: /admin/ 경로 → 라우터에 실제로 존재하는 경로
    form.setValue('actionUrl', `${window.location.origin}${entity.path}`);
  };

  // 엔티티 초기화
  const handleClearEntity = () => {
    setSelectedEntity(null);
    form.setValue('relatedEntityId', undefined);
    form.setValue('actionUrl', '');
  };

  async function onSubmit(data: FormValues) {
    if (!selectedCustomer) {
      toast.error('수신자를 선택해주세요.');
      return;
    }

    const res = await sendNotification({
      userId: selectedCustomer.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      channel: data.channel,
      relatedEntityType: data.relatedEntityType || undefined,
      relatedEntityId: data.relatedEntityId || undefined,
      actionUrl: data.actionUrl || undefined,
      sendEmail: data.sendEmail,
      emailTemplate: data.sendEmail ? data.emailTemplate : undefined,
      templateData:
        data.sendEmail && selectedCustomer.email
          ? {
              recipientEmail: selectedCustomer.email,
              recipientName: selectedCustomer.name,
            }
          : undefined,
    });

    if (res.success) {
      toast.success(`${selectedCustomer.name}님께 알림이 전송되었습니다.`);
      navigate('/admin/notifications');
    } else {
      toast.error(res.error?.message ?? '알림 전송에 실패했습니다.');
    }
  }

  return (
    <>
      <PageHead
        title={`알림 전송 - ${COMPANY_INFO.name}`}
        description="관리자 또는 유저에게 알림을 전송합니다."
        keywords={['알림 전송', COMPANY_INFO.name]}
        og={{
          title: `알림 전송 - ${COMPANY_INFO.name}`,
          description: '알림 전송 시스템',
          image: '/images/og-components.jpg',
          type: 'website',
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* 헤더 */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="/admin/notifications">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">알림 전송</h1>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/notifications')}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedCustomer}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    전송하기
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mx-auto max-w-(--breakpoint-lg) grid gap-4 lg:grid-cols-6">
            {/* ── 좌측 ─────────────────────────────────────────────────────── */}
            <div className="space-y-4 lg:col-span-4">
              {/* 수신자 */}
              <Card>
                <CardHeader>
                  <CardTitle>수신자 선택 *</CardTitle>
                  <CardDescription>
                    이름 또는 전화번호로 검색하여 수신자를 선택하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerSearch
                    selected={selectedCustomer}
                    onSelect={setSelectedCustomer}
                    onClear={() => setSelectedCustomer(null)}
                    enableCreate={false}
                  />
                  {watchedSendEmail && selectedCustomer && (
                    <Alert className="mt-3">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        이메일 발송 주소:{' '}
                        {selectedCustomer.email ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {selectedCustomer.email}
                          </Badge>
                        ) : (
                          <span className="text-destructive text-xs">
                            이메일 정보 없음 — 이메일 발송 불가
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* 알림 내용 */}
              <Card>
                <CardHeader>
                  <CardTitle>알림 내용</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: ✅ 결제가 완료되었습니다"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>내용 *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="알림 상세 내용을 입력하세요"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="actionUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>액션 URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="아래 데이터 연결 시 자동 생성됩니다"
                            readOnly={!!selectedEntity}
                            className={
                              selectedEntity ? 'bg-muted font-mono text-xs' : ''
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          수신자가 알림 클릭 시 이동할 /admin/... 경로
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 관련 데이터 연결 — EntitySelector로 위임 */}
              <Card>
                <CardHeader>
                  <CardTitle>관련 데이터 연결 (선택사항)</CardTitle>
                  <CardDescription>
                    주문·결제·예약·제품을 검색하여 선택하면 수신자가 알림 클릭
                    시 해당 상세 페이지로 이동합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EntitySelector
                    entityType={entityType}
                    selectedEntity={selectedEntity}
                    onTypeChange={handleTypeChange}
                    onSelectEntity={handleSelectEntity}
                    onClearEntity={handleClearEntity}
                  />
                </CardContent>
              </Card>
            </div>

            {/* ── 우측: 전송 설정 ──────────────────────────────────────────── */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>전송 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>알림 타입 *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {TYPE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    <span>{opt.label}</span>
                                    <span className="text-muted-foreground ml-1.5 text-xs">
                                      {opt.desc}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>발송 채널 *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {CHANNEL_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="sendEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <Label>이메일도 함께 발송</Label>
                          <p className="text-muted-foreground text-xs">
                            {watchedChannel === NotificationChannel.EMAIL
                              ? 'EMAIL 채널 — 자동 발송됩니다.'
                              : '푸시/SMS와 함께 이메일 추가 발송'}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              watchedChannel === NotificationChannel.EMAIL
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchedSendEmail && (
                    <FormField
                      control={form.control}
                      name="emailTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일 템플릿</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ''}
                              onValueChange={(v) =>
                                field.onChange(v === '__none__' ? undefined : v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="템플릿 선택 (선택사항)" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="__none__">
                                    기본 (텍스트 그대로 발송)
                                  </SelectItem>
                                  {EMAIL_TEMPLATES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      <span>{t.label}</span>
                                      <span className="text-muted-foreground ml-1.5 text-xs">
                                        {t.desc}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-xs">
                            {watchedEmailTemplate
                              ? `선택: ${
                                  EMAIL_TEMPLATES.find(
                                    (t) => t.value === watchedEmailTemplate
                                  )?.label
                                }`
                              : '선택 안 하면 제목+내용을 텍스트로 발송'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* 전송 요약 */}
              {selectedCustomer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">전송 요약</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">수신자</span>
                      <span className="font-medium">
                        {selectedCustomer.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">채널</span>
                      <Badge variant="outline" className="text-xs">
                        {
                          CHANNEL_OPTIONS.find(
                            (c) => c.value === watchedChannel
                          )?.label
                        }
                      </Badge>
                    </div>
                    {watchedSendEmail && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">이메일</span>
                          <span className="font-mono text-xs">
                            {selectedCustomer.email ?? '없음'}
                          </span>
                        </div>
                        {watchedEmailTemplate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              템플릿
                            </span>
                            <span className="text-xs">
                              {
                                EMAIL_TEMPLATES.find(
                                  (t) => t.value === watchedEmailTemplate
                                )?.label
                              }
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {selectedEntity && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            연결 데이터
                          </span>
                          <span className="max-w-[140px] truncate text-xs font-medium">
                            {selectedEntity.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            이동 경로
                          </span>
                          <span className="text-primary font-mono text-xs">
                            {selectedEntity.path}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
