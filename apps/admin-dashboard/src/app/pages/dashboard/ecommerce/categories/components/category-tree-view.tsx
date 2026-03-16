import { useState, useMemo } from 'react';
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
import { CategoryTreeToolbar } from './category-tree-toolbar';

interface Props {
  categories: Category[];
}

// 검색어/상태 필터에 매칭되는 카테고리 id 집합 반환 (조상 포함)
function getVisibleIds(
  categories: Category[],
  search: string,
  statusFilter: 'all' | 'active' | 'inactive'
): Set<number> | null {
  // 필터 없으면 전체 표시
  if (search === '' && statusFilter === 'all') return null;

  const matched = new Set<number>();

  const matchesFilter = (c: Category): boolean => {
    const matchesSearch =
      search === '' || c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? c.isActive : !c.isActive);
    return matchesSearch && matchesStatus;
  };

  // 재귀적으로 매칭된 노드와 조상 수집
  const collect = (nodes: Category[], ancestors: number[]): boolean => {
    let anyMatch = false;
    for (const node of nodes) {
      const childAncestors = [...ancestors, node.id];
      const childMatch = node.children?.length
        ? collect(node.children, childAncestors)
        : false;
      const selfMatch = matchesFilter(node);

      if (selfMatch || childMatch) {
        anyMatch = true;
        matched.add(node.id);
        ancestors.forEach((id) => matched.add(id));
      }
      if (childMatch) {
        childAncestors.forEach((id) => matched.add(id));
      }
    }
    return anyMatch;
  };

  collect(categories, []);
  return matched;
}

export function CategoryTreeView({ categories }: Props) {
  const { moveCategory, updateCategory } = useCategories();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);

  // 필터 상태
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeCategory = activeId
    ? findCategoryById(localCategories, activeId)
    : null;

  const visibleIds = useMemo(
    () => getVisibleIds(localCategories, search, statusFilter),
    [localCategories, search, statusFilter]
  );

  const totalRoot = localCategories.filter(
    (c) => c.parentId === null || c.parentId === undefined
  ).length;
  const totalSub = localCategories.length - totalRoot;

  const filteredList = visibleIds
    ? localCategories.filter((c) => visibleIds.has(c.id))
    : localCategories;
  const filteredRoot = filteredList.filter(
    (c) => c.parentId === null || c.parentId === undefined
  ).length;
  const filteredSub = filteredList.length - filteredRoot;

  const isFiltering = search !== '' || statusFilter !== 'all';

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
      const siblings = localCategories.filter(
        (c) => c.parentId === draggedCategory.parentId
      );
      const oldIndex = siblings.findIndex((c) => c.id === draggedId);
      const newIndex = siblings.findIndex((c) => c.id === targetId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(siblings, oldIndex, newIndex);

      setLocalCategories((prev) => {
        const others = prev.filter(
          (c) => c.parentId !== draggedCategory.parentId
        );
        return [
          ...others,
          ...reordered.map((c, i) => ({ ...c, sortOrder: i })),
        ];
      });

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
    setLocalCategories(categories);
  };

  const rootCategories = localCategories.filter(
    (c) => c.parentId === null || c.parentId === undefined
  );

  return (
    <>
      <CategoryTreeToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalRoot={totalRoot}
        totalSub={totalSub}
        filteredRoot={filteredRoot}
        filteredSub={filteredSub}
        isFiltering={isFiltering}
      />

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
              {rootCategories
                .filter((c) => !visibleIds || visibleIds.has(c.id))
                .map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    depth={0}
                    overId={isFiltering ? null : overId}
                    visibleIds={visibleIds}
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
    </>
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
