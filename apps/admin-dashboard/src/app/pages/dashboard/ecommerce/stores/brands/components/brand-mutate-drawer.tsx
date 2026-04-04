import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { slugify as transliterateSlugify } from 'transliteration';
import { ImageIcon, UploadIcon, XIcon, AlertCircleIcon } from 'lucide-react';
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
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import type { Brand } from '@starcoex-frontend/stores';
import { MultiSelect } from '@starcoex-frontend/common';

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
  businessTypeIds: z.array(z.number()).optional(),
});

type BrandForm = z.infer<typeof formSchema>;

// 이미지 파일 프리뷰 타입 (products 패턴)
interface FilePreview {
  id: string;
  file: File;
  preview: string;
}

export function BrandMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow;
  const { createBrand, updateBrand, businessTypes } = useStores();
  const { uploadMedia, isLoading: isUploading } = useMedia();
  const { currentUser } = useAuth();

  // 이미지 상태 (products 패턴)
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 기존 로고 URL (수정 모드)
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(
    currentRow?.logoUrl ?? null
  );

  // ✅ businessTypes → MultiSelectOption 형식으로 변환
  const businessTypeOptions = businessTypes
    .filter((bt) => bt.isActive)
    .map((bt) => ({ id: bt.id, name: bt.name, code: bt.code }));

  const form = useForm<BrandForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name ?? '',
      slug: currentRow?.slug ?? '',
      description: currentRow?.description ?? '',
      logoUrl: currentRow?.logoUrl ?? '',
      brandColor: currentRow?.brandColor ?? '#000000',
      isActive: currentRow?.isActive ?? true,
      businessTypeIds:
        currentRow?.businessTypes?.map((bt) => bt.businessTypeId) ?? [],
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
        businessTypeIds:
          currentRow?.businessTypes?.map((bt) => bt.businessTypeId) ?? [],
      });
      setExistingLogoUrl(currentRow?.logoUrl ?? null);
      setFiles([]);
      setUploadError(null);
    }
  }, [open, currentRow, form]);

  // 이름 → slug 자동 생성
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

  // ── 파일 유효성 검사 (products 패턴) ──────────────────────────────
  const validateFile = useCallback((file: File): string | null => {
    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
    ];
    if (!validTypes.includes(file.type))
      return '지원되지 않는 파일 형식입니다. (PNG, JPG, WebP, SVG만 가능)';
    if (file.size > 5 * 1024 * 1024)
      return '파일 크기는 5MB를 초과할 수 없습니다.';
    return null;
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(newFiles).slice(0, 1); // 로고는 1개만
      const error = validateFile(fileArray[0]);
      if (error) {
        setUploadError(error);
        return;
      }
      // 기존 파일 교체
      setFiles((prev) => {
        prev.forEach((f) => URL.revokeObjectURL(f.preview));
        return fileArray.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        }));
      });
      setExistingLogoUrl(null); // 새 파일 선택 시 기존 URL 제거
    },
    [validateFile]
  );

  const removeFile = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.preview));
      return [];
    });
  }, []);

  // ── 드래그앤드롭 (products 패턴) ──────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) addFiles(target.files);
    };
    input.click();
  }, [addFiles]);

  // ── 제출 ──────────────────────────────────────────────────────────
  const onSubmit = async (data: BrandForm) => {
    let logoUrl = existingLogoUrl ?? undefined;

    // 새 파일 있으면 업로드
    if (files.length > 0 && currentUser?.id) {
      const uploadResult = await uploadMedia(
        files.map((f) => f.file),
        currentUser.id
      );
      if (!uploadResult.success || !uploadResult.data) {
        toast.error('이미지 업로드에 실패했습니다.');
        return;
      }
      const response = uploadResult.data;
      logoUrl = response.files
        ? response.files[0]?.fileUrl
        : response.fileUrl ?? undefined;
    }

    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      logoUrl: logoUrl || undefined,
      brandColor: data.brandColor || undefined,
      isActive: data.isActive,
      businessTypeIds: data.businessTypeIds?.length
        ? data.businessTypeIds
        : undefined,
    };

    if (isUpdate && currentRow) {
      const res = await updateBrand({ id: currentRow.id, ...payload });
      if (res.success) {
        toast.success('브랜드가 수정되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '수정에 실패했습니다.');
      }
    } else {
      const res = await createBrand(payload);
      if (res.success) {
        toast.success('브랜드가 등록되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '등록에 실패했습니다.');
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting || isUploading;

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          form.reset();
          files.forEach((f) => URL.revokeObjectURL(f.preview));
          setFiles([]);
        }
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
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
            {/* 로고 업로드 (products 드래그앤드롭 패턴) */}
            <FormItem>
              <FormLabel>브랜드 로고</FormLabel>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
              >
                {/* 기존 로고 (수정 모드) */}
                {existingLogoUrl && files.length === 0 ? (
                  <div className="relative">
                    <img
                      src={existingLogoUrl}
                      alt="브랜드 로고"
                      className="h-20 w-20 rounded-lg object-contain border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => setExistingLogoUrl(null)}
                      className="border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  </div>
                ) : files.length > 0 ? (
                  /* 새 파일 미리보기 */
                  <div className="relative">
                    <img
                      src={files[0].preview}
                      alt="로고 미리보기"
                      className="h-20 w-20 rounded-lg object-contain border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={removeFile}
                      className="border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  /* 업로드 안내 */
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-background flex size-10 items-center justify-center rounded-full border">
                      <ImageIcon className="size-4 opacity-60" />
                    </div>
                    <p className="text-sm font-medium">
                      로고를 여기에 드롭하세요
                    </p>
                    <p className="text-muted-foreground text-xs">
                      PNG, JPG, WebP, SVG · 최대 5MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openFileDialog}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      이미지 선택
                    </Button>
                  </div>
                )}
              </div>
              {uploadError && (
                <div className="text-destructive flex items-center gap-1 text-xs">
                  <AlertCircleIcon className="size-3 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>브랜드명 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 별표주유소" />
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
                      (자동 생성)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="star-gas-station" />
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

            {/* ✅ businessTypeIds — Checkbox 제거, MultiSelect 적용 */}
            <FormField
              control={form.control}
              name="businessTypeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비즈니스 타입</FormLabel>
                  <FormDescription className="text-xs">
                    이 브랜드가 운영하는 사업 유형을 선택하세요.
                  </FormDescription>
                  {businessTypeOptions.length === 0 ? (
                    <p className="text-muted-foreground text-xs">
                      등록된 비즈니스 타입이 없습니다.
                    </p>
                  ) : (
                    <FormControl>
                      <MultiSelect
                        value={field.value ?? []}
                        onChange={field.onChange}
                        options={businessTypeOptions}
                        placeholder="비즈니스 타입을 선택하세요..."
                        searchPlaceholder="비즈니스 타입 검색..."
                      />
                    </FormControl>
                  )}
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
          <Button form="brand-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : isUpdate ? '수정 완료' : '등록'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
