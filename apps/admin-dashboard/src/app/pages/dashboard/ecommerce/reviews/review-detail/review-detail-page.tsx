import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReviews } from '@starcoex-frontend/reviews';
import {
  Loader2,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Edit3Icon,
  Trash2Icon,
  EyeOff,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  REVIEW_STATUS_CONFIG,
  REVIEW_TYPE_CONFIG,
} from '@/app/pages/dashboard/ecommerce/reviews/data/review-data';

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentReview,
    isLoading,
    error,
    fetchReviewById,
    deleteReview,
    changeReviewStatus,
  } = useReviews();

  useEffect(() => {
    if (id) fetchReviewById(parseInt(id));
  }, [id, fetchReviewById]);

  const handleDelete = async () => {
    if (!currentReview) return;
    const res = await deleteReview({ id: currentReview.id });
    if (res.success) {
      toast.success('리뷰가 삭제되었습니다.');
      navigate('/admin/reviews');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const handleToggleStatus = async () => {
    if (!currentReview) return;
    const newStatus = currentReview.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    const res = await changeReviewStatus({
      id: currentReview.id,
      status: newStatus,
    });
    if (res.success) {
      toast.success(
        newStatus === 'HIDDEN'
          ? '리뷰가 숨김 처리되었습니다.'
          : '리뷰가 활성화되었습니다.'
      );
    } else {
      toast.error(res.error?.message ?? '처리에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            리뷰 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentReview) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '리뷰를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/reviews')}>
          리뷰 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const statusConfig = REVIEW_STATUS_CONFIG[currentReview.status];
  const typeConfig = REVIEW_TYPE_CONFIG[currentReview.type];

  return (
    <>
      <PageHead
        title={`${currentReview.title} - ${COMPANY_INFO.name}`}
        description={currentReview.content}
        keywords={['리뷰 상세', currentReview.title, COMPANY_INFO.name]}
        og={{
          title: `${currentReview.title} - ${COMPANY_INFO.name}`,
          description: currentReview.content,
          image: currentReview.imageUrls?.[0] ?? '/images/og-reviews.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <h1 className="font-display text-xl tracking-tight lg:text-2xl">
              {currentReview.title}
            </h1>
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              <Badge variant="outline">{typeConfig.label}</Badge>
              <div className="flex items-center gap-1">
                <Star className="size-3.5 fill-orange-400 text-orange-400" />
                <span>{currentReview.rating.toFixed(1)}</span>
              </div>
              <span>작성자 ID: #{currentReview.userId}</span>
              <span>
                {format(new Date(currentReview.createdAt), 'yyyy.MM.dd HH:mm')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleStatus}>
              {currentReview.status === 'ACTIVE' ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  숨김
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  활성화
                </>
              )}
            </Button>
            <Button onClick={() => navigate(`/admin/reviews/${id}/edit`)}>
              <Edit3Icon className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 스탯 카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted flex items-center gap-4 rounded-lg border p-4">
            <Star className="size-6 fill-orange-400 text-orange-400 opacity-80" />
            <div>
              <p className="text-muted-foreground text-sm">평점</p>
              <p className="text-lg font-semibold">
                {currentReview.rating.toFixed(1)} / 5.0
              </p>
            </div>
          </div>
          <div className="bg-muted flex items-center gap-4 rounded-lg border p-4">
            <ThumbsUp className="size-6 opacity-60" />
            <div>
              <p className="text-muted-foreground text-sm">도움됨</p>
              <p className="text-lg font-semibold">
                {currentReview.helpfulCount}
              </p>
            </div>
          </div>
          <div className="bg-muted flex items-center gap-4 rounded-lg border p-4">
            <MessageSquare className="size-6 opacity-60" />
            <div>
              <p className="text-muted-foreground text-sm">댓글 수</p>
              <p className="text-lg font-semibold">
                {currentReview.comments?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              개요
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">
              댓글
              {(currentReview.comments?.length ?? 0) > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {currentReview.comments?.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="votes" className="flex-1">
              투표
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 xl:grid-cols-3">
                  <div className="space-y-4 xl:col-span-2">
                    <div>
                      <h3 className="mb-2 font-semibold">리뷰 내용</h3>
                      <p className="text-muted-foreground">
                        {currentReview.content}
                      </p>
                    </div>
                    {currentReview.imageUrls?.length > 0 && (
                      <div>
                        <h3 className="mb-2 font-semibold">첨부 이미지</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {currentReview.imageUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`리뷰 이미지 ${i + 1}`}
                              className="aspect-square rounded-md border object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="rounded-md border xl:col-span-1">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-semibold">
                            리뷰 ID
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            #{currentReview.id}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">유형</TableCell>
                          <TableCell className="text-right">
                            {typeConfig.label}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">
                            대상 유형
                          </TableCell>
                          <TableCell className="text-right">
                            {currentReview.targetType}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">
                            대상 ID
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            #{currentReview.targetId}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">
                            작성자
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            #{currentReview.userId}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">상태</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">
                            작성일
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {format(
                              new Date(currentReview.createdAt),
                              'yyyy.MM.dd HH:mm'
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 댓글 탭 */}
          <TabsContent value="comments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>댓글 목록</CardTitle>
                <CardAction>
                  <span className="text-muted-foreground text-sm">
                    총 {currentReview.comments?.length ?? 0}개
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                {(currentReview.comments?.length ?? 0) === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-sm">
                      댓글이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentReview.comments?.map((comment) => (
                      <div key={comment.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-muted-foreground">
                            사용자 #{comment.userId}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {comment.status}
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                              {format(
                                new Date(comment.createdAt),
                                'yyyy.MM.dd'
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                        {(comment.replies?.length ?? 0) > 0 && (
                          <div className="mt-2 ml-4 space-y-2 border-l pl-3">
                            {comment.replies?.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <span className="font-mono text-xs text-muted-foreground mr-2">
                                  #{reply.userId}
                                </span>
                                {reply.content}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 투표 탭 */}
          <TabsContent value="votes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>투표 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <ThumbsUp className="size-8 text-green-500 opacity-80" />
                    <div>
                      <p className="text-muted-foreground text-sm">도움됨</p>
                      <p className="text-2xl font-bold">
                        {currentReview.helpfulCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <ThumbsDown className="size-8 text-red-500 opacity-80" />
                    <div>
                      <p className="text-muted-foreground text-sm">도움안됨</p>
                      <p className="text-2xl font-bold">
                        {currentReview.notHelpfulCount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
