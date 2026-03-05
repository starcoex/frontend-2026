import { Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Suggestion } from '@starcoex-frontend/suggestions';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import { SuggestionMutateDrawer } from './suggestion-mutate-drawer';
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

interface Props {
  row: Row<Suggestion>;
}

export function SuggestionRowActions({ row }: Props) {
  const suggestion = row.original;
  const { deleteSuggestion } = useSuggestions();
  const [open, setOpen] = useDialogState<'edit'>(null);

  const handleDelete = async () => {
    if (window.confirm(`건의사항 #${suggestion.id}을(를) 삭제하시겠습니까?`)) {
      await deleteSuggestion(suggestion.id);
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
            <DropdownMenuItem asChild>
              <Link to={`/admin/suggestions/${suggestion.id}`}>상세 보기</Link>
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

      <SuggestionMutateDrawer
        key="suggestion-edit"
        open={open === 'edit'}
        onOpenChange={() => setOpen(null)}
        currentRow={suggestion}
      />
    </>
  );
}
