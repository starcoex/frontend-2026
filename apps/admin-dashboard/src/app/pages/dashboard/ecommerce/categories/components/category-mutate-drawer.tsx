import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SelectDropdown from '@/components/select-dropdown';
import { useCategories } from '@starcoex-frontend/categories';
import type { Category } from '@starcoex-frontend/categories';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Category;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, '카테고리 이름을 입력해주세요.')
    .max(100, '이름은 100자 이내여야 합니다.'),
  slug: z
    .string()
    .min(1, '슬러그를 입력해주세요.')
    .max(100, '슬러그는 100자 이내여야 합니다.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      '슬러그는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.'
    ),
  description: z.string().optional(),
  parentId: z.number().optional(),
  isActive: z.boolean(), // ← .default() 제거
  // ✅ sortOrder 제거 - 드래그앤드롭으로 처리
  // sortOrder: z.number().int().min(0), // ← z.coerce 제거, .default() 제거
  metadata: z
    .object({
      colorTheme: z.string().optional(),
    })
    .optional(),
});

type CategoryForm = z.infer<typeof formSchema>;

// name → slug 자동 변환
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export function CategoryMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow;
  const { createCategory, updateCategory, categoryTree } = useCategories();

  // ✅ categoryTree를 평면화하여 상위 카테고리 목록으로 사용
  const flatCategories = useMemo(() => {
    const flatten = (categories: Category[]): Category[] =>
      categories.reduce<Category[]>((acc, c) => {
        acc.push(c);
        if (c.children?.length) acc.push(...flatten(c.children));
        return acc;
      }, []);

    const rootCategories = categoryTree.filter(
      (c) => c.parentId === null || c.parentId === undefined
    );
    return flatten(rootCategories);
  }, [categoryTree]);

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name ?? '',
      slug: currentRow?.slug ?? '',
      description: currentRow?.description ?? '',
      parentId: currentRow?.parentId ?? undefined,
      isActive: currentRow?.isActive ?? true, // ← defaultValues에서 기본값 처리
      // sortOrder: currentRow?.sortOrder ?? 0, // ← defaultValues에서 기본값 처리
      metadata: {
        colorTheme: (currentRow?.metadata?.['colorTheme'] as string) ?? '',
      },
    },
  });

  // name 변경 시 slug 자동 생성 (등록 모드에서만)
  const nameValue = form.watch('name');
  useEffect(() => {
    if (!isUpdate) {
      form.setValue('slug', toSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isUpdate, form]);

  const onSubmit = async (data: CategoryForm) => {
    if (isUpdate && currentRow) {
      await updateCategory({
        id: currentRow.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        isActive: data.isActive,
        // sortOrder: data.sortOrder,
        metadata: data.metadata, // ← colorTheme → metadata
      });
    } else {
      await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        isActive: data.isActive,
        // sortOrder: data.sortOrder,
        metadata: data.metadata, // ← colorTheme → metadata
      });
    }
    onOpenChange(false);
    form.reset();
  };

  // 부모 카테고리 목록 (자기 자신 + 자신의 하위 카테고리 제외)
  const parentOptions = flatCategories
    .filter((c) => c.id !== currentRow?.id)
    .map((c) => ({
      label: c.parentId ? `└ ${c.name}` : c.name, // ✅ 하위 카테고리 시각적 구분
      value: String(c.id),
    }));

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>
            {isUpdate ? '카테고리 수정' : '카테고리 등록'}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? '카테고리 정보를 수정합니다.'
              : '새 카테고리를 등록합니다.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            {/* 이름 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="카테고리 이름을 입력하세요"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 슬러그 */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    슬러그{' '}
                    <span className="text-muted-foreground text-xs">
                      (URL용 자동 생성)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: electronic-devices" />
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
                  <FormLabel>
                    설명{' '}
                    <span className="text-muted-foreground text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="카테고리 설명을 입력하세요"
                      className="min-h-[80px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 부모 카테고리 */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    상위 카테고리{' '}
                    <span className="text-muted-foreground text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value ? String(field.value) : undefined}
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                    placeholder="상위 카테고리 선택"
                    items={parentOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 색상 테마 - 컬러 피커 */}
            <FormField
              control={form.control}
              name="metadata.colorTheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    색상 테마{' '}
                    <span className="text-muted-foreground text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={field.value ?? '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded-md border p-1"
                      />
                      <span className="text-muted-foreground font-mono text-sm">
                        {field.value ?? '#000000'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 활성화 상태 */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <FormLabel className="cursor-pointer">활성화</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2 px-4 sm:px-6">
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button form="category-form" type="submit">
            {isUpdate ? '수정 완료' : '등록'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
