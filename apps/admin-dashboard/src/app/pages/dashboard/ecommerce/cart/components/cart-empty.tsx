import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CartEmpty() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
      <ShoppingCart className="size-12 text-muted-foreground opacity-40" />
      <div className="space-y-1">
        <p className="font-semibold">장바구니가 비어 있습니다</p>
        <p className="text-sm text-muted-foreground">
          쇼핑을 계속해서 상품을 담아보세요.
        </p>
      </div>
      <Button onClick={() => navigate('/admin/products')}>쇼핑 계속하기</Button>
    </div>
  );
}
