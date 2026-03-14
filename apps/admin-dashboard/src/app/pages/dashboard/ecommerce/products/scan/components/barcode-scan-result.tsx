import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@starcoex-frontend/products';

interface BarcodeScanResultProps {
  product: Product;
  onReset: () => void;
}

export function BarcodeScanResult({
  product,
  onReset,
}: BarcodeScanResultProps) {
  return (
    <div className="space-y-4">
      {product.imageUrls?.length > 0 && (
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="h-40 w-full rounded-md object-cover"
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <div className="flex shrink-0 gap-1">
          {product.isActive ? (
            <Badge>활성</Badge>
          ) : (
            <Badge variant="secondary">비활성</Badge>
          )}
          {product.isFeatured && <Badge variant="outline">추천</Badge>}
        </div>
      </div>

      {product.description && (
        <p className="text-muted-foreground text-sm">{product.description}</p>
      )}

      <Separator />

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">SKU</dt>
          <dd className="font-mono font-medium">{product.sku}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">바코드</dt>
          <dd className="font-mono font-medium">{product.barcode ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">기본 가격</dt>
          <dd className="font-medium">₩{product.basePrice.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">할인 가격</dt>
          <dd className="font-medium">
            {product.salePrice ? `₩${product.salePrice.toLocaleString()}` : '-'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">재고</dt>
          <dd className="font-medium">
            {product.baseStock.toLocaleString()}개
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">판매 가능</dt>
          <dd className="font-medium">
            {product.isAvailable ? '✅ 가능' : '❌ 불가'}
          </dd>
        </div>
      </dl>

      <Separator />

      <div className="flex gap-2">
        <Button asChild className="flex-1">
          <Link to={`/admin/products/${product.id}`}>상세 보기</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/admin/products/${product.id}/edit`}>수정하기</Link>
        </Button>
      </div>

      <Button variant="ghost" className="w-full" onClick={onReset}>
        다시 스캔
      </Button>
    </div>
  );
}
