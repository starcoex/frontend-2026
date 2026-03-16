import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Copy } from 'lucide-react';
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
import { useStores } from '@starcoex-frontend/stores';
import type { Brand } from '@starcoex-frontend/stores';
import { BrandMutateDrawer } from './brand-mutate-drawer';
import { BrandDetailDrawer } from './brand-detail-drawer';

export function BrandRowActions({ brand }: { brand: Brand }) {
  const { deleteBrand } = useStores();
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(brand.id));
    toast.success('브랜드 ID가 복사되었습니다.');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteBrand({ id: brand.id });
      if (res.success) {
        toast.success(`${brand.name}이(가) 삭제되었습니다.`);
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
          <DropdownMenuItem onSelect={() => setDetailOpen(true)}>
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            ID 복사
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

      <BrandDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        brand={brand}
        onEdit={() => {
          setDetailOpen(false);
          setEditOpen(true);
        }}
      />

      <BrandMutateDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        currentRow={brand}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>브랜드 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{brand.name}</span>을(를)
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
