import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCart } from '@starcoex-frontend/cart';
import { useAuth } from '@starcoex-frontend/auth';
import { CartEmpty } from '@/app/pages/dashboard/ecommerce/cart/components/cart-empty';
import { CartItemList } from '@/app/pages/dashboard/ecommerce/cart/components/cart-item-list';
import { CartSummary } from '@/app/pages/dashboard/ecommerce/cart/components/cart-summary';
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
import { toast } from 'sonner';

export default function CartDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    carts,
    isLoading: isCartLoading,
    error: cartError,
    fetchAdminCarts,
    clearCart,
  } = useCart();
  const { getUserSimpleById } = useAuth();

  const userIdNum = userId ? parseInt(userId, 10) : null;
  const cart = userIdNum
    ? carts.find((c) => c.userId === userIdNum) ?? null
    : null;
  const isCartEmpty = cart?.isEmpty ?? true;

  const [cartUser, setCartUser] = useState<{
    id: number;
    name: string;
    email: string;
    phoneNumber?: string | null;
    role?: string | null;
    userType?: string | null;
  } | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    if (carts.length === 0) {
      fetchAdminCarts();
    }
  }, [fetchAdminCarts, carts.length]);

  useEffect(() => {
    if (!userIdNum) return;
    setIsUserLoading(true);
    getUserSimpleById(userIdNum)
      .then((res) => {
        if (res.success && res.data?.getUserById) {
          const u = res.data.getUserById;
          setCartUser({
            id: u.id,
            name: u.name ?? '이름 없음',
            email: u.email ?? '',
            phoneNumber: u.phoneNumber,
            role: u.role,
            userType: u.userType,
          });
        }
      })
      .finally(() => setIsUserLoading(false));
  }, [userIdNum]);

  const handleClearCart = async () => {
    const res = await clearCart();
    if (res.success) {
      toast.success('장바구니가 비워졌습니다.');
      fetchAdminCarts();
    } else {
      toast.error(res.error?.message ?? '장바구니 비우기에 실패했습니다.');
    }
    setClearDialogOpen(false);
  };

  if ((isCartLoading || isUserLoading) && !cart) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            장바구니를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (cartError || !cart) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {cartError || '장바구니를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/cart')}>
          장바구니 목록으로
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`${cartUser?.name ?? `사용자 #${userId}`} 장바구니 - ${
          COMPANY_INFO.name
        }`}
        description="사용자 장바구니 상세 정보"
        keywords={['장바구니 상세', `사용자 #${userId}`, COMPANY_INFO.name]}
        og={{
          title: `${cartUser?.name ?? `사용자 #${userId}`} 장바구니 - ${
            COMPANY_INFO.name
          }`,
          description: '사용자 장바구니 상세',
          image: '/images/og-cart.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/cart">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                {cartUser ? cartUser.name : `사용자 #${userId}`} 장바구니
              </h1>
              <p className="text-muted-foreground text-sm">
                상품 {cart.itemCount}개 · ₩{cart.totalAmount.toLocaleString()}
                {cart.isExpired && (
                  <span className="text-destructive ml-2 font-medium">
                    · 만료된 장바구니
                  </span>
                )}
                {cart.daysUntilExpiry != null && !cart.isExpired && (
                  <span className="text-muted-foreground ml-2">
                    · {cart.daysUntilExpiry}일 후 만료
                  </span>
                )}
              </p>
            </div>
          </div>

          {!isCartEmpty && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              disabled={isCartLoading}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              장바구니 비우기
            </Button>
          )}
        </div>

        {/* 사용자 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              사용자 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                사용자 정보 조회 중...
              </div>
            ) : cartUser ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">이름</p>
                  <p className="font-medium">{cartUser.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    이메일
                  </p>
                  <p className="font-medium truncate">{cartUser.email}</p>
                </div>
                {cartUser.phoneNumber && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      전화번호
                    </p>
                    <p className="font-medium">{cartUser.phoneNumber}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    권한
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {cartUser.role && (
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        {cartUser.role}
                      </Badge>
                    )}
                    {cartUser.userType && (
                      <Badge variant="secondary" className="text-[10px] px-1.5">
                        {cartUser.userType}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                사용자 정보를 불러올 수 없습니다. (ID: #{userId})
              </p>
            )}
          </CardContent>
        </Card>

        {/* 장바구니 본문 */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            {isCartEmpty ? (
              <CartEmpty />
            ) : (
              <CartItemList items={cart.items ?? []} />
            )}
          </div>
          {!isCartEmpty && (
            <div className="w-full lg:w-[320px]">
              <CartSummary cart={cart} />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>장바구니 전체 비우기</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">
                {cartUser?.name ?? `사용자 #${userId}`}
              </span>
              의 장바구니에 담긴{' '}
              <span className="font-semibold">{cart.itemCount}개</span> 상품을
              모두 제거합니다.
              <br />
              <span className="text-destructive font-medium">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={isCartLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCartLoading ? '처리 중...' : '전체 비우기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
