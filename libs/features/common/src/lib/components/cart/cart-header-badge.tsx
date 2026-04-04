import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../ui';
import { useCart } from '@starcoex-frontend/cart';
import { cn } from '../../utils';

interface CartHeaderBadgeProps {
  className?: string;
}

export const CartHeaderBadge: React.FC<CartHeaderBadgeProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const { cartItemCount, isLoading } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('relative', className)}
      onClick={() => navigate('/cart')}
      disabled={isLoading}
      aria-label={`장바구니 ${cartItemCount}개`}
    >
      <ShoppingCart className="w-5 h-5" />
      {cartItemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
        >
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </Badge>
      )}
    </Button>
  );
};
