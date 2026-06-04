import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReviews } from '@starcoex-frontend/reviews';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { REVIEW_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';

const FormSchema = z.object({
  title: z.string().min(2, '제목은 최소 2자 이상이어야 합니다.'),
  content: z.string().min(5, '내용은 최소 5자 이상이어야 합니다.'),
  status: z.enum(['ACTIVE', 'HIDDEN', 'DELETED', 'REPORTED']),
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ReviewEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentReview,
    isLoading,
    error,
    fetchReviewById,
    changeReviewStatus,
  } = useReviews();

  useEffect(() => {
    if (id) fetchReviewById(parseInt(id));
  }, [id, fetchReviewById]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'ACTIVE',
      reason: '',
    },
  });

  useEffect(() => {
    if (currentReview) {
      form.reset({
        title: currentReview.title,
        content: currentReview.content,
        status: currentReview.status,
        reason: '',
      });
    }
  }, [currentReview, form]);

  async function onSubmit(data: FormValues) {
    if (!currentReview) return;

    if (data.status !== currentReview.status) {
      const res = await changeReviewStatus({
        id: currentReview.id,
        status: data.status,
        reason: data.reason,
      });

      if (res.success) {
        toast.success('리뷰가 수정되었습니다.');
        navigate(`/admin/reviews/${id}`);
      } else {
        toast.error(res.error?.message ?? '수정에 실패했습니다.');
      }
    } else {
      toast.success('리뷰가 수정되었습니다.');
      navigate(`/admin/reviews/${id}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            리뷰 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentReview) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '리뷰를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/reviews')}>
          리뷰 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`${currentReview.title} 수정 - ${COMPANY_INFO.name}`}
        description="리뷰 정보를 수정하세요."
        keywords={['리뷰 수정', currentReview.title, COMPANY_INFO.name]}
        og={{
          title: `${currentReview.title} 수정 - ${COMPANY_INFO.name}`,
          description: '리뷰 정보를 수정하세요.',
          image: '/images/og-reviews.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/reviews/${id}`}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  리뷰 수정: {currentReview.title}
                </h1>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/admin/reviews/${id}`)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
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
              <div className="space-y-4 lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>리뷰 내용</CardTitle>
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
                          <FormLabel>내용 *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={6} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>상태 관리</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상태 *</FormLabel>
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
                                  {REVIEW_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
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
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>변경 사유</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="상태 변경 사유를 입력하세요 (선택사항)"
                            />
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
      </div>
    </>
  );
}
