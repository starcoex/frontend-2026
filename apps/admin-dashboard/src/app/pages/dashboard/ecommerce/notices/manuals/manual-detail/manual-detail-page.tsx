import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Pencil,
  Send,
  Archive,
  Loader2,
  ImageIcon,
  Film,
  History,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotices } from '@starcoex-frontend/notices';
import type { ManualHistory } from '@starcoex-frontend/notices';
import { ManualStatusBadge } from '@/app/pages/dashboard/ecommerce/notices/components/notice-status-badge';

export default function ManualDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentManual,
    isLoading,
    error,
    fetchManualById,
    fetchManualHistories,
    publishManual,
    archiveManual,
  } = useNotices();

  const [histories, setHistories] = useState<ManualHistory[]>([]);
  const [historiesLoading, setHistoriesLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchManualById(parseInt(id));
  }, [id, fetchManualById]);

  const loadHistories = async () => {
    if (!id) return;
    setHistoriesLoading(true);
    try {
      const res = await fetchManualHistories(parseInt(id));
      if (res.success && res.data) {
        setHistories(res.data);
      }
    } finally {
      setHistoriesLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!currentManual) return;
    const res = await publishManual({ id: currentManual.id });
    if (res.success) {
      toast.success('매뉴얼이 발행되었습니다.');
    } else {
      toast.error(res.error?.message ?? '발행에 실패했습니다.');
    }
  };

  const handleArchive = async () => {
    if (!currentManual) return;
    const res = await archiveManual({ id: currentManual.id });
    if (res.success) {
      toast.success('매뉴얼이 종료되었습니다.');
    } else {
      toast.error(res.error?.message ?? '종료에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            매뉴얼 정보를 불러오는 중...
          </p>
        </div>
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
          매뉴얼 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const canPublish = currentManual.status === 'DRAFT';
  const canArchive = currentManual.status === 'PUBLISHED';

  return (
    <>
      <PageHead
        title={`${currentManual.title} - ${COMPANY_INFO.name}`}
        description="매뉴얼 상세 정보"
        keywords={['매뉴얼 상세', currentManual.title, COMPANY_INFO.name]}
        og={{
          title: `${currentManual.title} - ${COMPANY_INFO.name}`,
          description: currentManual.summary ?? '매뉴얼 상세 정보',
          image: '/images/og-notices.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/admin/notices/manuals')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                  {currentManual.title}
                </h1>
                <p className="text-muted-foreground font-mono text-xs">
                  v{currentManual.version}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap items-center gap-2 text-sm">
              <span>
                {format(new Date(currentManual.createdAt), 'yyyy년 MM월 dd일', {
                  locale: ko,
                })}
              </span>
              {currentManual.category && (
                <>
                  <span>·</span>
                  <Badge variant="outline" className="text-xs">
                    {currentManual.category.name}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canPublish && (
              <Button variant="outline" onClick={handlePublish}>
                <Send className="mr-1 h-4 w-4" />
                발행
              </Button>
            )}
            {canArchive && (
              <Button variant="outline" onClick={handleArchive}>
                <Archive className="mr-1 h-4 w-4" />
                종료
              </Button>
            )}
            <Button
              onClick={() => navigate(`/admin/notices/manuals/${id}/edit`)}
            >
              <Pencil className="mr-1 h-4 w-4" />
              수정
            </Button>
          </div>
        </div>

        {/* 상태 + 태그 */}
        <div className="flex flex-wrap items-center gap-2">
          <ManualStatusBadge status={currentManual.status} />
          <Badge variant="outline" className="text-xs">
            {currentManual.targetApp}
          </Badge>
          {currentManual.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* 요약 */}
        {currentManual.summary && (
          <p className="text-muted-foreground rounded-lg border bg-muted/30 px-4 py-3 text-sm">
            {currentManual.summary}
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-6">
          {/* 탭: 본문 / 이미지 / 동영상 / 히스토리 */}
          <div className="lg:col-span-4">
            <Tabs
              defaultValue="content"
              onValueChange={(v) => {
                if (v === 'history' && histories.length === 0) loadHistories();
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">
                  본문
                </TabsTrigger>
                <TabsTrigger value="images" className="flex-1">
                  <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                  이미지
                  {currentManual.imageMediaIds?.length > 0 && (
                    <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                      {currentManual.imageMediaIds.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex-1">
                  <Film className="mr-1.5 h-3.5 w-3.5" />
                  동영상
                  {currentManual.videoMediaIds?.length > 0 && (
                    <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                      {currentManual.videoMediaIds.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  <History className="mr-1.5 h-3.5 w-3.5" />
                  버전 이력
                </TabsTrigger>
              </TabsList>

              {/* 본문 */}
              <TabsContent value="content" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                      {currentManual.content}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 이미지 */}
              <TabsContent value="images" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      이미지 ({currentManual.imageMediaIds?.length ?? 0}개)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!currentManual.imageMediaIds?.length ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">
                        등록된 이미지가 없습니다.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {currentManual.imageMediaIds.map((mediaId, idx) => (
                          <button
                            key={mediaId}
                            type="button"
                            className="group bg-muted relative aspect-video overflow-hidden rounded-lg border transition-opacity hover:opacity-90"
                            onClick={() => setPreviewImage(mediaId)}
                          >
                            <img
                              src={mediaId}
                              alt={`이미지 ${idx + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                              <ImageIcon className="h-6 w-6 text-white drop-shadow" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 동영상 */}
              <TabsContent value="videos" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      동영상 ({currentManual.videoMediaIds?.length ?? 0}개)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!currentManual.videoMediaIds?.length ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">
                        등록된 동영상이 없습니다.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {currentManual.videoMediaIds.map((mediaId, idx) => (
                          <div key={mediaId} className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              동영상 {idx + 1}
                            </p>
                            <video
                              src={mediaId}
                              controls
                              className="w-full rounded-lg border"
                              onError={(e) => {
                                const parent = (e.target as HTMLVideoElement)
                                  .parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="flex items-center justify-center h-20 rounded-lg border bg-muted text-muted-foreground text-sm gap-2"><svg class="h-4 w-4" /><span>동영상을 불러올 수 없습니다.</span></div>`;
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 버전 히스토리 */}
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">버전 변경 이력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historiesLoading ? (
                      <div className="flex h-24 items-center justify-center">
                        <Loader2 className="text-primary h-5 w-5 animate-spin" />
                      </div>
                    ) : histories.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">
                        버전 이력이 없습니다.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {[...histories]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          .map((h, idx) => (
                            <div key={h.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="bg-primary size-2.5 rounded-full" />
                                {idx < histories.length - 1 && (
                                  <div className="bg-border w-px flex-1" />
                                )}
                              </div>
                              <div className="pb-3">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-xs"
                                  >
                                    v{h.version}
                                  </Badge>
                                  <span className="text-muted-foreground text-xs">
                                    {format(
                                      new Date(h.createdAt),
                                      'yyyy.MM.dd HH:mm',
                                      { locale: ko }
                                    )}
                                  </span>
                                </div>
                                {h.changeLog && (
                                  <p className="text-muted-foreground mt-1 text-xs">
                                    {h.changeLog}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 우측: 메타 정보 */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">매뉴얼 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태</span>
                  <ManualStatusBadge status={currentManual.status} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">버전</span>
                  <span className="font-mono text-xs">
                    v{currentManual.version}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">정렬 순서</span>
                  <span>{currentManual.order}</span>
                </div>
                <Separator />
                {currentManual.publishedAt && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">발행일</span>
                      <span>
                        {format(
                          new Date(currentManual.publishedAt),
                          'MM/dd HH:mm',
                          { locale: ko }
                        )}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">생성일</span>
                  <span>
                    {format(new Date(currentManual.createdAt), 'MM/dd HH:mm', {
                      locale: ko,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수정일</span>
                  <span>
                    {format(new Date(currentManual.updatedAt), 'MM/dd HH:mm', {
                      locale: ko,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 대상 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">대상 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">대상 사업</span>
                  <Badge variant="outline" className="text-xs">
                    {currentManual.targetBusiness}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">대상 앱</span>
                  <Badge variant="outline" className="text-xs">
                    {currentManual.targetApp}
                  </Badge>
                </div>
                {currentManual.category && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">카테고리</span>
                    <Badge variant="outline" className="text-xs">
                      {currentManual.category.name}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 연관 매뉴얼 */}
            {currentManual.relatedManualIds?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">연관 매뉴얼</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {currentManual.relatedManualIds.map((relId) => (
                      <button
                        key={relId}
                        type="button"
                        className="text-primary hover:underline text-sm"
                        onClick={() =>
                          navigate(`/admin/notices/manuals/${relId}`)
                        }
                      >
                        매뉴얼 #{relId}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 미리보기 다이얼로그 */}
      <Dialog
        open={!!previewImage}
        onOpenChange={(o) => !o && setPreviewImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>이미지 미리보기</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage}
              alt="미리보기"
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
