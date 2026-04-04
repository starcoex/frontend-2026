import { useEffect, useRef, useState } from 'react';
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
  Clock,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Brand, useStores } from '@starcoex-frontend/stores';
import { StoreManagerPanel } from '@/app/pages/dashboard/ecommerce/stores/components/store-manager-panel';
import { useAddress } from '@starcoex-frontend/address';
import { Address } from '@starcoex-frontend/graphql';
// ❌ StoreServiceManager 제거 — 서비스는 매장 설정에서 관리

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
  const { getUserAddressById } = useAddress(); // ✅ 추가
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // ✅ useAddress.isLoading 대신 로컬 상태 — address 조회만을 위한 독립 상태
  const [storeAddress, setStoreAddress] = useState<Partial<Address> | null>(
    null
  );
  const [addressLoading, setAddressLoading] = useState(false);
  const addressFetchedRef = useRef<number | null>(null); // ✅ 중복 조회 방지

  useEffect(() => {
    if (id) fetchStoreById(parseInt(id));
  }, [id, fetchStoreById]);

  useEffect(() => {
    if (!currentStore?.addressId) return;

    // ✅ 동일한 addressId로 중복 조회 방지
    if (addressFetchedRef.current === currentStore.addressId) return;
    addressFetchedRef.current = currentStore.addressId;

    setAddressLoading(true);
    setStoreAddress(null);

    getUserAddressById(currentStore.addressId)
      .then((res) => {
        if (res.success && res.data?.getUserAddressById) {
          setStoreAddress(res.data.getUserAddressById as Partial<Address>);
        }
      })
      .catch(() => {
        setStoreAddress(null);
      })
      .finally(() => {
        setAddressLoading(false); // ✅ 반드시 해제
      });
  }, [currentStore?.addressId]); // ✅ getUserAddressById 의존성 제거 — 무한루프 방지

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

  // ✅ Record<string, unknown> 대신 Brand 타입 직접 사용
  const brand = currentStore.brand as Brand | null;

  const businessHours = currentStore.businessHours as Record<
    string,
    unknown
  > | null;
  const deliverySettings = currentStore.deliverySettings as Record<
    string,
    unknown
  > | null;

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
          {currentStore.businessType && (
            <Badge variant="outline" className="font-mono text-xs">
              {currentStore.businessType.name}
            </Badge>
          )}
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
              <p className="text-lg font-semibold">
                {(brand?.name as string) ?? '-'}
              </p>
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

              {/* ✅ 운영 서비스 — 읽기 전용 표시만 */}
              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                  운영 서비스
                </p>
                {currentStore.storeServices &&
                currentStore.storeServices.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {currentStore.storeServices.map((ss) => (
                      <Badge
                        key={ss.id}
                        variant={ss.isActive ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {ss.serviceType?.name ?? String(ss.serviceTypeId)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  // ✅ 서비스 없으면 매장 설정으로 안내
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AlertCircle className="size-3" />
                    <span>미설정 —</span>
                    <button
                      type="button"
                      className="underline underline-offset-2 hover:text-foreground"
                      onClick={() => navigate('/admin/stores/settings')}
                    >
                      매장 설정에서 비즈니스 타입 허용 서비스를 먼저 등록하세요
                    </button>
                  </div>
                )}
              </div>
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
              {addressLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  <span className="text-xs">주소 불러오는 중...</span>
                </div>
              ) : !storeAddress ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {currentStore.addressId
                      ? `주소 ID ${currentStore.addressId}를 불러오지 못했습니다.`
                      : '등록된 주소가 없습니다.'}
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <p>{storeAddress.roadFullAddr ?? '-'}</p>
                  {storeAddress.addrDetail && (
                    <p className="text-muted-foreground">
                      {storeAddress.addrDetail}
                    </p>
                  )}
                  <Separator />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-muted-foreground text-xs">
                      지번: {storeAddress.jibunAddr ?? '-'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      우편번호: {storeAddress.zipNo ?? '-'}
                    </p>
                    {storeAddress.siNm && (
                      <p className="text-muted-foreground text-xs">
                        {[
                          storeAddress.siNm,
                          storeAddress.sggNm,
                          storeAddress.emdNm,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    )}
                  </div>
                </>
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
          {/* 운영 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4" />
                운영 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">픽업 가능</span>
                <Badge
                  variant={currentStore.pickupEnabled ? 'success' : 'secondary'}
                >
                  {currentStore.pickupEnabled ? '가능' : '불가'}
                </Badge>
              </div>
              {/* 영업시간 */}
              {businessHours ? (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">
                    영업시간
                  </span>
                  <span className="text-right text-xs">
                    {typeof businessHours === 'object' &&
                    'text' in businessHours
                      ? String(businessHours.text)
                      : JSON.stringify(businessHours)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">영업시간</span>
                  <span className="text-muted-foreground text-xs">미설정</span>
                </div>
              )}
              {deliverySettings ? (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium flex items-center gap-1">
                    <Truck className="size-3" />
                    배송 설정
                  </p>
                  <pre className="text-muted-foreground rounded bg-secondary/50 p-2 text-xs whitespace-pre-wrap">
                    {JSON.stringify(deliverySettings, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="size-3" />
                    배송 설정
                  </span>
                  <span className="text-muted-foreground text-xs">미설정</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 브랜드 정보 */}
          {brand && (
            <Card>
              <CardHeader>
                <CardTitle>브랜드 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {/* ✅ as string 캐스팅 불필요 — Brand 타입에서 직접 접근 */}
                  {brand.logoUrl && (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-10 w-10 rounded-md border object-contain"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {brand?.name ?? '-'}
                    </p>
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

        {/* ✅ 관리자만 — StoreServiceManager 제거 */}
        <StoreManagerPanel store={currentStore} />
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
