import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, ImageIcon,  XIcon } from 'lucide-react';
import { AddMediaFromUrl } from '@/app/pages/dashboard/ecommerce/products/create/add-media-from-url';
import type { PromotionFormValues } from './promotion-form-schema';
import {
  DISCOUNT_TYPE_OPTIONS,
  PROMOTION_TYPE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/promotions/data/promotion-data';


interface FilePreview {
  id: string;
  file: File;
  preview: string;
}

const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type))
    return '지원되지 않는 파일 형식입니다. (PNG, JPG, WebP만 가능)';
  if (file.size > 5 * 1024 * 1024)
    return '파일 크기는 5MB를 초과할 수 없습니다.';
  return null;
};

interface Step2Props {
  form: UseFormReturn<PromotionFormValues>;
  // 업로드된 URL을 부모에 전달
  onImageChange: (
    type: 'image' | 'banner',
    file: File | null,
    existingUrl: string | null
  ) => void;
  existingImageUrl: string | null;
  existingBannerUrl: string | null;
}

export function PromotionCreateStep2({
  form,
  onImageChange,
  existingImageUrl,
  existingBannerUrl,
}: Step2Props) {
  const discountType = form.watch('discountType');

  const [imageFile, setImageFile] = useState<FilePreview | null>(null);
  const [bannerFile, setBannerFile] = useState<FilePreview | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  const handleFileSelect = useCallback(
    (file: File, type: 'image' | 'banner') => {
      const error = validateImageFile(file);
      if (error) {
        if (type === 'image') setImageError(error);
        else setBannerError(error);
        return;
      }
      const preview: FilePreview = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      };
      if (type === 'image') {
        if (imageFile) URL.revokeObjectURL(imageFile.preview);
        setImageError(null);
        setImageFile(preview);
        onImageChange('image', file, existingImageUrl);
      } else {
        if (bannerFile) URL.revokeObjectURL(bannerFile.preview);
        setBannerError(null);
        setBannerFile(preview);
        onImageChange('banner', file, existingBannerUrl);
      }
    },
    [imageFile, bannerFile, existingImageUrl, existingBannerUrl, onImageChange]
  );

  const openFileDialog = useCallback(
    (type: 'image' | 'banner') => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/jpg,image/webp';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileSelect(file, type);
      };
      input.click();
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(
    (type: 'image' | 'banner') => {
      if (type === 'image') {
        if (imageFile) URL.revokeObjectURL(imageFile.preview);
        setImageFile(null);
        onImageChange('image', null, null);
      } else {
        if (bannerFile) URL.revokeObjectURL(bannerFile.preview);
        setBannerFile(null);
        onImageChange('banner', null, null);
      }
    },
    [imageFile, bannerFile, onImageChange]
  );

  const makeDragHandlers = (type: 'image' | 'banner') => ({
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      type === 'image' ? setIsDraggingImage(true) : setIsDraggingBanner(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      type === 'image' ? setIsDraggingImage(false) : setIsDraggingBanner(false);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      type === 'image' ? setIsDraggingImage(false) : setIsDraggingBanner(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file, type);
    },
  });

  const ImageZone = ({
    type,
    label,
    description,
    file,
    existingUrl,
    isDragging,
    error,
  }: {
    type: 'image' | 'banner';
    label: string;
    description: string;
    file: FilePreview | null;
    existingUrl: string | null;
    isDragging: boolean;
    error: string | null;
  }) => {
    const currentSrc = file?.preview ?? existingUrl;
    const dragHandlers = makeDragHandlers(type);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{label}</p>
          <AddMediaFromUrl>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              URL에서 추가
            </Button>
          </AddMediaFromUrl>
        </div>
        <p className="text-muted-foreground text-xs">{description}</p>
        {currentSrc ? (
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src={currentSrc}
              alt={label}
              className={`w-full object-cover ${
                type === 'banner' ? 'h-28' : 'h-36'
              }`}
            />
            <Button
              type="button"
              size="icon"
              className="border-background absolute right-2 top-2 size-6 rounded-full border-2 shadow-sm"
              onClick={() => removeFile(type)}
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div
            {...dragHandlers}
            data-dragging={isDragging || undefined}
            className="border-input data-[dragging=true]:bg-accent/50 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 transition-colors"
            onClick={() => openFileDialog(type)}
          >
            <div className="bg-background mb-2 flex size-9 items-center justify-center rounded-full border">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="text-xs font-medium">드롭하거나 클릭</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              PNG, JPG, WebP (최대 5MB)
            </p>
          </div>
        )}
        {error && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 할인 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">할인 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로모션 타입 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROMOTION_TYPE_OPTIONS.map((opt) => (
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
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>할인 타입 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DISCOUNT_TYPE_OPTIONS.map((opt) => (
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    할인{' '}
                    {discountType === 'PERCENTAGE' ? '비율 (%)' : '금액 (₩)'} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step={discountType === 'PERCENTAGE' ? 0.1 : 1}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {discountType === 'PERCENTAGE' ? (
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 할인 금액 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="제한 없음"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 주문 금액 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="제한 없음"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* PERCENTAGE일 때 minOrderAmount 추가 표시 */}
          {discountType === 'PERCENTAGE' && (
            <FormField
              control={form.control}
              name="minOrderAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최소 주문 금액 (₩)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      placeholder="제한 없음"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : parseFloat(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* 이미지 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로모션 이미지</CardTitle>
          <CardDescription>
            프로모션 대표 이미지와 배너를 등록하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageZone
            type="image"
            label="대표 이미지"
            description="목록 및 상세 페이지에 표시됩니다."
            file={imageFile}
            existingUrl={existingImageUrl}
            isDragging={isDraggingImage}
            error={imageError}
          />
          <ImageZone
            type="banner"
            label="배너 이미지"
            description="메인 배너에 표시됩니다. (권장: 1200×400)"
            file={bannerFile}
            existingUrl={existingBannerUrl}
            isDragging={isDraggingBanner}
            error={bannerError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
