import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ChevronLeft,
  ImageIcon,
  Loader2,
  RefreshCwIcon,
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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Link, useNavigate } from 'react-router-dom';
import { AddMediaFromUrl } from '@/app/pages/dashboard/ecommerce/products/create/add-media-from-url';
import { useAuth } from '@starcoex-frontend/auth';
import { useMedia } from '@starcoex-frontend/media';
import { useCategories } from '@starcoex-frontend/categories';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import Barcode from 'react-barcode';
import { InitialInventoryManager } from '@/app/pages/dashboard/ecommerce/products/inventory/components/initial-inventory-manager';
import {
  FUEL_TYPE_OPTIONS,
  FUEL_TYPE_SKU_PREFIX,
  PRODUCT_TYPE_SKU_PREFIX,
  type ProductTypeCode,
} from '@/app/constants/product-type-codes';

// ─── 유틸: 슬러그 자동 생성 ────────────────────────────────────────────────────
const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-');

// EAN-13 체크섬 포함 자동 생성
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

/**
 * ProductType 기반 SKU 생성
 * FUEL + 유종: FUEL-DSL-AB12C
 * 기타 타입:   CW-AB12C
 * 타입 없음:   GEN-AB12C
 */
const generateSKUByType = (typeCode?: string, fuelType?: string): string => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  if (!typeCode) return `GEN-${random}`;

  const prefix = PRODUCT_TYPE_SKU_PREFIX[typeCode as ProductTypeCode] ?? 'GEN';

  if (typeCode === 'FUEL' && fuelType) {
    const fuelPrefix = FUEL_TYPE_SKU_PREFIX[fuelType] ?? 'FUEL';
    return `${prefix}-${fuelPrefix}-${random}`;
  }

  return `${prefix}-${random}`;
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
  productTypeId: z.number().optional(),
  fuelType: z.string().optional(),
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

export default function AddProductForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { uploadMedia, isLoading: isUploading } = useMedia();
  const { createProduct, productTypes } = useProducts();
  const { brands, fetchBrands, stores, fetchStores } = useStores();
  const { categoryTree, fetchCategoryTree } = useCategories();

  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // ✅ SKU 자동/수동 모드만 유지
  const [skuManual, setSkuManual] = useState(false);

  const [initialInventories, setInitialInventories] = useState<
    Array<{
      storeId: number;
      stock: number;
      minStock: number;
      maxStock: number;
      reorderPoint?: number;
      reorderQuantity?: number;
      storePrice?: number;
      costPrice?: number;
      isAvailable: boolean;
    }>
  >([]);
  const initialInventoriesRef = useRef(initialInventories);

  useEffect(() => {
    initialInventoriesRef.current = initialInventories;
  }, [initialInventories]);

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
      name: '',
      slug: '',
      sku: generateSKUByType(),
      barcode: generateBarcode(),
      description: '',
      basePrice: 0,
      salePrice: undefined,
      categoryId: 0,
      productTypeId: undefined,
      fuelType: undefined,
      isActive: true,
      isAvailable: true,
      isFeatured: false,
    },
  });

  const productTypeIdValue = form.watch('productTypeId');
  const fuelTypeValue = form.watch('fuelType');
  const selectedProductType = productTypes.find(
    (pt) => pt.id === productTypeIdValue
  );
  const isFuelType = selectedProductType?.code === 'FUEL';

  // ✅ 타입 또는 유종 변경 시 SKU 자동 재생성
  useEffect(() => {
    if (!skuManual) {
      form.setValue(
        'sku',
        generateSKUByType(selectedProductType?.code, fuelTypeValue),
        { shouldValidate: false }
      );
    }
  }, [productTypeIdValue, fuelTypeValue, skuManual, selectedProductType?.code]);

  // 이름 변경 시 슬러그 자동 생성
  const nameValue = form.watch('name');
  useEffect(() => {
    if (nameValue) {
      form.setValue('slug', generateSlug(nameValue), { shouldValidate: false });
    }
  }, [nameValue, form]);

  // ─── 파일 유효성 검사 ──────────────────────────────────────────────────────

  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type))
      return '지원되지 않는 파일 형식입니다. (PNG, JPG, JPEG, WebP만 가능)';
    if (file.size > maxSize) return '파일 크기는 5MB를 초과할 수 없습니다.';
    return null;
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(newFiles);
      if (files.length + fileArray.length > 5) {
        setUploadError('최대 5개의 이미지만 업로드할 수 있습니다.');
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
    [files.length, validateFile]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

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
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) addFiles(target.files);
    };
    input.click();
  }, [addFiles]);

  // ─── 폼 제출 ───────────────────────────────────────────────────────────────

  async function onSubmit(data: FormValues) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      let imageUrls: string[] = [];

      if (files.length > 0) {
        const uploadResult = await uploadMedia(
          files.map((f) => f.file),
          currentUser.id
        );
        if (!uploadResult.success || !uploadResult.data) {
          toast.error('이미지 업로드에 실패했습니다.');
          return;
        }
        const response = uploadResult.data;
        imageUrls = response.files
          ? response.files.map((f) => f.fileUrl)
          : response.fileUrl
          ? [response.fileUrl]
          : [];
      }

      const result = await createProduct({
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        barcode: data.barcode || undefined,
        description: data.description || undefined,
        basePrice: data.basePrice,
        salePrice: data.salePrice || undefined,
        categoryId: data.categoryId,
        productTypeId: data.productTypeId,
        metadata:
          isFuelType && data.fuelType ? { fuelType: data.fuelType } : undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        isActive: data.isActive,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        initialInventories:
          initialInventories.length > 0
            ? initialInventories.map((inv) => ({
                storeId: inv.storeId,
                stock: inv.stock,
                minStock: inv.minStock,
                maxStock: inv.maxStock,
                reorderPoint: inv.reorderPoint,
                reorderQuantity: inv.reorderQuantity,
                storePrice: inv.storePrice,
                costPrice: inv.costPrice,
                isAvailable: inv.isAvailable,
              }))
            : undefined,
      });

      if (result.success) {
        toast.success('제품이 성공적으로 등록되었습니다!');
        navigate('/admin/products');
      } else {
        toast.error(result.error?.message || '제품 등록에 실패했습니다.');
      }
    } catch {
      toast.error('제품 등록 중 오류가 발생했습니다.');
    }
  }

  const isSubmitting = form.formState.isSubmitting || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ─── 헤더 ──────────────────────────────────────────────────────── */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/products">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">제품 추가</h1>
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
          {/* ─── 좌측: 메인 정보 ─────────────────────────────────────────── */}
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
                        <Input {...field} placeholder="제품명을 입력하세요" />
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
                        <Input {...field} placeholder="url-friendly-slug" />
                      </FormControl>
                      <FormDescription>
                        제품명 입력 시 자동 생성됩니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU + 바코드 */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <div className="flex items-center gap-2 mb-2">
                          <Switch
                            id="sku-manual"
                            checked={skuManual}
                            onCheckedChange={(v) => {
                              setSkuManual(v);
                              if (!v) {
                                form.setValue(
                                  'sku',
                                  generateSKUByType(
                                    selectedProductType?.code,
                                    fuelTypeValue
                                  )
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor="sku-manual"
                            className="text-xs cursor-pointer"
                          >
                            직접 입력
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={!skuManual}
                              placeholder={
                                skuManual ? 'SKU 직접 입력' : '자동 생성됩니다'
                              }
                              className={
                                !skuManual
                                  ? 'bg-muted font-mono text-xs'
                                  : 'font-mono text-xs'
                              }
                            />
                          </FormControl>
                          {!skuManual && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                form.setValue(
                                  'sku',
                                  generateSKUByType(
                                    selectedProductType?.code,
                                    fuelTypeValue
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
                          {skuManual
                            ? '직접 입력 — 중복 없는 고유 코드를 입력하세요.'
                            : `상품 타입 기반 자동 생성 (예: ${generateSKUByType(
                                selectedProductType?.code,
                                fuelTypeValue
                              )})`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                              placeholder="바코드 입력 또는 자동 생성"
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
                        <Textarea
                          {...field}
                          placeholder="제품 설명을 입력하세요"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        제품에 대한 상세 설명을 작성하여 검색 노출을 높이세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 제품 이미지 */}
            <Card>
              <CardHeader>
                <CardTitle>제품 이미지</CardTitle>
                <CardAction>
                  <AddMediaFromUrl>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-0! h-auto p-0"
                    >
                      URL에서 추가
                    </Button>
                  </AddMediaFromUrl>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center"
                  >
                    {files.length > 0 ? (
                      <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-medium">
                            업로드된 파일 ({files.length}/5)
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openFileDialog}
                            disabled={files.length >= 5}
                          >
                            <UploadIcon className="-ms-0.5 size-3.5 opacity-60" />
                            더 추가
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div
                          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                          aria-hidden="true"
                        >
                          <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">
                          이미지를 여기에 드롭하세요
                        </p>
                        <p className="text-muted-foreground text-xs">
                          PNG, JPG, WebP (최대 5MB, 최대 5개)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={openFileDialog}
                        >
                          <UploadIcon className="-ms-1 opacity-60" />
                          이미지 선택
                        </Button>
                      </div>
                    )}
                  </div>
                  {uploadError && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
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

          {/* ─── 우측: 설정 (3개 카드로 압축) ─────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            {/* ✅ 상품 분류 — 타입 + 카테고리 + 브랜드 통합 */}
            <Card>
              <CardHeader>
                <CardTitle>상품 분류</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 상품 타입 */}
                <FormField
                  control={form.control}
                  name="productTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상품 타입</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) =>
                            field.onChange(
                              v === '__none__' ? undefined : Number(v)
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="타입 선택 (선택사항)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="__none__">
                                선택 안 함
                              </SelectItem>
                              {productTypes.map((pt) => (
                                <SelectItem key={pt.id} value={String(pt.id)}>
                                  <span className="font-mono text-xs mr-1">
                                    {pt.code}
                                  </span>
                                  {pt.name}
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

                {/* FUEL 타입 시 유종 선택 */}
                {isFuelType && (
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>유종 *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="유종 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {FUEL_TYPE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
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
                )}

                {/* 카테고리 */}
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

                {/* 브랜드 */}
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
                            field.onChange(
                              v === '__none__' ? undefined : Number(v)
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="브랜드 선택 (선택사항)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="__none__">
                                선택 안 함
                              </SelectItem>
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

            {/* 가격 설정 */}
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
                          placeholder="0"
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
                          placeholder="0"
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

            {/* 상태 */}
            <Card>
              <CardHeader>
                <CardTitle>상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <Label htmlFor="isActive">활성화</Label>
                      <FormControl>
                        <Switch
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <Label htmlFor="isAvailable">판매 가능</Label>
                      <FormControl>
                        <Switch
                          id="isAvailable"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <Label htmlFor="isFeatured">추천 상품</Label>
                      <FormControl>
                        <Switch
                          id="isFeatured"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 초기 재고 설정 */}
            <InitialInventoryManager
              stores={stores}
              value={initialInventories}
              onChange={setInitialInventories}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
