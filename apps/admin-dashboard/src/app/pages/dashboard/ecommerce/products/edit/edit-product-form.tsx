import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  Badge,
  ChevronLeft,
  ImageIcon,
  Loader2,
  Pencil,
  PlusIcon,
  RefreshCwIcon,
  Trash2,
  UploadIcon,
  XIcon,
} from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { useMedia } from '@starcoex-frontend/media';
import { useCategories } from '@starcoex-frontend/categories';
import { useStores } from '@starcoex-frontend/stores';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useProducts } from '@starcoex-frontend/products';
import type { Product } from '@starcoex-frontend/products';
import Barcode from 'react-barcode';
import { InventoryMutateDrawer } from '@/app/pages/dashboard/ecommerce/products/inventory/components/inventory-mutate-drawer';
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

// ─── SKU 유틸 ────────────────────────────────────────────────────────────────
const SKU_MODES = [
  { value: 'category', label: '카테고리 기반' },
  { value: 'date', label: '날짜 기반' },
  { value: 'brand', label: '브랜드 기반' },
  { value: 'manual', label: '직접 입력' },
] as const;

type SKUMode = (typeof SKU_MODES)[number]['value'];

const generateSKU = (
  mode: SKUMode,
  categoryId?: number,
  brandId?: number
): string => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  switch (mode) {
    case 'category':
      return `CAT${categoryId ?? 0}-${random}`;
    case 'date': {
      const d = new Date();
      const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(d.getDate()).padStart(2, '0')}`;
      return `${date}-${random}`;
    }
    case 'brand':
      return `BRD${brandId ?? 0}-${random}`;
    default:
      return '';
  }
};

// ─── 바코드 유틸 ──────────────────────────────────────────────────────────────
const generateBarcode = (): string => {
  const digits = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  );
  const checksum =
    (10 -
      (digits.reduce((sum, d, i) => sum + d * (i % 2 === 0 ? 1 : 3), 0) % 10)) %
    10;
  return [...digits, checksum].join('');
};

// ─── Zod 스키마 ───────────────────────────────────────────────────────────────
const FormSchema = z.object({
  name: z.string().min(2, { message: '제품명은 최소 2자 이상이어야 합니다.' }),
  slug: z.string().min(2, { message: '슬러그는 최소 2자 이상이어야 합니다.' }),
  sku: z.string().min(1, { message: 'SKU는 필수입니다.' }),
  barcode: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().min(0, { message: '가격은 0 이상이어야 합니다.' }),
  salePrice: z.number().min(0).optional(),
  brandId: z.number().optional(),
  categoryId: z.number().min(1, { message: '카테고리를 선택하세요.' }),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

interface FilePreview {
  id: string;
  file: File;
  preview: string;
}

// 기존 이미지 (URL 기반)
interface ExistingImage {
  url: string;
  removed: boolean;
}

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { uploadMedia, isLoading: isUploading } = useMedia();
  const { updateProduct, deleteInventory, fetchProductById } = useProducts();
  const { brands, fetchBrands, stores, fetchStores } = useStores();
  const { categoryTree, fetchCategoryTree } = useCategories();

  // ─── 재고 관련 상태 ───────────────────────────────────────────────────────────
  const [inventories, setInventories] = useState(product.inventories ?? []);
  const [inventoryDrawerOpen, setInventoryDrawerOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<
    (typeof inventories)[number] | undefined
  >(undefined);
  const [deletingInventoryId, setDeletingInventoryId] = useState<number | null>(
    null
  );
  const [isDeletingInventory, setIsDeletingInventory] = useState(false);

  // ─── 기존 이미지 상태 (삭제 가능) ────────────────────────────────────────
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    product.imageUrls.map((url) => ({ url, removed: false }))
  );
  // ─── 새 이미지 상태 ───────────────────────────────────────────────────────
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // ─── SKU 모드 (기존 SKU는 'manual' 로 시작) ───────────────────────────────
  const [skuMode, setSkuMode] = useState<SKUMode>('manual');

  useEffect(() => {
    fetchCategoryTree();
    fetchBrands();
    fetchStores();
  }, [fetchCategoryTree, fetchBrands, fetchStores]);

  const flatCategories = useMemo(() => {
    const seen = new Set<number>();
    return categoryTree
      .flatMap((cat) => [cat, ...(cat.children ?? [])])
      .filter((cat) => {
        if (seen.has(cat.id)) return false;
        seen.add(cat.id);
        return true;
      });
  }, [categoryTree]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      barcode: product.barcode ?? '',
      description: product.description ?? '',
      basePrice: product.basePrice,
      salePrice: product.salePrice ?? undefined,
      brandId: product.brandId ?? undefined,
      categoryId: product.categoryId,
      isActive: product.isActive,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
    },
  });

  const categoryIdValue = form.watch('categoryId');

  // SKU 모드 변경 시 자동 재생성 (manual 제외)
  useEffect(() => {
    if (skuMode !== 'manual') {
      form.setValue(
        'sku',
        generateSKU(
          skuMode,
          form.getValues('categoryId'),
          form.getValues('brandId')
        ),
        { shouldValidate: false }
      );
    }
  }, [skuMode, categoryIdValue]);

  // 재고 Drawer 닫힐 때 목록 갱신
  const handleInventoryDrawerClose = useCallback(
    async (open: boolean) => {
      setInventoryDrawerOpen(open);
      if (!open) {
        setEditingInventory(undefined);
        // 최신 재고 목록 반영
        const res = await fetchProductById(product.id);
        if (res?.data?.inventories) setInventories(res?.data?.inventories);
      }
    },
    [fetchProductById, product.id]
  );

  const handleDeleteInventory = async () => {
    if (!deletingInventoryId) return;
    setIsDeletingInventory(true);
    try {
      const res = await deleteInventory(deletingInventoryId);
      if (res.success) {
        toast.success('재고가 삭제되었습니다.');
        setInventories((prev) =>
          prev.filter((i) => i.id !== deletingInventoryId)
        );
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeletingInventory(false);
      setDeletingInventoryId(null);
    }
  };

  // ─── 기존 이미지 삭제 토글 ────────────────────────────────────────────────
  const toggleRemoveExisting = useCallback((url: string) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.url === url ? { ...img, removed: !img.removed } : img
      )
    );
  }, []);

  // ─── 새 파일 관련 ─────────────────────────────────────────────────────────
  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type))
      return '지원되지 않는 파일 형식입니다. (PNG, JPG, WebP만 가능)';
    if (file.size > 5 * 1024 * 1024)
      return '파일 크기는 5MB를 초과할 수 없습니다.';
    return null;
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(newFiles);
      const remaining = existingImages.filter((i) => !i.removed).length;
      if (remaining + files.length + fileArray.length > 5) {
        setUploadError('이미지는 최대 5개까지 가능합니다.');
        return;
      }
      const validFiles: FilePreview[] = [];
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          return;
        }
        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        });
      }
      setFiles((prev) => [...prev, ...validFiles]);
    },
    [files.length, existingImages, validateFile]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) addFiles(target.files);
    };
    input.click();
  }, [addFiles]);

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

  // ─── 폼 제출 ───────────────────────────────────────────────────────────────
  async function onSubmit(data: FormValues) {
    try {
      // 남아있는 기존 이미지 URL
      let imageUrls = existingImages
        .filter((i) => !i.removed)
        .map((i) => i.url);

      // 새 이미지 업로드
      if (files.length > 0 && currentUser?.id) {
        const uploadResult = await uploadMedia(
          files.map((f) => f.file),
          currentUser.id,
          'PRODUCT'
        );
        if (uploadResult.success && uploadResult.data) {
          const response = uploadResult.data;
          const newUrls = response.files
            ? response.files.map((f) => f.fileUrl)
            : response.fileUrl
            ? [response.fileUrl]
            : [];
          imageUrls = [...imageUrls, ...newUrls];
        }
      }

      const result = await updateProduct({
        id: product.id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        barcode: data.barcode || undefined,
        description: data.description || undefined,
        basePrice: data.basePrice,
        salePrice: data.salePrice || undefined,
        categoryId: data.categoryId,
        imageUrls,
        isActive: data.isActive,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
      });

      if (result.success) {
        toast.success('제품이 성공적으로 수정되었습니다!');
        navigate(`/admin/products/${product.id}`);
      } else {
        toast.error(result.error?.message || '제품 수정에 실패했습니다.');
      }
    } catch {
      toast.error('제품 수정 중 오류가 발생했습니다.');
    }
  }

  const isSubmitting = form.formState.isSubmitting || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/admin/products/${product.id}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              제품 수정: {product.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/admin/products/${product.id}`)}
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
          {/* ─── 좌측 ──────────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-4">
            {/* 제품 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>제품 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제품명 *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU + 바코드 */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* SKU */}
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <RadioGroup
                          value={skuMode}
                          onValueChange={(v) => setSkuMode(v as SKUMode)}
                          className="mb-2 flex flex-wrap gap-3"
                        >
                          {SKU_MODES.map((mode) => (
                            <div
                              key={mode.value}
                              className="flex items-center gap-1.5"
                            >
                              <RadioGroupItem
                                value={mode.value}
                                id={`edit-sku-${mode.value}`}
                              />
                              <Label
                                htmlFor={`edit-sku-${mode.value}`}
                                className="cursor-pointer text-sm"
                              >
                                {mode.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={skuMode !== 'manual'}
                              placeholder={
                                skuMode === 'manual'
                                  ? 'SKU를 직접 입력하세요'
                                  : '자동 생성됩니다'
                              }
                              className={skuMode !== 'manual' ? 'bg-muted' : ''}
                            />
                          </FormControl>
                          {skuMode !== 'manual' && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                form.setValue(
                                  'sku',
                                  generateSKU(
                                    skuMode,
                                    form.getValues('categoryId'),
                                    form.getValues('brandId')
                                  ),
                                  { shouldValidate: true }
                                )
                              }
                              title="SKU 재생성"
                            >
                              <RefreshCwIcon className="size-4" />
                            </Button>
                          )}
                        </div>
                        <FormDescription>
                          {skuMode === 'manual'
                            ? '기존 SKU를 유지하거나 직접 수정하세요.'
                            : '방식 선택 시 자동 재생성됩니다.'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 바코드 */}
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>바코드 (EAN-13)</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="바코드를 입력하거나 재생성하세요"
                              className="font-mono text-xs"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              form.setValue('barcode', generateBarcode(), {
                                shouldValidate: true,
                              })
                            }
                            title="바코드 재생성"
                          >
                            <RefreshCwIcon className="size-4" />
                          </Button>
                        </div>
                        {field.value && field.value.length === 13 && (
                          <div className="mt-2 flex justify-center rounded-md border bg-white p-3">
                            <Barcode
                              value={field.value}
                              format="EAN13"
                              width={1.5}
                              height={60}
                              fontSize={12}
                              margin={4}
                            />
                          </div>
                        )}
                        <FormDescription>
                          스캐너로 찍으면 해당 제품을 조회할 수 있습니다.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 이미지 */}
            <Card>
              <CardHeader>
                <CardTitle>제품 이미지</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ── 기존 이미지 (삭제 가능) ─────────────────────────────── */}
                {existingImages.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      현재 이미지{' '}
                      <span className="text-xs">
                        (✕ 클릭 시 저장 시 삭제됩니다)
                      </span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {existingImages.map((img) => (
                        <div key={img.url} className="relative aspect-square">
                          <img
                            src={img.url}
                            alt="기존 이미지"
                            className={`size-full rounded-md border object-cover transition-opacity ${
                              img.removed ? 'opacity-30' : ''
                            }`}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant={img.removed ? 'outline' : 'destructive'}
                            onClick={() => toggleRemoveExisting(img.url)}
                            className="absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                            title={img.removed ? '삭제 취소' : '이미지 삭제'}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                          {img.removed && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-md">
                              <span className="bg-destructive/80 rounded px-1 text-xs text-white">
                                삭제 예정
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 새 이미지 업로드 ─────────────────────────────────────── */}
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    새 이미지 추가
                  </p>
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-40 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center"
                  >
                    {files.length > 0 ? (
                      <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            새 이미지 ({files.length}개)
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openFileDialog}
                            disabled={
                              existingImages.filter((i) => !i.removed).length +
                                files.length >=
                              5
                            }
                          >
                            <UploadIcon className="mr-1 size-3.5" />더 추가
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {files.map((file) => (
                            <div
                              key={file.id}
                              className="bg-accent relative aspect-square rounded-md border"
                            >
                              <img
                                src={file.preview}
                                alt={file.file.name}
                                className="size-full rounded-[inherit] object-cover"
                              />
                              <Button
                                type="button"
                                onClick={() => removeFile(file.id)}
                                size="icon"
                                className="border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                              >
                                <XIcon className="size-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="bg-background mb-1 flex size-10 items-center justify-center rounded-full border">
                          <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          이미지를 드롭하거나 선택하세요
                        </p>
                        <p className="text-muted-foreground text-xs">
                          PNG, JPG, WebP (최대 5MB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={openFileDialog}
                        >
                          <UploadIcon className="mr-1 size-3.5" />
                          이미지 선택
                        </Button>
                      </div>
                    )}
                  </div>
                  {uploadError && (
                    <div
                      className="text-destructive mt-2 flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── 우측 ──────────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 가격 */}
            <Card>
              <CardHeader>
                <CardTitle>가격 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기본 가격 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          type="number"
                          min={0}
                          step={0.01}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>할인 가격</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : parseFloat(e.target.value)
                            )
                          }
                          type="number"
                          min={0}
                          step={0.01}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 재고 관리 */}
            <Card>
              <CardHeader>
                <CardTitle>재고 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventories.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    등록된 재고가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {inventories.map((inv) => {
                      const storeName =
                        stores.find((s) => s.id === inv.storeId)?.name ??
                        `매장 #${inv.storeId}`;
                      const isLow = inv.stock <= inv.minStock;
                      return (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{storeName}</p>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                              <span>{inv.stock}개</span>
                              {isLow && (
                                <Badge className="text-xs">재고 부족</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => {
                                setEditingInventory(inv);
                                setInventoryDrawerOpen(true);
                              }}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive size-7"
                              onClick={() => setDeletingInventoryId(inv.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setEditingInventory(undefined);
                    setInventoryDrawerOpen(true);
                  }}
                >
                  <PlusIcon className="mr-1 size-3.5" />
                  매장 재고 추가
                </Button>
              </CardContent>
            </Card>

            {/* 브랜드 */}
            <Card>
              <CardHeader>
                <CardTitle>브랜드</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>브랜드</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) =>
                            field.onChange(v ? Number(v) : undefined)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="브랜드 선택 (선택사항)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {brands.map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={String(brand.id)}
                                >
                                  {brand.name}
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
              </CardContent>
            </Card>

            {/* 상태 */}
            <Card>
              <CardHeader>
                <CardTitle>상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['isActive', 'isAvailable', 'isFeatured'] as const).map(
                  (key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <Label>
                            {key === 'isActive'
                              ? '활성화'
                              : key === 'isAvailable'
                              ? '판매 가능'
                              : '추천 상품'}
                          </Label>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </CardContent>
            </Card>

            {/* 카테고리 */}
            <Card>
              <CardHeader>
                <CardTitle>카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리 *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {flatCategories.map((cat) => (
                                <SelectItem
                                  key={`cat-${cat.id}`}
                                  value={String(cat.id)}
                                >
                                  {cat.parentId ? `└ ${cat.name}` : cat.name}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      {/* 재고 수정/추가 Drawer */}
      <InventoryMutateDrawer
        open={inventoryDrawerOpen}
        onOpenChange={handleInventoryDrawerClose}
        inventory={
          editingInventory
            ? { ...editingInventory, product: undefined }
            : undefined
        }
        productId={product.id}
      />

      {/* 재고 삭제 확인 Dialog */}
      <AlertDialog
        open={!!deletingInventoryId}
        onOpenChange={(open) => !open && setDeletingInventoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>재고 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 재고 항목을 삭제합니다. 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInventory}
              disabled={isDeletingInventory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingInventory ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
