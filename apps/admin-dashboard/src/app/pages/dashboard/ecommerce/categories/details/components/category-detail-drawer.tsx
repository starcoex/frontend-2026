import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Category } from '@starcoex-frontend/categories';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

export function CategoryDetailDrawer({ open, onOpenChange, category }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle className="flex items-center gap-2">
            {category.name}
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? '활성' : '비활성'}
            </Badge>
          </SheetTitle>
          <SheetDescription>{category.slug}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          {/* 기본 정보 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">기본 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-medium">#{category.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">이름</dt>
                <dd className="font-medium">{category.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">슬러그</dt>
                <dd className="font-mono text-xs">{category.slug}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상위 카테고리</dt>
                <dd className="font-medium">
                  {category.parentId ? `#${category.parentId}` : '최상위'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">정렬 순서</dt>
                <dd className="font-medium">{category.sortOrder}</dd>
              </div>
              {category.metadata?.['colorTheme'] && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">색상 테마</dt>
                  <dd className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border"
                      style={{
                        backgroundColor: category.metadata[
                          'colorTheme'
                        ] as string,
                      }}
                    />
                    <span className="font-mono text-xs">
                      {category.metadata['colorTheme'] as string}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 설명 */}
          {category.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">설명</h4>
              <Separator />
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            </div>
          )}

          {/* 통계 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">통계</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">연결된 상품 수</dt>
                <dd className="font-medium">{category.productCount}개</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">하위 카테고리 수</dt>
                <dd className="font-medium">
                  {category.children?.length ?? 0}개
                </dd>
              </div>
            </dl>
          </div>

          {/* 하위 카테고리 */}
          {category.children && category.children.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">하위 카테고리</h4>
              <Separator />
              <ul className="space-y-1">
                {category.children.map((child) => (
                  <li
                    key={child.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{child.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        상품 {child.productCount}개
                      </span>
                      <Badge
                        variant={child.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {child.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 날짜 정보 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">날짜 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">생성일</dt>
                <dd className="font-medium">
                  {new Date(category.createdAt).toLocaleDateString('ko-KR')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">수정일</dt>
                <dd className="font-medium">
                  {new Date(category.updatedAt).toLocaleDateString('ko-KR')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="px-4 sm:px-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
