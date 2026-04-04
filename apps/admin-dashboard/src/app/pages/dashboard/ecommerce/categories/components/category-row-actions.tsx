import { Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Edit2 } from 'lucide-react';
import type { Category } from '@starcoex-frontend/categories';
import { useCategories } from '@starcoex-frontend/categories';
import { CategoryMutateDrawer } from './category-mutate-drawer';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDialogState } from '@/hooks/use-dialog-state';
import { CategoryDetailDrawer } from '@/app/pages/dashboard/ecommerce/categories/details/components/category-detail-drawer';

interface Props {
  row: Row<Category>;
}

export function CategoryRowActions({ row }: Props) {
  const category = row.original;
  const { deleteCategory, fetchCategoryTree } = useCategories();
  const [open, setOpen] = useDialogState<'edit' | 'detail'>(null);

  const handleDelete = async () => {
    if (window.confirm(`카테고리 "${category.name}"을(를) 삭제하시겠습니까?`)) {
      await deleteCategory(category.id);
      await fetchCategoryTree();
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" onClick={() => setOpen('edit')}>
          <Edit2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setOpen('detail')}>
              상세 보기
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpen('edit')}>
              수정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              삭제
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CategoryMutateDrawer
        key={`edit-${category.id}`}
        open={open === 'edit'}
        onOpenChange={() => setOpen(null)}
        currentRow={category}
      />
      <CategoryDetailDrawer
        key={`detail-${category.id}`}
        open={open === 'detail'}
        onOpenChange={() => setOpen(null)}
        category={category}
      />
    </>
  );
}
