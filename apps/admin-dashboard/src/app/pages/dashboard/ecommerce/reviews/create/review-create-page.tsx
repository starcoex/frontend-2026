import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReviews } from '@starcoex-frontend/reviews';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import { useDelivery } from '@starcoex-frontend/delivery';
import { useReservations } from '@starcoex-frontend/reservations';
import {
  REVIEW_TYPE_OPTIONS,
  REVIEW_TARGET_TYPE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';
import type { ReviewType, ReviewTargetType } from '@starcoex-frontend/reviews';
import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

// ─── 0.5 단위 별점 컴포넌트 ───────────────────────────────────────────────────
interface HalfStarRatingProps {
  rating: number;
  onChange: (value: number) => void;
  max?: number;
}

function HalfStarRating({ rating, onChange, max = 5 }: HalfStarRatingProps) {
  const steps = Array.from({ length: max * 2 }, (_, i) => (i + 1) * 0.5);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, starIndex) => {
          const fullValue = starIndex + 1;
          const halfValue = starIndex + 0.5;
          const isFull = rating >= fullValue;
          const isHalf = !isFull && rating >= halfValue;

          return (
            <div key={starIndex} className="relative flex">
              {/* 왼쪽 절반 (0.5점) */}
              <button
                type="button"
                className="absolute left-0 top-0 h-full w-1/2 z-10"
                onClick={() => onChange(halfValue)}
                aria-label={`${halfValue}점`}
              />
              {/* 오른쪽 절반 (1점) */}
              <button
                type="button"
                className="absolute right-0 top-0 h-full w-1/2 z-10"
                onClick={() => onChange(fullValue)}
                aria-label={`${fullValue}점`}
              />
              <Star
                className={cn(
                  'size-8 transition-colors',
                  isFull
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                    ? 'text-yellow-400'
                    : 'fill-transparent text-gray-300'
                )}
                style={
                  isHalf
                    ? {
                        background:
                          'linear-gradient(to right, #facc15 50%, transparent 50%)',
                        WebkitBackgroundClip: 'text',
                        fill: 'url(#half)',
                      }
                    : undefined
                }
              />
            </div>
          );
        })}
        <span className="text-muted-foreground ml-3 text-sm">
          {rating > 0 ? `${rating} / ${max}` : '평점을 선택하세요'}
        </span>
      </div>
      {/* 슬라이더 방식 (정밀 제어) */}
      <input
        type="range"
        min={0.5}
        max={max}
        step={0.5}
        value={rating}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-yellow-400"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        {steps
          .filter((_, i) => i % 2 === 1)
          .map((v) => (
            <span key={v}>{v}</span>
          ))}
      </div>
    </div>
  );
}

// ─── 리뷰 유형별 대상 유형 매핑 ───────────────────────────────────────────────
const REVIEW_TYPE_TO_TARGET_TYPES: Record<ReviewType, ReviewTargetType[]> = {
  PRODUCT: ['PRODUCT'],
  SERVICE: ['STORE'],
  DELIVERY: ['DELIVERY', 'ORDER'],
  GENERAL: ['GENERAL'],
};

// ─── Zod 스키마 ───────────────────────────────────────────────────────────────
const FormSchema = z.object({
  title: z.string().min(2, '제목은 최소 2자 이상이어야 합니다.'),
  content: z.string().min(5, '내용은 최소 5자 이상이어야 합니다.'),
  rating: z.number().min(0.5, '평점을 선택하세요.').max(5),
  type: z.enum(['PRODUCT', 'SERVICE', 'DELIVERY', 'GENERAL'] as const),
  targetType: z.enum([
    'PRODUCT',
    'STORE',
    'ORDER',
    'DELIVERY',
    'RESERVATION',
    'GENERAL',
  ] as const),
  targetId: z.number().min(1, '대상을 선택하세요.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ReviewCreatePage() {
  const navigate = useNavigate();
  const { createReview, generalReviewScopes, fetchGeneralScopes } =
    useReviews();
  const { products, fetchProducts } = useProducts();
  const { stores, fetchStores } = useStores();
  const { deliveries, fetchDeliveries } = useDelivery({ skipSocket: true });
  const { fetchReservations } = useReservations();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      rating: 0,
      type: 'GENERAL',
      targetType: 'GENERAL',
      targetId: 0,
    },
  });

  const watchedType = form.watch('type');
  const watchedTargetType = form.watch('targetType');

  // 리뷰 유형 변경 시 → 대상 유형 자동 설정 + targetId 초기화
  useEffect(() => {
    const allowedTargets = REVIEW_TYPE_TO_TARGET_TYPES[watchedType];
    form.setValue('targetType', allowedTargets[0]);
    form.setValue('targetId', 0);
  }, [watchedType, form]);

  // 대상 유형별 데이터 로드
  useEffect(() => {
    switch (watchedTargetType) {
      case 'PRODUCT':
        fetchProducts();
        break;
      case 'STORE':
        fetchStores();
        break;
      case 'DELIVERY':
      case 'ORDER':
        fetchDeliveries({ limit: 50 });
        break;
      case 'RESERVATION':
        fetchReservations({ limit: 50 });
        break;
      case 'GENERAL':
        fetchGeneralScopes({ isActive: true });
        break;
    }
  }, [
    watchedTargetType,
    fetchProducts,
    fetchStores,
    fetchDeliveries,
    fetchReservations,
    fetchGeneralScopes,
  ]);

  // 대상 선택 옵션 계산
  const targetOptions = useMemo(() => {
    switch (watchedTargetType) {
      case 'PRODUCT':
        return products.map((p) => ({
          id: p.id,
          label: `[#${p.id}] ${p.name}`,
        }));
      case 'STORE':
        return stores.map((s) => ({ id: s.id, label: `[#${s.id}] ${s.name}` }));
      case 'DELIVERY':
        return deliveries.map((d) => ({
          id: d.id,
          label: `[#${d.id}] ${d.deliveryNumber ?? '배송'}`,
        }));
      case 'GENERAL':
        return generalReviewScopes.map((s) => ({
          id: s.id,
          label: `[${s.slug}] ${s.name}`,
        }));
      default:
        return [];
    }
  }, [watchedTargetType, products, stores, deliveries, generalReviewScopes]);

  // 현재 리뷰 유형에서 허용되는 대상 유형 목록
  const allowedTargetTypeOptions = REVIEW_TARGET_TYPE_OPTIONS.filter((opt) =>
    REVIEW_TYPE_TO_TARGET_TYPES[watchedType].includes(opt.value)
  );

  async function onSubmit(data: FormValues) {
    const res = await createReview({
      title: data.title,
      content: data.content,
      rating: data.rating,
      type: data.type,
      targetId: data.targetId,
      targetType: data.targetType,
      imageUrls: [],
    });

    if (res.success) {
      toast.success('리뷰가 등록되었습니다.');
      navigate('/admin/reviews');
    } else {
      toast.error(res.error?.message ?? '등록에 실패했습니다.');
    }
  }

  return (
    <>
      <PageHead
        title={`리뷰 추가 - ${COMPANY_INFO.name}`}
        description="새로운 리뷰를 등록하세요."
        keywords={['리뷰 추가', '리뷰 등록', COMPANY_INFO.name]}
        og={{
          title: `리뷰 추가 - ${COMPANY_INFO.name}`,
          description: '새 리뷰를 등록합니다.',
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
                  <Link to="/admin/reviews">
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">리뷰 추가</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
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
              {/* 좌측: 리뷰 내용 */}
              <div className="space-y-4 lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>리뷰 정보</CardTitle>
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
                              placeholder="리뷰 제목을 입력하세요"
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
                          <FormLabel>내용 *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder="리뷰 내용을 입력하세요"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* 0.5 단위 평점 */}
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>평점 * (0.5 단위)</FormLabel>
                          <FormControl>
                            <HalfStarRating
                              rating={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* 우측: 분류 설정 */}
              <div className="space-y-4 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>분류 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 리뷰 유형 */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>리뷰 유형 *</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="유형 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {REVIEW_TYPE_OPTIONS.map((opt) => (
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
                          <FormDescription className="text-xs">
                            유형 변경 시 대상 유형이 자동 설정됩니다.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 대상 유형 — 리뷰 유형에 따라 허용 목록 필터링 */}
                    <FormField
                      control={form.control}
                      name="targetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>대상 유형 *</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                                form.setValue('targetId', 0);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="대상 유형 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {allowedTargetTypeOptions.map((opt) => (
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

                    {/* 대상 선택 — 동적 로드된 실제 데이터 */}
                    <FormField
                      control={form.control}
                      name="targetId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>대상 선택 *</FormLabel>
                          <FormControl>
                            {targetOptions.length > 0 ? (
                              <Select
                                value={field.value ? String(field.value) : ''}
                                onValueChange={(v) => field.onChange(Number(v))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="대상을 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {targetOptions.map((opt) => (
                                      <SelectItem
                                        key={opt.id}
                                        value={String(opt.id)}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type="number"
                                min={1}
                                value={field.value || ''}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                                placeholder="대상 ID 직접 입력"
                              />
                            )}
                          </FormControl>
                          <FormDescription className="text-xs">
                            {watchedTargetType === 'GENERAL'
                              ? '일반 리뷰 스코프를 선택하세요.'
                              : watchedTargetType === 'ORDER'
                              ? '주문 ID를 직접 입력하세요.'
                              : '목록에서 대상을 선택하세요.'}
                          </FormDescription>
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
