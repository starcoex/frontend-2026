import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';

export const CartEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="rounded-full bg-muted p-6">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">장바구니가 비어 있습니다</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          원하는 연료나 서비스를 장바구니에 담아보세요.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => navigate('/fuel')}>연료 구매하기</Button>
        <Button variant="outline" onClick={() => navigate('/services')}>
          서비스 보기
        </Button>
      </div>
    </div>
  );
};
