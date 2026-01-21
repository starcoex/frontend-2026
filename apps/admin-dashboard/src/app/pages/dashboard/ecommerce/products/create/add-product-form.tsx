import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ChevronLeft,
  CirclePlusIcon,
  ImageIcon,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import AddNewCategory from '@/app/pages/dashboard/ecommerce/products/create/add-category';
import { useAuth } from '@starcoex-frontend/auth';
import { useMedia } from '@starcoex-frontend/media';
import React, { useCallback, useState } from 'react';
import { useProducts } from '@starcoex-frontend/products';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: '제품명은 최소 2자 이상이어야 합니다.',
  }),
  sku: z.string(),
  barcode: z.string(),
  description: z.string(),
  file: z.string(),
  variants: z.string(),
  price: z.string(),
  status: z.string(),
  category: z.string(),
  sub_category: z.string(),
});

interface FilePreview {
  id: string;
  file: File;
  preview: string;
}

export default function AddProductForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { uploadMedia, isLoading: isUploading } = useMedia();
  const { createProduct } = useProducts();
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      price: '',
      status: 'draft',
      category: '',
      sub_category: '',
    },
  });

  // 파일 유효성 검사
  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return '지원되지 않는 파일 형식입니다. (PNG, JPG, JPEG, WebP만 가능)';
    }

    if (file.size > maxSize) {
      return '파일 크기는 5MB를 초과할 수 없습니다.';
    }

    return null;
  }, []);

  // 파일 추가
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

  // 파일 제거
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // 드래그 앤 드롭 핸들러
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

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [addFiles]
  );

  // 파일 선택 다이얼로그
  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        addFiles(target.files);
      }
    };
    input.click();
  }, [addFiles]);

  // 폼 제출
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      let imageUrls: string[] = [];

      // 1. 이미지 업로드 (선택사항)
      if (files.length > 0) {
        const uploadFiles = files.map((f) => f.file);
        const uploadResult = await uploadMedia(
          uploadFiles,
          currentUser.id,
          'PRODUCT'
        );

        if (!uploadResult.success || !uploadResult.data) {
          toast.error('이미지 업로드에 실패했습니다.');
          return;
        }

        // UploadResponse 타입에 맞게 처리
        const response = uploadResult.data;

        if (response.files) {
          // 다중 업로드 응답
          imageUrls = response.files.map((f) => f.fileUrl);
        } else if (response.fileUrl) {
          // 단일 업로드 응답
          imageUrls = [response.fileUrl];
        }
      }

      // 2. 제품 생성 API 호출
      const basePrice = parseFloat(data.price) || 0;
      const categoryId = data.category ? parseInt(data.category) : 0;

      if (!categoryId) {
        toast.error('카테고리를 선택해주세요.');
        return;
      }

      const response = await createProduct({
        name: data.name,
        sku: data.sku,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'), // 자동 생성
        barcode: data.barcode || undefined,
        description: data.description || undefined,
        basePrice,
        categoryId,
        brandId: undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        isActive: true,
        isAvailable: true,
        isFeatured: false,
      });

      if (response.success && response.data) {
        toast.success('제품이 성공적으로 등록되었습니다!');
        navigate('/admin/products');
      } else {
        toast.error(response.error?.message || '제품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('제품 등록 중 오류가 발생했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/products">
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">제품 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary">
              취소
            </Button>
            <Button type="button" variant="outline">
              임시 저장
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <UploadIcon className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                '등록하기'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>제품 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제품명</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="제품명을 입력하세요" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SKU 코드" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>바코드</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="바코드 번호" />
                          </FormControl>
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
                        <FormLabel>설명 (선택사항)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="제품 설명을 입력하세요"
                          />
                        </FormControl>
                        <FormDescription>
                          제품에 대한 상세 설명을 작성하여 검색 노출을 높이세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                      <span className="hidden lg:block">URL에서 추가</span>
                      <span className="block lg:hidden">URL 추가</span>
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
                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
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

            {/* 옵션/변형 */}
            <Card className="pb-0">
              <CardHeader>
                <CardTitle>제품 옵션</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  name="variants"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="grid gap-4 lg:grid-flow-col">
                        <FormItem>
                          <FormLabel>옵션</FormLabel>
                          <Select {...field}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="옵션 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="size">사이즈</SelectItem>
                                <SelectItem value="color">색상</SelectItem>
                                <SelectItem value="weight">무게</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                        <FormItem>
                          <FormLabel>값</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="예: L, XL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormItem>
                          <FormLabel>가격</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="추가 금액" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
              <CardFooter className="justify-center border-t p-0!">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full rounded-tl-none rounded-tr-none"
                >
                  <CirclePlusIcon className="mr-2 h-4 w-4" />
                  옵션 추가
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {/* 가격 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>가격 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>기본 가격</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="₩ 0" type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tax" />
                    <label
                      htmlFor="tax"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      이 제품에 세금 부과
                    </label>
                  </div>
                  <hr />
                  <div className="flex items-center space-x-2">
                    <Switch id="stock" defaultChecked />
                    <Label htmlFor="stock">재고 있음</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상태 */}
            <Card>
              <CardHeader>
                <CardTitle>상태</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select {...field} defaultValue="draft">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="draft">임시 저장</SelectItem>
                              <SelectItem value="active">활성</SelectItem>
                              <SelectItem value="archived">보관됨</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>제품 상태를 설정하세요.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 카테고리 */}
            <Card>
              <CardHeader>
                <CardTitle>카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="grow">
                              <Select {...field}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="카테고리 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="electronics">
                                      전자제품
                                    </SelectItem>
                                    <SelectItem value="clothing">
                                      의류
                                    </SelectItem>
                                    <SelectItem value="accessories">
                                      액세서리
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <AddNewCategory />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="sub_category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="grow">
                              <Select {...field}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="하위 카테고리 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="toys">완구</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <AddNewCategory />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
