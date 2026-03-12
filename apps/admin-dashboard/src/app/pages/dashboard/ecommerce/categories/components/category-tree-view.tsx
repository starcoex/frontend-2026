import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Category } from '@starcoex-frontend/categories';
import { useCategories } from '@starcoex-frontend/categories';
import { CategoryTreeItem } from './category-tree-item';

interface Props {
  categories: Category[];
}

export function CategoryTreeView({ categories }: Props) {
  const { moveCategory, updateCategory } = useCategories();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  // ✅ 로컬 순서 상태 (드래그 후 즉시 UI 반영)
  const [localCategories, setLocalCategories] = useState(categories);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeCategory = activeId
    ? findCategoryById(localCategories, activeId)
    : null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(Number(active.id));
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over ? Number(over.id) : null);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const draggedId = Number(active.id);
    const targetId = Number(over.id);

    const draggedCategory = findCategoryById(localCategories, draggedId);
    const targetCategory = findCategoryById(localCategories, targetId);

    if (!draggedCategory || !targetCategory) return;

    const isSameLevel = draggedCategory.parentId === targetCategory.parentId;

    if (isSameLevel) {
      // ✅ 같은 레벨 → sortOrder 재계산
      const siblings = localCategories.filter(
        (c) => c.parentId === draggedCategory.parentId
      );
      const oldIndex = siblings.findIndex((c) => c.id === draggedId);
      const newIndex = siblings.findIndex((c) => c.id === targetId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(siblings, oldIndex, newIndex);

      // ✅ UI 즉시 반영
      setLocalCategories((prev) => {
        const others = prev.filter(
          (c) => c.parentId !== draggedCategory.parentId
        );
        return [
          ...others,
          ...reordered.map((c, i) => ({ ...c, sortOrder: i })),
        ];
      });

      // ✅ TS7030 수정 - 항상 Promise 반환하도록 filter로 undefined 제거
      await Promise.all(
        reordered
          .map((c, i) => {
            if (c.sortOrder !== i) {
              return updateCategory({ id: c.id, sortOrder: i });
            }
            return null;
          })
          .filter((p): p is ReturnType<typeof updateCategory> => p !== null)
      );
    } else {
      await moveCategory(draggedId, targetCategory.parentId ?? undefined);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    setLocalCategories(categories); // ✅ 취소 시 원래 상태로 복구
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="rounded-md border">
        <SortableContext
          items={localCategories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y">
            {/* ✅ 최상위 카테고리만 렌더링 (parentId가 null인 것만) */}
            {localCategories
              .filter((c) => c.parentId === null || c.parentId === undefined)
              .map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  depth={0}
                  overId={overId}
                />
              ))}
          </ul>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCategory && (
          <div className="bg-background flex items-center gap-2 rounded-md border px-4 py-3 shadow-lg">
            <span className="font-medium">{activeCategory.name}</span>
            <span className="text-muted-foreground text-xs">
              {activeCategory.slug}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function findCategoryById(categories: Category[], id: number): Category | null {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children?.length) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
}
