import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotices } from '@starcoex-frontend/notices';
import { NOTICE_TYPE_OPTIONS } from '@/app/pages/dashboard/ecommerce/notices/data/notices-data';

const FormSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요.').max(200),
  content: z.string().min(1, '내용을 입력하세요.'),
  type: z.enum(['GENERAL', 'IMPORTANT', 'MAINTENANCE', 'EVENT', 'URGENT']),
  isPinned: z.boolean(),
  isPopup: z.boolean(),
  scheduledAt: z.string().optional(),
  visibleFrom: z.string().optional(),
  visibleUntil: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const toDatetimeLocal = (iso?: string | null): string => {
  if (!iso) return '';
  return iso.slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};

export default function NoticeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNotice, isLoading, error, fetchNoticeById, updateNotice } =
    useNotices();

  useEffect(() => {
    if (id) fetchNoticeById(parseInt(id));
  }, [id, fetchNoticeById]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'GENERAL',
      isPinned: false,
      isPopup: false,
      scheduledAt: '',
      visibleFrom: '',
      visibleUntil: '',
    },
  });

  // 공지 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (currentNotice && id && currentNotice.id === parseInt(id)) {
      form.reset({
        title: currentNotice.title,
        content: currentNotice.content,
        type: currentNotice.type,
        isPinned: currentNotice.isPinned,
        isPopup: currentNotice.isPopup,
        scheduledAt: toDatetimeLocal(currentNotice.scheduledAt),
        visibleFrom: toDatetimeLocal(currentNotice.visibleFrom),
        visibleUntil: toDatetimeLocal(currentNotice.visibleUntil),
      });
    }
  }, [currentNotice, id, form]);

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: FormValues) {
    if (!id) return;
    const res = await updateNotice({
      id: parseInt(id),
      title: data.title,
      content: data.content,
      type: data.type,
      isPinned: data.isPinned,
      isPopup: data.isPopup,
      scheduledAt: data.scheduledAt || undefined,
      visibleFrom: data.visibleFrom || undefined,
      visibleUntil: data.visibleUntil || undefined,
    });

    if (res.success) {
      toast.success(res.data?.updateMessage ?? '공지가 수정되었습니다.');
      navigate(`/admin/notices/${id}`);
    } else {
      toast.error(res.error?.message ?? '공지 수정에 실패했습니다.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !currentNotice) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '공지를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/notices')}>
          공지 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`공지 수정 - ${COMPANY_INFO.name}`}
        description="공지사항을 수정하세요."
        keywords={['공지 수정', COMPANY_INFO.name]}
        og={{
          title: `공지 수정 - ${COMPANY_INFO.name}`,
          description: '공지사항 수정',
          image: '/images/og-notices.jpg',
          type: 'website',
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to={`/admin/notices/${id}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">공지 수정</h1>
                <p className="text-muted-foreground font-mono text-sm">
                  #{currentNotice.id}
                </p>
              </div>
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
                    저장 중...
                  </>
                ) : (
                  '저장하기'
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-6">
            {/* 본문 */}
            <div className="space-y-4 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>공지 내용</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>내용 * (Markdown 지원)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={14} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 설정 */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>공지 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>타입</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NOTICE_TYPE_OPTIONS.map((opt) => (
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
                    name="isPinned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>상단 고정</FormLabel>
                          <FormDescription className="text-xs">
                            목록 상단에 고정합니다.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPopup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>팝업 표시</FormLabel>
                          <FormDescription className="text-xs">
                            접속 시 팝업으로 표시합니다.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>발행 일정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>예약 발행 시각</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visibleFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>노출 시작일</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visibleUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>노출 종료일</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
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
    </>
  );
}
