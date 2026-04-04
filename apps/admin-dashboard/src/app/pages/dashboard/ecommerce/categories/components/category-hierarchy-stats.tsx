import { useMemo } from 'react';
import { GitBranch, Layers, GitFork, BarChart2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@starcoex-frontend/categories';

// flat 배열 기준 최대 깊이 계산
function calcMaxDepthFlat(categories: Category[]): number {
  // parentId → depth 맵 구성
  const depthMap = new Map<number, number>();

  const getDepth = (id: number): number => {
    if (depthMap.has(id)) return depthMap.get(id)!;
    const category = categories.find((c) => c.id === id);
    if (!category || category.parentId == null) {
      depthMap.set(id, 0);
      return 0;
    }
    const depth = getDepth(category.parentId) + 1;
    depthMap.set(id, depth);
    return depth;
  };

  if (!categories.length) return 0;
  return Math.max(...categories.map((c) => getDepth(c.id)));
}

export function CategoryHierarchyStats({
  categories,
}: {
  categories: Category[];
}) {
  const stats = useMemo(() => {
    // flat 배열 기준으로 모든 통계 계산
    const rootCount = categories.filter(
      (c) => c.parentId === null || c.parentId === undefined
    ).length;

    const maxDepth = calcMaxDepthFlat(categories);

    // 자식이 있는 부모 노드 수 (parentId로 참조되는 노드)
    const parentIdSet = new Set(
      categories.map((c) => c.parentId).filter((id): id is number => id != null)
    );
    const parentNodes = parentIdSet.size;

    const subCount = categories.length - rootCount;
    const avgChildren =
      parentNodes > 0 ? Math.round(subCount / parentNodes) : 0;

    return { rootCount, maxDepth, parentNodes, avgChildren };
  }, [categories]);

  const statItems = [
    {
      label: '최상위 카테고리',
      value: stats.rootCount.toLocaleString(),
      icon: GitBranch,
      badge: { label: 'depth 0', variant: 'outline' as const },
    },
    {
      label: '최대 깊이',
      value: `${stats.maxDepth}단계`,
      icon: Layers,
      badge:
        stats.maxDepth >= 3
          ? { label: '깊은 구조', variant: 'destructive' as const }
          : { label: '적정 수준', variant: 'outline' as const },
    },
    {
      label: '부모 카테고리 수',
      value: stats.parentNodes.toLocaleString(),
      icon: GitFork,
      badge: { label: '자식 보유', variant: 'outline' as const },
    },
    {
      label: '평균 자식 수',
      value: `${stats.avgChildren}개`,
      icon: BarChart2,
      badge:
        stats.avgChildren > 5
          ? { label: '많음', variant: 'destructive' as const }
          : { label: '적정', variant: 'outline' as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <stat.icon className="size-4 opacity-60" />
              {stat.label}
            </CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">
              {stat.value}
            </CardTitle>
            {stat.badge && (
              <CardAction>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
