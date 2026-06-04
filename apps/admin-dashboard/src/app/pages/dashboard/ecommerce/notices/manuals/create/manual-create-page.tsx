import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
  tags: z.string().optional(), // 콤마 구분 문자열 → 배열 변환
  order: z.number().min(0),
  version: z.string().optional(),
  changeLog: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ManualCreatePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { manualCategories, fetchAdminManualCategories, createManual } =
    useNotices();
  const { uploadMedia, isLoading: isUploading } = useMedia();

  const [imageFiles, setImageFiles] = useState<MediaFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<MediaFile[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchAdminManualCategories();
  }, [fetchAdminManualCategories]);

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
      version: '1.0.0',
      changeLog: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting || isUploading;

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  async function onSubmit(data: FormValues) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 이미지 업로드
      let imageMediaIds: string[] = [];
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
        imageMediaIds = uploaded?.files
          ? uploaded.files.map((f) => f.fileId ?? f.fileUrl)
          : uploaded?.fileUrl
          ? [uploaded.fileUrl]
          : [];
      }

      // 동영상 업로드
      let videoMediaIds: string[] = [];
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
        videoMediaIds = uploaded?.files
          ? uploaded.files.map((f) => f.fileId ?? f.fileUrl)
          : uploaded?.fileUrl
          ? [uploaded.fileUrl]
          : [];
      }

      const res = await createManual({
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
        imageMediaIds,
        videoMediaIds,
      });

      if (res.success) {
        toast.success(res.data?.message ?? '매뉴얼이 생성되었습니다.');
        navigate('/admin/notices/manuals');
      } else {
        toast.error(res.error?.message ?? '매뉴얼 생성에 실패했습니다.');
      }
    } catch {
      toast.error('매뉴얼 생성 중 오류가 발생했습니다.');
    }
  }

  return (
    <>
      <PageHead
        title={`매뉴얼 추가 - ${COMPANY_INFO.name}`}
        description="새로운 매뉴얼을 등록하세요."
        keywords={['매뉴얼 추가', COMPANY_INFO.name]}
        og={{
          title: `매뉴얼 추가 - ${COMPANY_INFO.name}`,
          description: '매뉴얼 등록',
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
              <h1 className="text-2xl font-bold tracking-tight">매뉴얼 추가</h1>
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
            {/* 좌측: 본문 + 미디어 */}
            <div className="space-y-4 lg:col-span-4">
              {/* 기본 정보 */}
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
                          <Input
                            {...field}
                            placeholder="매뉴얼 제목을 입력하세요"
                          />
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
                          <Input
                            {...field}
                            placeholder="검색 미리보기용 요약 (선택)"
                          />
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
                        <FormLabel>내용 * (Markdown 지원)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="매뉴얼 내용을 Markdown 형식으로 작성하세요."
                            rows={16}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 이미지 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle>이미지</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManualMediaUploader
                    label="이미지"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    mediaType="image"
                    files={imageFiles}
                    maxCount={10}
                    maxSizeMB={10}
                    isUploading={isUploading}
                    onChange={setImageFiles}
                  />
                </CardContent>
              </Card>

              {/* 동영상 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle>동영상</CardTitle>
                </CardHeader>
                <CardContent>
                  <ManualMediaUploader
                    label="동영상"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    mediaType="video"
                    files={videoFiles}
                    maxCount={5}
                    maxSizeMB={500}
                    isUploading={isUploading}
                    onChange={setVideoFiles}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 우측: 설정 */}
            <div className="space-y-4 lg:col-span-2">
              {/* 분류 */}
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
                          <Input {...field} placeholder="admin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 태그 */}
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

              {/* 버전 및 정렬 */}
              <Card>
                <CardHeader>
                  <CardTitle>버전 및 정렬</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>초기 버전</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1.0.0" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          semver 형식 (예: 1.0.0)
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
                            placeholder="최초 작성 내용 메모 (선택)"
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
