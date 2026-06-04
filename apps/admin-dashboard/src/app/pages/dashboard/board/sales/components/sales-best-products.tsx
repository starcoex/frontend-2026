import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Product {
  id: number;
  name: string;
  totalSold?: number | null;
  imageUrl?: string | null;
  price?: number | null;
  isActive?: boolean;
}

interface Props {
  products: Product[];
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '상품명', key: 'name' },
  { header: '판매량', key: 'totalSoldFormatted' },
  { header: '상태', key: 'statusLabel' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function ProductDetailDrawer({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
}) {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>{product.name}</SheetTitle>
          <SheetDescription>상품 ID #{product.id}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          {/* 이미지 */}
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-md object-cover"
              style={{ maxHeight: 160 }}
            />
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">상품 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상품명</dt>
                <dd className="font-medium">{product.name}</dd>
              </div>
              {product.price != null && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">가격</dt>
                  <dd className="font-bold">
                    ₩{product.price.toLocaleString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">총 판매량</dt>
                <dd className="font-bold text-green-600">
                  {(product.totalSold ?? 0).toLocaleString()}건
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge
                    variant={
                      product.isActive !== false ? 'default' : 'secondary'
                    }
                  >
                    {product.isActive !== false ? '활성' : '비활성'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/products/${product.id}`)}
          >
            상세 페이지로 이동
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
          >
            수정
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function SalesBestProducts({ products, isLoading }: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } = useDetailDrawer<Product>();

  const sorted = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0))
        .slice(0, 6),
    [products]
  );

  const exportData = sorted.map((p) => ({
    name: p.name,
    totalSoldFormatted: `${(p.totalSold ?? 0).toLocaleString()}건`,
    statusLabel: p.isActive !== false ? '활성' : '비활성',
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>베스트 상품</CardTitle>
              <CardDescription>판매량 기준 상위 상품</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="best-products"
                pdfTitle="베스트 상품"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/products')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))
          ) : sorted.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              상품 데이터가 없습니다.
            </div>
          ) : (
            sorted.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md border px-4 py-3"
              >
                {/* 순위 + 이미지 + 이름 */}
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-muted-foreground w-5 shrink-0 text-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="shrink-0 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs">
                      No img
                    </div>
                  )}
                  <span className="truncate text-sm font-medium">
                    {product.name}
                  </span>
                </div>

                {/* 판매량 + ⋮ 메뉴 */}
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-medium text-green-600">
                    {(product.totalSold ?? 0).toLocaleString()}건
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDrawer(product)}>
                        상세보기
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/products/${product.id}/edit`)
                        }
                      >
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/admin/inventory')}
                      >
                        재고 관리
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ProductDetailDrawer
        open={open}
        onOpenChange={setOpen}
        product={selected}
      />
    </>
  );
}
