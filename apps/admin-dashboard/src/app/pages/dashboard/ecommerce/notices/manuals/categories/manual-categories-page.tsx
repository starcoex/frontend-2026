import { useEffect, useState, useMemo } from 'react';
import { Loader2, PlusIcon, Pencil, Trash2, Search } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotices } from '@starcoex-frontend/notices';
import type {
  ManualCategory,
  NoticeBusinessType,
} from '@starcoex-frontend/notices';

const BUSINESS_TYPE_OPTIONS: {
  value: NoticeBusinessType | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: '전체' },
  { value: 'ZERAGAE_CARCARE', label: '제라게 카케어' },
  { value: 'SINHAN_NETWORKS', label: '신한 네트웍스' },
  { value: 'STAR_GAS_STATION', label: '별표 주유소' },
  { value: 'SHADE_CANOPY', label: '그늘막' },
  { value: 'COMMON', label: '공통' },
];

const BUSINESS_TYPE_FORM_OPTIONS = BUSINESS_TYPE_OPTIONS.filter(
  (o) => o.value !== 'ALL'
) as { value: NoticeBusinessType; label: string }[];

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-');

const CategoryFormSchema = z.object({
  name: z.string().min(1, '카테고리명을 입력하세요.'),
  slug: z.string().min(1, '슬러그를 입력하세요.'),
  description: z.string().optional(),
  targetBusiness: z.enum([
    'ZERAGAE_CARCARE',
    'SINHAN_NETWORKS',
    'STAR_GAS_STATION',
    'SHADE_CANOPY',
    'COMMON',
  ]),
  targetApp: z.string().min(1, '대상 앱을 입력하세요.'),
  order: z.number().min(0),
  isVisible: z.boolean(),
});

type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export default function ManualCategoriesPage() {
  const {
    manualCategories,
    fetchAdminManualCategories,
    createManualCategory,
    updateManualCategory,
    deleteManualCategory,
    isLoading,
    error,
  } = useNotices();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ManualCategory | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ManualCategory | null>(null);

  // ── 필터 상태 ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [businessFilter, setBusinessFilter] = useState<
    NoticeBusinessType | 'ALL'
  >('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<
    'all' | 'visible' | 'hidden'
  >('all');

  useEffect(() => {
    fetchAdminManualCategories();
  }, [fetchAdminManualCategories]);

  // ── 클라이언트 사이드 필터링 ───────────────────────────────────────────────
  const filteredCategories = useMemo(() => {
    return manualCategories.filter((cat) => {
      const matchSearch =
        !searchQuery ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBusiness =
        businessFilter === 'ALL' || cat.targetBusiness === businessFilter;

      const matchVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && cat.isVisible) ||
        (visibilityFilter === 'hidden' && !cat.isVisible);

      return matchSearch && matchBusiness && matchVisibility;
    });
  }, [manualCategories, searchQuery, businessFilter, visibilityFilter]);

  const isFiltered =
    searchQuery !== '' ||
    businessFilter !== 'ALL' ||
    visibilityFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setBusinessFilter('ALL');
    setVisibilityFilter('all');
  };

  // ── Form ───────────────────────────────────────────────────────────────────
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      targetBusiness: 'COMMON',
      targetApp: 'admin',
      order: 0,
      isVisible: true,
    },
  });

  const openCreate = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      targetBusiness: 'COMMON',
      targetApp: 'admin',
      order: 0,
      isVisible: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (cat: ManualCategory) => {
    setEditingCategory(cat);
    form.reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      targetBusiness: cat.targetBusiness,
      targetApp: cat.targetApp,
      order: cat.order,
      isVisible: cat.isVisible,
    });
    setDialogOpen(true);
  };

  const nameValue = form.watch('name');
  useEffect(() => {
    if (!editingCategory && nameValue) {
      form.setValue('slug', generateSlug(nameValue), { shouldValidate: false });
    }
  }, [nameValue, editingCategory, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (editingCategory) {
      const res = await updateManualCategory({
        id: editingCategory.id,
        ...data,
      });
      if (res.success) {
        toast.success('카테고리가 수정되었습니다.');
        setDialogOpen(false);
        fetchAdminManualCategories();
      } else {
        toast.error(res.error?.message ?? '수정에 실패했습니다.');
      }
    } else {
      const res = await createManualCategory(data);
      if (res.success) {
        toast.success('카테고리가 생성되었습니다.');
        setDialogOpen(false);
        fetchAdminManualCategories();
      } else {
        toast.error(res.error?.message ?? '생성에 실패했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteManualCategory(deleteTarget.id);
    if (res.success) {
      toast.success('카테고리가 삭제되었습니다.');
      setDeleteTarget(null);
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  // ── 로딩 분리 (notices-page.tsx 패턴) ─────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            카테고리 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`매뉴얼 카테고리 - ${COMPANY_INFO.name}`}
        description="매뉴얼 카테고리를 관리하세요."
        keywords={['매뉴얼 카테고리', COMPANY_INFO.name]}
        og={{
          title: `매뉴얼 카테고리 - ${COMPANY_INFO.name}`,
          description: '매뉴얼 카테고리 관리',
          image: '/images/og-notices.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 에러 Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>데이터 로딩 실패</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAdminManualCategories()}
                className="ml-4"
              >
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!error && (
          <>
            {/* 필터 + 추가 버튼 행 */}
            <div className="space-y-3">
              {/* 사업 유형 탭 필터 */}
              <Tabs
                value={businessFilter}
                onValueChange={(v) =>
                  setBusinessFilter(v as NoticeBusinessType | 'ALL')
                }
              >
                <TabsList>
                  {BUSINESS_TYPE_OPTIONS.map((opt) => (
                    <TabsTrigger key={opt.value} value={opt.value}>
                      {opt.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* 검색 + 공개여부 필터 + 추가 버튼 */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="text-muted-foreground absolute left-2.5 top-2 h-4 w-4" />
                  <Input
                    placeholder="이름, 슬러그 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[200px] pl-8 lg:w-[260px]"
                  />
                </div>

                <Select
                  value={visibilityFilter}
                  onValueChange={(v) =>
                    setVisibilityFilter(v as 'all' | 'visible' | 'hidden')
                  }
                >
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="visible">공개</SelectItem>
                    <SelectItem value="hidden">비공개</SelectItem>
                  </SelectContent>
                </Select>

                {isFiltered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8"
                  >
                    필터 초기화
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    {filteredCategories.length} / {manualCategories.length}개
                  </p>
                  <Button onClick={openCreate}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    카테고리 추가
                  </Button>
                </div>
              </div>
            </div>

            {/* 카테고리 카드 그리드 */}
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground flex h-40 items-center justify-center text-sm">
                  {isFiltered
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '카테고리가 없습니다. 카테고리를 추가하세요.'}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((cat) => (
                  <Card key={cat.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">
                            {cat.name}
                          </CardTitle>
                          <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                            /{cat.slug}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(cat)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-7 w-7"
                            onClick={() => setDeleteTarget(cat)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {cat.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {cat.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {
                            BUSINESS_TYPE_FORM_OPTIONS.find(
                              (o) => o.value === cat.targetBusiness
                            )?.label
                          }
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {cat.targetApp}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          순서 {cat.order}
                        </Badge>
                        {!cat.isVisible && (
                          <Badge variant="secondary" className="text-xs">
                            비공개
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 생성/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? '카테고리 수정' : '카테고리 추가'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리명 *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 시스템 운영 매뉴얼" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>슬러그 *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="system-operation-manual" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="카테고리 설명 (선택)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="targetBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대상 사업 *</FormLabel>
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
                          {BUSINESS_TYPE_FORM_OPTIONS.map((opt) => (
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
                  name="targetApp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대상 앱 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="admin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>정렬 순서</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end gap-2 pb-0.5">
                      <FormLabel>공개 여부</FormLabel>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingCategory ? '수정' : '추가'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">"{deleteTarget?.name}"</span>{' '}
              카테고리를 삭제하시겠습니까? 하위 매뉴얼이 있으면 삭제가 제한될 수
              있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
