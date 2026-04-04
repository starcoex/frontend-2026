import { useState } from 'react';
import { MoreHorizontal, Eye, Copy, XCircle, Pencil } from 'lucide-react';
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
import { ConfirmDeleteDialog } from '@starcoex-frontend/common';
import type { Reservation } from '@starcoex-frontend/reservations';
import { useReservations } from '@starcoex-frontend/reservations';

interface ReservationRowActionsProps {
  reservation: Reservation;
}

export function ReservationRowActions({
  reservation,
}: ReservationRowActionsProps) {
  const navigate = useNavigate();
  const { deleteReservation } = useReservations();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(reservation.reservationNumber);
    toast.success('예약 번호가 복사되었습니다.');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteReservation(reservation.id);
      if (res.success) {
        toast.success('예약이 삭제되었습니다.');
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
            onSelect={() => navigate(`/admin/reservations/${reservation.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              navigate(`/admin/reservations/${reservation.id}/edit`)
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyNumber}>
            <Copy className="mr-2 h-4 w-4" />
            예약 번호 복사
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="예약 삭제"
        description={
          <>
            예약 번호{' '}
            <span className="font-semibold">
              {reservation.reservationNumber}
            </span>
            을(를) 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    </>
  );
}
