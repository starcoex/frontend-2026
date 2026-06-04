import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotices } from '@starcoex-frontend/notices';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import type { NoticeBusinessType } from '@starcoex-frontend/notices';
import {
  ManualMediaUploader,
  type MediaFile,
} from '@/app/pages/dashboard/ecommerce/notices/manuals/components/manual-media-uploader';

const BUSINESS_TYPE_OPTIONS: { value: NoticeBusinessType; label: string }[] = [
  { value: 'ZERAGAE_CARCARE', label: '제라게 카케어' },
  { value: 'SINHAN_NETWORKS', label: '신한 네트웍스' },
  { value: 'STAR_GAS_STATION', label: '별표 주유소' },
  { value: 'SHADE_CANOPY', label: '그늘막' },
  { value: 'COMMON', label: '공통' },
];

const FormSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요.').max(300),
  content: z.string().min(1, '내용을 입력하세요.'),
  categoryId: z.number().min(1, '카테고리를 선택하세요.'),
  targetBusiness: z.enum([
    'ZERAGAE_CARCARE',
    'SINHAN_NETWORKS',
    'STAR_GAS_STATION',
    'SHADE_CANOPY',
    'COMMON',
  ]),
  targetApp: z.string().min(1, '대상 앱을 입력하세요.'),
  summary: z.string().optional(),
  order: z.number().min(0),
  version: z.string().optional(),
  changeLog: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ManualEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    currentManual,
    manualCategories,
    isLoading,
    error,
    fetchManualById,
    fetchAdminManualCategories,
    updateManual,
  } = useNotices();
  const { uploadMedia, isLoading: isMediaUploading } = useMedia();

  const [imageFiles, setImageFiles] = useState<MediaFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 기존 미디어 ID (편집 시 유지)
  const [existingImageIds, setExistingImageIds] = useState<string[]>([]);
  const [existingVideoIds, setExistingVideoIds] = useState<string[]>([]);

  useEffect(() => {
    if (id) fetchManualById(parseInt(id));
    fetchAdminManualCategories();
  }, [id, fetchManualById, fetchAdminManualCategories]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: 0,
      targetBusiness: 'COMMON',
      targetApp: 'admin',
      summary: '',
      order: 0,
      version: '',
      changeLog: '',
    },
  });

  // 매뉴얼 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (currentManual && id && currentManual.id === parseInt(id)) {
      form.reset({
        title: currentManual.title,
        content: currentManual.content,
        categoryId: currentManual.categoryId,
        targetBusiness: currentManual.targetBusiness,
        targetApp: currentManual.targetApp,
        summary: currentManual.summary ?? '',
        order: currentManual.order,
        version: currentManual.version,
        changeLog: '',
      });
      setTags(currentManual.tags ?? []);
      setExistingImageIds(currentManual.imageMediaIds ?? []);
      setExistingVideoIds(currentManual.videoMediaIds ?? []);
    }
  }, [currentManual, id, form]);

  const isSubmitting = form.formState.isSubmitting || isMediaUploading;

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  async function onSubmit(data: FormValues) {
    if (!id || !currentUser?.id) return;

    try {
      // 새 이미지 업로드
      let newImageIds: string[] = [];
      if (imageFiles.length > 0) {
        const res = await uploadMedia(
          imageFiles.map((f) => f.file),
          currentUser.id
        );
        if (!res.success) {
          toast.error('이미지 업로드에 실패했습니다.');
          return;
        }
        const uploaded = res.data;
        newImageIds = uploaded?.files
          ? uploaded.files.map((f) => f.fileId ?? f.fileUrl)
          : uploaded?.fileUrl
          ? [uploaded.fileUrl]
          : [];
      }

      // 새 동영상 업로드
      let newVideoIds: string[] = [];
      if (videoFiles.length > 0) {
        const res = await uploadMedia(
          videoFiles.map((f) => f.file),
          currentUser.id
        );
        if (!res.success) {
          toast.error('동영상 업로드에 실패했습니다.');
          return;
        }
        const uploaded = res.data;
        newVideoIds = uploaded?.files
          ? uploaded.files.map((f) => f.fileId ?? f.fileUrl)
          : uploaded?.fileUrl
          ? [uploaded.fileUrl]
          : [];
      }

      const res = await updateManual({
        id: parseInt(id),
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        targetBusiness: data.targetBusiness,
        targetApp: data.targetApp,
        summary: data.summary || undefined,
        tags,
        order: data.order,
        version: data.version || undefined,
        changeLog: data.changeLog || undefined,
        // 기존 ID + 신규 업로드 ID 병합
        imageMediaIds: [...existingImageIds, ...newImageIds],
        videoMediaIds: [...existingVideoIds, ...newVideoIds],
      });

      if (res.success) {
        toast.success(res.data?.updateMessage ?? '매뉴얼이 수정되었습니다.');
        navigate('/admin/notices/manuals');
      } else {
        toast.error(res.error?.message ?? '매뉴얼 수정에 실패했습니다.');
      }
    } catch {
      toast.error('매뉴얼 수정 중 오류가 발생했습니다.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !currentManual) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '매뉴얼을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/notices/manuals')}>
          매뉴얼 목록으로
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`매뉴얼 수정 - ${COMPANY_INFO.name}`}
        description="매뉴얼을 수정하세요."
        keywords={['매뉴얼 수정', COMPANY_INFO.name]}
        og={{
          title: `매뉴얼 수정 - ${COMPANY_INFO.name}`,
          description: '매뉴얼 수정',
          image: '/images/og-notices.jpg',
          type: 'website',
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* 헤더 */}
          <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="/admin/notices/manuals">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  매뉴얼 수정
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                  v{currentManual.version}
                </p>
              </div>
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
                  '저장하기'
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-6">
            {/* 좌측 */}
            <div className="space-y-4 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>매뉴얼 내용</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>요약</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="요약 (선택)" />
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
                        <FormLabel>내용 * (Markdown)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={16} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 기존 미디어 현황 */}
              {(existingImageIds.length > 0 || existingVideoIds.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>기존 미디어</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {existingImageIds.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-xs font-medium">
                          이미지 ({existingImageIds.length}개)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {existingImageIds.map((id) => (
                            <Badge
                              key={id}
                              variant="outline"
                              className="cursor-pointer font-mono text-xs"
                              onClick={() =>
                                setExistingImageIds((prev) =>
                                  prev.filter((i) => i !== id)
                                )
                              }
                            >
                              {id.slice(0, 12)}… ×
                            </Badge>
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          클릭하면 제거됩니다.
                        </p>
                      </div>
                    )}
                    {existingVideoIds.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-xs font-medium">
                          동영상 ({existingVideoIds.length}개)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {existingVideoIds.map((id) => (
                            <Badge
                              key={id}
                              variant="outline"
                              className="cursor-pointer font-mono text-xs"
                              onClick={() =>
                                setExistingVideoIds((prev) =>
                                  prev.filter((v) => v !== id)
                                )
                              }
                            >
                              {id.slice(0, 12)}… ×
                            </Badge>
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          클릭하면 제거됩니다.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 새 이미지 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle>새 이미지 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManualMediaUploader
                    label="이미지"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    mediaType="image"
                    files={imageFiles}
                    maxCount={10}
                    maxSizeMB={10}
                    isUploading={isSubmitting}
                    onChange={setImageFiles}
                  />
                </CardContent>
              </Card>

              {/* 새 동영상 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle>새 동영상 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManualMediaUploader
                    label="동영상"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    mediaType="video"
                    files={videoFiles}
                    maxCount={5}
                    maxSizeMB={500}
                    isUploading={isSubmitting}
                    onChange={setVideoFiles}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 우측 */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>분류 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리 *</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {manualCategories.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
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
                            {BUSINESS_TYPE_OPTIONS.map((opt) => (
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>태그</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="태그 입력 후 Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      추가
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>버전 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>버전</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1.0.1" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          변경 시 히스토리가 저장됩니다.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="changeLog"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>변경 사항 메모</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="이번 수정 내용"
                            rows={2}
                          />
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
      </Form>
    </>
  );
}
