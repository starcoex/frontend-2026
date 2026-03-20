import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseBulkDeleteOptions<T extends { id: number }> {
  onDelete: (
    ids: number[]
  ) => Promise<{ success: boolean; error?: { message?: string } }>;
  onSuccess?: () => void;
  itemLabel?: string;
  getRowId?: (row: T) => number;
}

export interface UseBulkDeleteReturn {
  isDialogOpen: boolean;
  isDeleting: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  handleConfirm: () => Promise<void>;
}

export function useBulkDelete<T extends { id: number }>(
  selectedRows: T[],
  options: UseBulkDeleteOptions<T>
): UseBulkDeleteReturn {
  const {
    onDelete,
    onSuccess,
    itemLabel = '항목',
    getRowId = (row) => row.id,
  } = options;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialog = useCallback(() => {
    if (selectedRows.length === 0) return;
    setIsDialogOpen(true);
  }, [selectedRows.length]);

  const closeDialog = useCallback(() => {
    if (isDeleting) return;
    setIsDialogOpen(false);
  }, [isDeleting]);

  const handleConfirm = useCallback(async () => {
    if (selectedRows.length === 0) return;

    const ids = selectedRows.map(getRowId);
    setIsDeleting(true);

    try {
      const res = await onDelete(ids);
      if (res.success) {
        toast.success(`${ids.length}개의 ${itemLabel}이(가) 삭제되었습니다.`);
        onSuccess?.();
        setIsDialogOpen(false);
      } else {
        toast.error(res.error?.message ?? `${itemLabel} 삭제에 실패했습니다.`);
      }
    } catch {
      toast.error(`${itemLabel} 삭제 중 오류가 발생했습니다.`);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRows, getRowId, onDelete, onSuccess, itemLabel]);

  return {
    isDialogOpen,
    isDeleting,
    openDialog,
    closeDialog,
    handleConfirm,
  };
}
