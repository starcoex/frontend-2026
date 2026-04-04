import { useState } from 'react';
import { MoreHorizontal, PackagePlus, Settings2, Trash2 } from 'lucide-react';
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
import { useInventory } from '@starcoex-frontend/inventory';
import type { InventoryRow } from './inventory-columns';
import { InventoryAddStockDrawer } from './inventory-add-stock-drawer';
import { InventorySettingsDrawer } from './inventory-settings-drawer';

interface InventoryRowActionsProps {
  inventory: InventoryRow;
}

export function InventoryRowActions({ inventory }: InventoryRowActionsProps) {
  const { deleteStoreInventory } = useInventory();
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteStoreInventory(inventory.id);
      if (res.success) {
        toast.success('재고 항목이 삭제되었습니다.');
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
          <DropdownMenuLabel>재고 관리</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* 케이스 2: 입고 */}
          <DropdownMenuItem onSelect={() => setAddStockOpen(true)}>
            <PackagePlus className="mr-2 h-4 w-4" />
            입고 처리
          </DropdownMenuItem>
          {/* 케이스 3: 설정값 수정 */}
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
            <Settings2 className="mr-2 h-4 w-4" />
            설정 수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 케이스 2: 입고 Drawer */}
      <InventoryAddStockDrawer
        open={addStockOpen}
        onOpenChange={setAddStockOpen}
        inventory={inventory}
      />

      {/* 케이스 3: 설정 수정 Drawer */}
      <InventorySettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        inventory={inventory}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>재고 항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              매장 #{inventory.storeId} · 제품 #{inventory.productId} 재고를
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
