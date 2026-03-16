import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Loader2,
  ChevronLeft,
  Pencil,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useStores } from '@starcoex-frontend/stores';

type StoreStatus = 'active' | 'inactive' | 'closed';

const getStoreStatus = (isActive: boolean, isVisible: boolean): StoreStatus => {
  if (isActive) return 'active';
  if (isVisible) return 'inactive';
  return 'closed';
};

const STATUS_CONFIG: Record<
  StoreStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' }
> = {
  active: { label: '운영 중', variant: 'success' },
  inactive: { label: '비활성', variant: 'warning' },
  closed: { label: '폐점', variant: 'destructive' },
};

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentStore, isLoading, error, fetchStoreById, deleteStore } =
    useStores();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchStoreById(parseInt(id));
  }, [id, fetchStoreById]);

  const handleDelete = async () => {
    if (!currentStore) return;
    setIsDeleting(true);
    try {
      const res = await deleteStore({ id: currentStore.id });
      if (res.success) {
        toast.success(`${currentStore.name}이(가) 삭제되었습니다.`);
        navigate('/admin/stores');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            매장 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentStore) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '매장을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/stores')}>매장 목록으로</Button>
      </div>
    );
  }

  const status = getStoreStatus(currentStore.isActive, currentStore.isVisible);
  const statusConfig = STATUS_CONFIG[status];
  const brand = currentStore.brand as Record<string, any> | null;

  return (
    <>
      <PageHead
        title={`${currentStore.name} - ${COMPANY_INFO.name}`}
        description="매장 상세 정보"
        keywords={['매장 상세', currentStore.name, COMPANY_INFO.name]}
        og={{
          title: `${currentStore.name} - ${COMPANY_INFO.name}`,
          description: '매장 상세 정보',
          image: '/images/og-stores.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/stores')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                {currentStore.name}
              </h1>
              <p className="text-muted-foreground font-mono text-xs">
                {currentStore.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/stores/${id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          <Badge variant={currentStore.pickupEnabled ? 'success' : 'secondary'}>
            픽업 {currentStore.pickupEnabled ? '가능' : '불가'}
          </Badge>
          {currentStore.isVisible && <Badge variant="outline">고객 노출</Badge>}
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <p className="text-muted-foreground text-sm">총 주문수</p>
              <p className="text-2xl font-bold">
                {currentStore.orderCount.toLocaleString()}
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <p className="text-muted-foreground text-sm">평점</p>
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-orange-400 text-orange-400" />
                <p className="text-2xl font-bold">
                  {Number(currentStore.rating ?? 0).toFixed(1)}
                </p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <p className="text-muted-foreground text-sm">브랜드</p>
              <p className="text-lg font-semibold">{brand?.name ?? '-'}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <p className="text-muted-foreground text-sm">지점명</p>
              <p className="text-lg font-semibold">{currentStore.location}</p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentStore.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground size-4" />
                  <span>{currentStore.phone}</span>
                </div>
              )}
              {currentStore.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground size-4" />
                  <span>{currentStore.email}</span>
                </div>
              )}
              {currentStore.services && currentStore.services.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                    제공 서비스
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStore.services.map((service: string) => (
                      <Badge
                        key={service}
                        variant="outline"
                        className="text-xs"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 주소 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4" />
                주소 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {currentStore.address ? (
                <>
                  <p>{(currentStore.address as any)?.roadFullAddr ?? '-'}</p>
                  {(currentStore.address as any)?.addrDetail && (
                    <p className="text-muted-foreground">
                      {(currentStore.address as any).addrDetail}
                    </p>
                  )}
                  <Separator />
                  <p className="text-muted-foreground text-xs">
                    우편번호: {(currentStore.address as any)?.zipNo ?? '-'}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">주소 정보 없음</p>
              )}
              {(currentStore.latitude != null ||
                currentStore.longitude != null) && (
                <p className="text-muted-foreground text-xs">
                  좌표: {currentStore.latitude ?? '-'},{' '}
                  {currentStore.longitude ?? '-'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 브랜드 정보 */}
        {brand && (
          <Card>
            <CardHeader>
              <CardTitle>브랜드 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {brand.logoUrl && (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-10 w-10 rounded-md border object-contain"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">{brand.name}</span>
                  {brand.brandColor && (
                    <div
                      className="h-4 w-4 rounded border"
                      style={{ backgroundColor: brand.brandColor }}
                    />
                  )}
                  <Badge variant={brand.isActive ? 'success' : 'secondary'}>
                    {brand.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>매장 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{currentStore.name}</span>을(를)
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
