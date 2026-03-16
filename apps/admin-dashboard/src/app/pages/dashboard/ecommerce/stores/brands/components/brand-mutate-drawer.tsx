import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { slugify as transliterateSlugify } from 'transliteration';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useStores } from '@starcoex-frontend/stores';
import type { Brand } from '@starcoex-frontend/stores';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Brand;
}

const formSchema = z.object({
  name: z.string().min(2, '브랜드명은 최소 2자 이상이어야 합니다.'),
  slug: z.string().min(2, 'Slug는 최소 2자 이상이어야 합니다.'),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  brandColor: z.string().optional(),
  isActive: z.boolean(),
});

type BrandForm = z.infer<typeof formSchema>;

export function BrandMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow;
  const { createBrand, updateBrand } = useStores();

  const form = useForm<BrandForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name ?? '',
      slug: currentRow?.slug ?? '',
      description: currentRow?.description ?? '',
      logoUrl: currentRow?.logoUrl ?? '',
      brandColor: currentRow?.brandColor ?? '#000000',
      isActive: currentRow?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? '',
        slug: currentRow?.slug ?? '',
        description: currentRow?.description ?? '',
        logoUrl: currentRow?.logoUrl ?? '',
        brandColor: currentRow?.brandColor ?? '#000000',
        isActive: currentRow?.isActive ?? true,
      });
    }
  }, [open, currentRow, form]);

  // 등록 모드에서 name → slug 자동 생성
  const nameValue = form.watch('name');
  useEffect(() => {
    if (!isUpdate && nameValue) {
      form.setValue(
        'slug',
        transliterateSlugify(nameValue, { lowercase: true, separator: '-' }),
        { shouldValidate: true }
      );
    }
  }, [nameValue, isUpdate, form]);

  const onSubmit = async (data: BrandForm) => {
    if (isUpdate && currentRow) {
      const res = await updateBrand({
        id: currentRow.id,
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        brandColor: data.brandColor || undefined,
        isActive: data.isActive,
      });
      if (res.success) {
        toast.success('브랜드가 수정되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '수정에 실패했습니다.');
      }
    } else {
      const res = await createBrand({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        brandColor: data.brandColor || undefined,
        isActive: data.isActive,
      });
      if (res.success) {
        toast.success('브랜드가 등록되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '등록에 실패했습니다.');
      }
    }
  };

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
          <SheetTitle>{isUpdate ? '브랜드 수정' : '브랜드 등록'}</SheetTitle>
          <SheetDescription>
            {isUpdate ? '브랜드 정보를 수정합니다.' : '새 브랜드를 등록합니다.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="brand-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>브랜드명 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 스타코엑스" />
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
                  <FormLabel>
                    Slug{' '}
                    <span className="text-muted-foreground text-xs">
                      (URL용 자동 생성)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="starcoex" />
                  </FormControl>
                  <FormDescription>
                    URL에 사용될 고유 식별자입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="브랜드 설명을 입력하세요"
                      className="min-h-[80px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    로고 URL{' '}
                    <span className="text-muted-foreground text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/logo.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    브랜드 컬러{' '}
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
          <Button form="brand-form" type="submit">
            {isUpdate ? '수정 완료' : '등록'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
