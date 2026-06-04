import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Pencil, RefreshCwIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ReviewTargetType, useReviews } from '@starcoex-frontend/reviews';
import type { GeneralReviewScope } from '@starcoex-frontend/reviews';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REVIEW_TARGET_TYPE_OPTIONS } from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';

// ─── 대상 유형 기반 슬러그 자동 생성 ─────────────────────────────────────────
const SCOPE_SLUG_PREFIX: Record<ReviewTargetType, string> = {
  PRODUCT: 'product',
  STORE: 'store',
  ORDER: 'order',
  DELIVERY: 'delivery',
  RESERVATION: 'reservation',
  GENERAL: 'general',
};

const generateScopeSlug = (
  targetType: ReviewTargetType,
  name: string
): string => {
  const prefix = SCOPE_SLUG_PREFIX[targetType];
  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 20);
  const random = Math.random().toString(36).slice(2, 6);
  return namePart ? `${prefix}-${namePart}-${random}` : `${prefix}-${random}`;
};

const createSchema = z.object({
  targetType: z.enum([
    'PRODUCT',
    'STORE',
    'ORDER',
    'DELIVERY',
    'RESERVATION',
    'GENERAL',
  ] as const),
  slug: z
    .string()
    .min(2, '슬러그는 최소 2자 이상이어야 합니다.')
    .regex(/^[a-z0-9-]+$/, '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다.'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

const updateSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

export function ReviewScopeManager() {
  const {
    generalReviewScopes,
    createGeneralReviewScope,
    updateGeneralReviewScope,
    fetchGeneralReviewScopes,
  } = useReviews();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GeneralReviewScope | null>(null);

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      targetType: 'GENERAL',
      slug: '',
      name: '',
      description: '',
      isActive: true,
    },
  });

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  const watchedTargetType = createForm.watch('targetType');
  const watchedName = createForm.watch('name');

  // 대상 유형 또는 이름 변경 시 슬러그 자동 재생성
  useEffect(() => {
    if (watchedName.length >= 2) {
      createForm.setValue(
        'slug',
        generateScopeSlug(watchedTargetType, watchedName),
        { shouldValidate: false }
      );
    }
  }, [watchedTargetType, watchedName, createForm]);

  const handleRegenerateSlug = () => {
    createForm.setValue(
      'slug',
      generateScopeSlug(watchedTargetType, watchedName),
      { shouldValidate: true }
    );
  };

  const handleCreate = async (data: CreateForm) => {
    const res = await createGeneralReviewScope({
      slug: data.slug,
      name: data.name,
      description: data.description || undefined,
      isActive: data.isActive,
    });
    if (res.success) {
      toast.success('스코프가 등록되었습니다.');
      await fetchGeneralReviewScopes();
      createForm.reset();
      setCreateOpen(false);
    } else {
      toast.error(res.error?.message ?? '등록에 실패했습니다.');
    }
  };

  const openEdit = (scope: GeneralReviewScope) => {
    setEditTarget(scope);
    updateForm.reset({
      name: scope.name,
      description: scope.description ?? '',
      isActive: scope.isActive,
    });
  };

  const handleUpdate = async (data: UpdateForm) => {
    if (!editTarget) return;
    const res = await updateGeneralReviewScope({
      id: editTarget.id,
      name: data.name,
      description: data.description || undefined,
      isActive: data.isActive,
    });
    if (res.success) {
      toast.success('스코프가 수정되었습니다.');
      await fetchGeneralReviewScopes();
      setEditTarget(null);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>일반 리뷰 스코프 관리</CardTitle>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {generalReviewScopes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            등록된 스코프가 없습니다.
          </p>
        ) : (
          <div className="divide-y rounded-md border">
            {generalReviewScopes.map((scope) => (
              <div
                key={scope.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{scope.name}</span>
                    <Badge
                      variant={scope.isActive ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {scope.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground font-mono text-xs">
                    {scope.slug}
                  </span>
                  {scope.description && (
                    <p className="text-muted-foreground text-xs">
                      {scope.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(scope)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* 생성 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>스코프 추가</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              {/* 대상 유형 — 슬러그 자동 생성 기준 */}
              <FormField
                control={createForm.control}
                name="targetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>대상 유형 *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="대상 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {REVIEW_TARGET_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-xs">
                      슬러그 접두사가 대상 유형에 맞게 자동 설정됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 이름 */}
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="스코프 이름" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      이름 입력 시 슬러그가 자동 생성됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 슬러그 — 자동 생성 + 수동 수정 가능 */}
              <FormField
                control={createForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>슬러그 *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="자동 생성됩니다"
                          className="font-mono text-xs"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRegenerateSlug}
                        title="슬러그 재생성"
                      >
                        <RefreshCwIcon className="size-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      소문자, 숫자, 하이픈만 사용 가능. 생성 후 변경 불가.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>활성화</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        비활성 시 일반 리뷰에서 선택 불가
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={createForm.formState.isSubmitting}
                >
                  등록
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 — 슬러그/대상유형 변경 불가 */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              스코프 수정
              <span className="text-muted-foreground ml-2 font-mono text-sm">
                {editTarget?.slug}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>활성화</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        비활성 시 일반 리뷰에서 선택 불가
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={updateForm.formState.isSubmitting}
                >
                  저장
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
