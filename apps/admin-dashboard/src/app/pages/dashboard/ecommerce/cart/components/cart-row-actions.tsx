import { useState } from 'react';
import { MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCart } from '@starcoex-frontend/cart';
import type { Cart } from '@starcoex-frontend/cart';

interface CartRowActionsProps {
  cart: Cart;
}

export function CartRowActions({ cart }: CartRowActionsProps) {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [clearOpen, setClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const res = await clearCart();
      if (res.success) {
        toast.success(`사용자 #${cart.userId}의 장바구니를 비웠습니다.`);
      } else {
        toast.error('장바구니 비우기에 실패했습니다.');
      }
    } finally {
      setIsClearing(false);
      setClearOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/cart/${cart.userId}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setClearOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            장바구니 비우기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>장바구니 비우기</AlertDialogTitle>
            <AlertDialogDescription>
              사용자 <span className="font-semibold">#{cart.userId}</span>의
              장바구니를 비웁니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleClear}
              disabled={isClearing}
            >
              {isClearing ? '처리 중...' : '비우기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
