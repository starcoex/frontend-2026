import { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
import { usePromotions } from '@starcoex-frontend/promotions';
import type { Promotion } from '@starcoex-frontend/promotions';

interface PromotionsRowActionsProps {
  promotion: Promotion;
}

export function PromotionsRowActions({ promotion }: PromotionsRowActionsProps) {
  const navigate = useNavigate();
  const { changePromotionStatus, deletePromotion } = usePromotions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async () => {
    const newStatus = promotion.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const res = await changePromotionStatus({
      id: promotion.id,
      status: newStatus,
    });
    if (res.success) {
      toast.success(
        newStatus === 'ACTIVE'
          ? '프로모션이 활성화되었습니다.'
          : '프로모션이 일시 정지되었습니다.'
      );
    } else {
      toast.error((res as any).error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deletePromotion({ id: promotion.id, hardDelete: false });
    setIsDeleting(false);
    setDeleteDialogOpen(false);

    if (res.success) {
      toast.success('프로모션이 삭제되었습니다.');
    } else {
      toast.error((res as any).error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const canToggle =
    promotion.status === 'ACTIVE' || promotion.status === 'PAUSED';

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
            onSelect={() => navigate(`/admin/promotions/${promotion.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/promotions/${promotion.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          {canToggle && (
            <DropdownMenuItem onSelect={handleToggleActive}>
              {promotion.status === 'ACTIVE' ? (
                <>
                  <PauseCircle className="mr-2 h-4 w-4" />
                  일시 정지
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  활성화
                </>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로모션 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{promotion.name}</span> 프로모션을
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
