import { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Copy,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useReviews } from '@starcoex-frontend/reviews';
import type { Review } from '@starcoex-frontend/reviews';

interface ReviewRowActionsProps {
  review: Review;
}

export function ReviewRowActions({ review }: ReviewRowActionsProps) {
  const navigate = useNavigate();
  const { deleteReview, changeReviewStatus } = useReviews();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(review.id));
    toast.success('리뷰 ID가 복사되었습니다.');
  };

  const handleHide = async () => {
    const res = await changeReviewStatus({ id: review.id, status: 'HIDDEN' });
    if (res.success) {
      toast.success('리뷰가 숨김 처리되었습니다.');
    } else {
      toast.error(res.error?.message ?? '처리에 실패했습니다.');
    }
  };

  const handleActivate = async () => {
    const res = await changeReviewStatus({ id: review.id, status: 'ACTIVE' });
    if (res.success) {
      toast.success('리뷰가 활성화되었습니다.');
    } else {
      toast.error(res.error?.message ?? '처리에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteReview({ id: review.id });
      if (res.success) {
        toast.success('리뷰가 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/reviews/${review.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/reviews/${review.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            ID 복사
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {review.status === 'ACTIVE' ? (
            <DropdownMenuItem onSelect={handleHide}>
              <EyeOff className="mr-2 h-4 w-4" />
              숨김 처리
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={handleActivate}>
              <Eye className="mr-2 h-4 w-4" />
              활성화
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">"{review.title}"</span> 리뷰를
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
