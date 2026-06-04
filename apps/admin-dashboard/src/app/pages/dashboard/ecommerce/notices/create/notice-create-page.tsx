import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  title: z
    .string()
    .min(1, '제목을 입력하세요.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력하세요.'),
  type: z.enum(['GENERAL', 'IMPORTANT', 'MAINTENANCE', 'EVENT', 'URGENT']),
  isPinned: z.boolean(), // .default(false) 제거
  isPopup: z.boolean(), // .default(false) 제거
  scheduledAt: z.string().optional(),
  visibleFrom: z.string().optional(),
  visibleUntil: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function NoticeCreatePage() {
  const navigate = useNavigate();
  const { createNotice } = useNotices();

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

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: FormValues) {
    const res = await createNotice({
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
      toast.success(res.data?.message ?? '공지가 생성되었습니다.');
      navigate('/admin/notices');
    } else {
      toast.error(res.error?.message ?? '공지 생성에 실패했습니다.');
    }
  }

  return (
    <>
      <PageHead
        title={`공지 추가 - ${COMPANY_INFO.name}`}
        description="새로운 공지사항을 등록하세요."
        keywords={['공지 추가', '공지 등록', COMPANY_INFO.name]}
        og={{
          title: `공지 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 공지사항을 등록하세요.',
          image: '/images/og-notices.jpg',
          type: 'website',
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* 헤더 */}
          <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="/admin/notices">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">공지 추가</h1>
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
            {/* 좌측: 본문 */}
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
                          <Input
                            {...field}
                            placeholder="공지 제목을 입력하세요"
                          />
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
                          <Textarea
                            {...field}
                            placeholder="공지 내용을 입력하세요. Markdown 형식을 지원합니다."
                            rows={12}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 우측: 설정 */}
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
                              <SelectValue placeholder="타입 선택" />
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
                            공지를 목록 상단에 고정합니다.
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
                            사용자 접속 시 팝업으로 표시합니다.
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
                        <FormDescription className="text-xs">
                          비워두면 즉시 초안으로 저장됩니다.
                        </FormDescription>
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
