import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Brand } from '@starcoex-frontend/stores';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
  onEdit: () => void;
}

export function BrandDetailDrawer({
  open,
  onOpenChange,
  brand,
  onEdit,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {brand.logoUrl && (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-10 w-10 rounded-md object-contain border"
              />
            )}
            <div>
              <SheetTitle>{brand.name}</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {brand.slug}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          {/* 상태 + 컬러 */}
          <div className="flex items-center gap-2">
            <Badge variant={brand.isActive ? 'success' : 'secondary'}>
              {brand.isActive ? '활성' : '비활성'}
            </Badge>
            {brand.brandColor && (
              <div className="flex items-center gap-1.5">
                <div
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: brand.brandColor }}
                />
                <span className="text-muted-foreground font-mono text-xs">
                  {brand.brandColor}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* 비즈니스 타입 ✅ 추가 */}
          {brand.businessTypes && brand.businessTypes.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                비즈니스 타입
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brand.businessTypes.map((bt) => (
                  <Badge
                    key={bt.businessTypeId}
                    variant="outline"
                    className="text-xs"
                  >
                    {bt.businessType?.name ?? String(bt.businessTypeId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {brand.description && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium">
                설명
              </p>
              <p className="text-sm">{brand.description}</p>
            </div>
          )}

          {brand.logoUrl && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium">
                로고 URL
              </p>
              <p className="text-sm break-all font-mono">{brand.logoUrl}</p>
            </div>
          )}

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium">
              등록일
            </p>
            <p className="text-sm">
              {format(new Date(brand.createdAt), 'yyyy년 MM월 dd일 HH:mm', {
                locale: ko,
              })}
            </p>
          </div>
        </div>

        <SheetFooter className="px-4 sm:px-6">
          <Button onClick={onEdit} className="w-full">
            <Pencil className="mr-2 h-4 w-4" />
            수정하기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
