import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { generateAvatarFallback } from '@/lib/utils';

interface Review {
  id: number;
  name: string;
  title: string;
  body: string;
  rating: number;
  date: string;
}

interface ProductReviewListProps {
  reviews?: Review[];
  reviewCount?: number;
}

export default function ProductReviewList({
  reviews = [],
  reviewCount = 0,
}: ProductReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          아직 등록된 리뷰가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="grid gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <Avatar className="size-10">
              <AvatarFallback>
                {generateAvatarFallback(review.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid grow gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{review.name}</div>
                <div className="text-muted-foreground text-xs">
                  {review.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <div className="flex items-center gap-1">
                    <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                    <div className="text-muted-foreground text-sm">
                      {review.rating.toFixed(1)}
                    </div>
                  </div>
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-semibold">{review.title}</div>
            <div className="text-muted-foreground text-sm">{review.body}</div>
          </div>
        </div>
      ))}
      {reviewCount > reviews.length && (
        <div className="text-center">
          <Button variant="outline">더 보기</Button>
        </div>
      )}
    </div>
  );
}
