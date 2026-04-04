import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Edit2,
  FolderOpen,
  Folder,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@starcoex-frontend/categories';
import { useDialogState } from '@/hooks/use-dialog-state';
import { CategoryMutateDrawer } from './category-mutate-drawer';
import { CategoryDetailDrawer } from '@/app/pages/dashboard/ecommerce/categories/details/components/category-detail-drawer';

interface Props {
  category: Category;
  depth: number;
  overId: number | null;
  visibleIds: Set<number> | null;
}

export function CategoryTreeItem({
  category,
  depth,
  overId,
  visibleIds,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useDialogState<'edit' | 'detail'>(null);

  const hasChildren = category.children && category.children.length > 0;
  const isOver = overId === category.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <li ref={setNodeRef} style={style}>
        {/* 드롭 대상 하이라이트 */}
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-3 transition-colors',
            isOver && 'bg-primary/10 border-primary border-l-2',
            isDragging && 'opacity-40',
            depth > 0 && 'border-l border-dashed'
          )}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
        >
          {/* 드래그 핸들 */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>

          {/* 펼치기/접기 */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-7 w-7"
            onClick={() => setIsExpanded((prev) => !prev)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
          </Button>

          {/* 폴더 아이콘 */}
          {hasChildren ? (
            <FolderOpen
              className="h-4 w-4 shrink-0"
              style={{
                color:
                  (category.metadata?.['colorTheme'] as string) ||
                  'hsl(var(--primary))',
              }}
            />
          ) : (
            <Folder
              className="h-4 w-4 shrink-0"
              style={{
                color:
                  (category.metadata?.['colorTheme'] as string) ||
                  'hsl(var(--muted-foreground))',
              }}
            />
          )}

          {/* 카테고리 정보 */}
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Button
              variant="ghost"
              className="hover:text-primary h-auto truncate p-0 text-sm font-medium transition-colors"
              onClick={() => setOpen('detail')}
            >
              {category.name}
            </Button>
            <span className="text-muted-foreground hidden truncate text-xs sm:block">
              {category.slug}
            </span>
          </div>

          {/* 우측 정보 */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-muted-foreground text-xs">
              상품 {category.productCount}개
            </span>
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? '활성' : '비활성'}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setOpen('edit')}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* 하위 카테고리 재귀 렌더링 */}
        {hasChildren && isExpanded && (
          <SortableContext
            items={(category.children ?? []).map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {(category.children ?? [])
                .filter((child) => !visibleIds || visibleIds.has(child.id))
                .map((child) => (
                  <CategoryTreeItem
                    key={child.id}
                    category={child}
                    depth={depth + 1}
                    overId={overId}
                    visibleIds={visibleIds}
                  />
                ))}
            </ul>
          </SortableContext>
        )}
      </li>

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
