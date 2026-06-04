import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
import { BulkDeleteDialog } from '@starcoex-frontend/common';
import type { DeliveryFeePolicy } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';

interface DeliveryPricingRowActionsProps {
  policy: DeliveryFeePolicy;
  onEdit: (policy: DeliveryFeePolicy) => void;
  onDeleted: (id: number) => void;
}

export function DeliveryPricingRowActions({
  policy,
  onEdit,
  onDeleted,
}: DeliveryPricingRowActionsProps) {
  const { deleteDeliveryFeePolicy } = useDelivery();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteDeliveryFeePolicy(policy.id);
      if (res.success) {
        toast.success('정책이 삭제되었습니다.');
        onDeleted(policy.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
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
          <DropdownMenuItem onSelect={() => onEdit(policy)}>
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
            disabled={policy.isDefault}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {policy.isDefault ? '기본 정책은 삭제 불가' : '삭제'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BulkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        count={1}
        itemLabel="정책"
        description={`"${policy.name}" 정책을 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
      />
    </>
  );
}
