import { useMemo } from 'react';
import { Folders, FolderCheck, Package, FolderTree } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@starcoex-frontend/categories';

export function CategoryStats({ categories }: { categories: Category[] }) {
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.isActive).length;
    const totalProducts = categories.reduce(
      (sum, c) => sum + (c.productCount ?? 0),
      0
    );
    const rootCount = categories.filter(
      (c) => c.parentId === null || c.parentId === undefined
    ).length;
    // 상품이 1개 이상인 카테고리 수
    const categoriesWithProducts = categories.filter(
      (c) => (c.productCount ?? 0) > 0
    ).length;

    return { total, active, totalProducts, rootCount, categoriesWithProducts };
  }, [categories]);

  const statItems = [
    {
      label: '전체 카테고리',
      value: stats.total.toLocaleString(),
      icon: Folders,
      badge:
        stats.total > 0
          ? {
              label: `비활성 ${stats.total - stats.active}개`,
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: '활성 카테고리',
      value: stats.active.toLocaleString(),
      icon: FolderCheck,
      badge:
        stats.total > 0
          ? {
              label: `${Math.round((stats.active / stats.total) * 100)}%`,
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: '연결된 상품 수',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      badge:
        stats.total > 0
          ? {
              label:
                stats.categoriesWithProducts > 0
                  ? `평균 ${Math.round(
                      stats.totalProducts / stats.categoriesWithProducts
                    )}개`
                  : '연결 없음',
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: '최상위 카테고리',
      value: stats.rootCount.toLocaleString(),
      icon: FolderTree,
      badge:
        stats.total > 0
          ? {
              label: `하위 ${stats.total - stats.rootCount}개`,
              variant: 'outline' as const,
            }
          : null,
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
