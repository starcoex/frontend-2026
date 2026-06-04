import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { Star } from 'lucide-react';

interface Props {
  driver: DeliveryDriver;
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= value
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }`}
        />
      ))}
      <span className="text-muted-foreground ml-1 text-xs">{value}.0</span>
    </div>
  );
}

export function DriverRatingTab({ driver }: Props) {
  const ratings = driver.ratings;

  // 평균 계산
  const avgRating = driver.avgRating
    ? Number(driver.avgRating)
    : ratings.length > 0
    ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
    : null;

  // 별점 분포
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
    pct:
      ratings.length > 0
        ? Math.round(
            (ratings.filter((r) => r.rating === star).length / ratings.length) *
              100
          )
        : 0,
  }));

  return (
    <div className="space-y-4">
      {/* 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-1 text-sm">평균 평점</p>
            <p className="text-4xl font-bold">
              {avgRating != null ? avgRating.toFixed(1) : '-'}
            </p>
            {avgRating != null && (
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              총 {ratings.length}개 리뷰
            </p>
          </CardContent>
        </Card>

        {/* 별점 분포 */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">별점 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right">{star}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right text-xs">
                  {count}건
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 리뷰 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">리뷰 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                아직 리뷰가 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map((r) => (
                <div key={r.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <StarRating value={r.rating} />
                    <span className="text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  {/* 카테고리 평점 */}
                  {(r as any).speedRating != null && (
                    <div className="flex flex-wrap gap-2">
                      {(r as any).speedRating != null && (
                        <Badge variant="outline" className="text-xs">
                          속도 {(r as any).speedRating}점
                        </Badge>
                      )}
                      {(r as any).serviceRating != null && (
                        <Badge variant="outline" className="text-xs">
                          서비스 {(r as any).serviceRating}점
                        </Badge>
                      )}
                      {(r as any).accuracyRating != null && (
                        <Badge variant="outline" className="text-xs">
                          정확성 {(r as any).accuracyRating}점
                        </Badge>
                      )}
                    </div>
                  )}

                  {r.comment && <p className="text-sm">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
