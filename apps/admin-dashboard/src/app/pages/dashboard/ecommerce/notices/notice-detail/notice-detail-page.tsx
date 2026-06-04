import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pencil, Send, Archive, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotices } from '@starcoex-frontend/notices';
import {
  NoticeStatusBadge,
  NoticeTypeBadge,
} from '@/app/pages/dashboard/ecommerce/notices/components/notice-status-badge';

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentNotice,
    isLoading,
    error,
    fetchNoticeById,
    publishNotice,
    archiveNotice,
  } = useNotices();

  useEffect(() => {
    if (id) fetchNoticeById(parseInt(id));
  }, [id, fetchNoticeById]);

  const handlePublish = async () => {
    if (!currentNotice) return;
    const res = await publishNotice({ id: currentNotice.id });
    if (res.success) {
      toast.success('공지가 발행되었습니다.');
    } else {
      toast.error(res.error?.message ?? '발행에 실패했습니다.');
    }
  };

  const handleArchive = async () => {
    if (!currentNotice) return;
    const res = await archiveNotice({ id: currentNotice.id });
    if (res.success) {
      toast.success('공지가 종료되었습니다.');
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
            공지 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentNotice) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '공지를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/notices')}>
          공지 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const canPublish =
    currentNotice.status === 'DRAFT' || currentNotice.status === 'SCHEDULED';
  const canArchive = currentNotice.status === 'PUBLISHED';

  return (
    <>
      <PageHead
        title={`${currentNotice.title} - ${COMPANY_INFO.name}`}
        description="공지사항 상세 정보"
        keywords={['공지 상세', currentNotice.title, COMPANY_INFO.name]}
        og={{
          title: `${currentNotice.title} - ${COMPANY_INFO.name}`,
          description: '공지사항 상세 정보',
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
                onClick={() => navigate('/admin/notices')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                {currentNotice.title}
              </h1>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap gap-2 text-sm">
              <span>
                {format(
                  new Date(currentNotice.createdAt),
                  'yyyy년 MM월 dd일 HH:mm',
                  {
                    locale: ko,
                  }
                )}
              </span>
              {currentNotice.isPinned && (
                <Badge variant="outline">📌 고정</Badge>
              )}
              {currentNotice.isPopup && <Badge variant="outline">팝업</Badge>}
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
            <Button onClick={() => navigate(`/admin/notices/${id}/edit`)}>
              <Pencil className="mr-1 h-4 w-4" />
              수정
            </Button>
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <NoticeStatusBadge status={currentNotice.status} />
          <NoticeTypeBadge type={currentNotice.type} />
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* 본문 */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>공지 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                {currentNotice.content}
              </div>
            </CardContent>
          </Card>

          {/* 메타 정보 */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>공지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태</span>
                  <NoticeStatusBadge status={currentNotice.status} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">타입</span>
                  <NoticeTypeBadge type={currentNotice.type} />
                </div>
                <Separator />
                {currentNotice.publishedAt && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">발행일</span>
                      <span>
                        {format(
                          new Date(currentNotice.publishedAt),
                          'MM/dd HH:mm',
                          {
                            locale: ko,
                          }
                        )}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                {currentNotice.scheduledAt && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">예약 발행</span>
                      <span>
                        {format(
                          new Date(currentNotice.scheduledAt),
                          'MM/dd HH:mm',
                          {
                            locale: ko,
                          }
                        )}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                {currentNotice.visibleFrom && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">노출 시작</span>
                    <span>
                      {format(
                        new Date(currentNotice.visibleFrom),
                        'MM/dd HH:mm',
                        {
                          locale: ko,
                        }
                      )}
                    </span>
                  </div>
                )}
                {currentNotice.visibleUntil && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">노출 종료</span>
                    <span>
                      {format(
                        new Date(currentNotice.visibleUntil),
                        'MM/dd HH:mm',
                        {
                          locale: ko,
                        }
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentNotice.targetApps?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>대상 앱</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentNotice.targetApps.map((app) => (
                      <Badge key={app} variant="outline">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
