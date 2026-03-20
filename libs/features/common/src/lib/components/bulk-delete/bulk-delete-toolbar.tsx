import { Trash2 } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Button } from '../ui';
import { BulkDeleteDialog } from './bulk-delete-dialog';
import { useBulkDelete, type UseBulkDeleteOptions } from './use-bulk-delete';

interface BulkDeleteToolbarProps<T extends { id: number }> {
  table: Table<T>;
  onDelete: UseBulkDeleteOptions<T>['onDelete'];
  onSuccess?: () => void;
  itemLabel?: string;
  deleteDescription?: string;
}

export function BulkDeleteToolbar<T extends { id: number }>({
  table,
  onDelete,
  onSuccess,
  itemLabel = '항목',
  deleteDescription,
}: BulkDeleteToolbarProps<T>) {
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original);

  const { isDialogOpen, isDeleting, openDialog, closeDialog, handleConfirm } =
    useBulkDelete(selectedRows, {
      onDelete,
      onSuccess: () => {
        table.resetRowSelection();
        onSuccess?.();
      },
      itemLabel,
    });

  if (selectedRows.length === 0) return null;

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={openDialog}
        className="h-8"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        선택 삭제 ({selectedRows.length})
      </Button>

      <BulkDeleteDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        onConfirm={handleConfirm}
        isDeleting={isDeleting}
        count={selectedRows.length}
        itemLabel={itemLabel}
        description={deleteDescription}
      />
    </>
  );
}
