import { useState, useMemo, useEffect } from 'react';
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

// flat 배열 → id 기준 트리 재조립
function buildTree(flat: Category[]): Category[] {
  const map = new Map<number, Category>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));

  const roots: Category[] = [];
  map.forEach((node) => {
    if (node.parentId === null || node.parentId === undefined) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentId);
      if (parent) {
        (parent.children ??= []).push(node);
      } else {
        // 부모가 flat에 없으면 root로 fallback
        roots.push(node);
      }
    }
  });

  // sortOrder 기준 정렬 (재귀)
  const sortNodes = (nodes: Category[]): Category[] =>
    nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((n) => ({ ...n, children: sortNodes(n.children ?? []) }));

  return sortNodes(roots);
}

// flat 배열 전체에서 id로 찾기
function findFlatById(flat: Category[], id: number): Category | null {
  return flat.find((c) => c.id === id) ?? null;
}

// 검색어/상태 필터에 매칭되는 id 집합 반환 (트리 기준, 조상 포함)
function getVisibleIds(
  tree: Category[],
  search: string,
  statusFilter: 'all' | 'active' | 'inactive'
): Set<number> | null {
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
        childAncestors.forEach((id) => matched.add(id));
      }
    }
    return anyMatch;
  };

  collect(tree, []);
  return matched;
}

// 트리에서 전체 노드 수 카운트 (재귀)
function countAllNodes(nodes: Category[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countAllNodes(n.children ?? []), 0);
}

export function CategoryTreeView({ categories }: Props) {
  const { updateCategory, moveCategory } = useCategories();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [localFlat, setLocalFlat] = useState<Category[]>(categories);

  // categories prop이 변경될 때 localFlat 동기화
  useEffect(() => {
    setLocalFlat(categories);
  }, [categories]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // flat → tree 재조립 (렌더링용)
  const treeCategories = useMemo(() => buildTree(localFlat), [localFlat]);

  const activeCategory = activeId ? findFlatById(localFlat, activeId) : null;

  const visibleIds = useMemo(
    () => getVisibleIds(treeCategories, search, statusFilter),
    [treeCategories, search, statusFilter]
  );

  // 카운트: 트리 기준
  const rootCategories = treeCategories.filter(
    (c) => c.parentId === null || c.parentId === undefined
  );
  const totalRoot = rootCategories.length;
  const totalSub = countAllNodes(rootCategories) - totalRoot;

  const filteredRoot = visibleIds
    ? rootCategories.filter((c) => visibleIds.has(c.id)).length
    : totalRoot;
  const filteredSub = visibleIds ? visibleIds.size - filteredRoot : totalSub;

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

    const dragged = findFlatById(localFlat, draggedId);
    const target = findFlatById(localFlat, targetId);

    if (!dragged || !target) return;

    const isSameLevel = dragged.parentId === target.parentId;

    if (isSameLevel) {
      const siblings = localFlat
        .filter((c) => c.parentId === dragged.parentId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const oldIndex = siblings.findIndex((c) => c.id === draggedId);
      const newIndex = siblings.findIndex((c) => c.id === targetId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(siblings, oldIndex, newIndex).map((c, i) => ({
        ...c,
        sortOrder: i,
      }));

      setLocalFlat((prev) => {
        const others = prev.filter((c) => c.parentId !== dragged.parentId);
        return [...others, ...reordered];
      });

      await Promise.all(
        reordered
          .filter((c, i) => siblings[i]?.sortOrder !== i)
          .map((c) => updateCategory({ id: c.id, sortOrder: c.sortOrder }))
      );
    } else {
      await moveCategory(draggedId, target.parentId ?? undefined);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    setLocalFlat(categories); // flattenTree 제거
  };

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
            items={localFlat.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="divide-y">
              {rootCategories.filter((c) => !visibleIds || visibleIds.has(c.id))
                .length === 0 ? (
                <li className="text-muted-foreground h-24 text-center text-sm flex items-center justify-center">
                  계층구조가 없습니다.
                </li>
              ) : (
                rootCategories
                  .filter((c) => !visibleIds || visibleIds.has(c.id))
                  .map((category) => (
                    <CategoryTreeItem
                      key={category.id}
                      category={category}
                      depth={0}
                      overId={isFiltering ? null : overId}
                      visibleIds={visibleIds}
                    />
                  ))
              )}
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
