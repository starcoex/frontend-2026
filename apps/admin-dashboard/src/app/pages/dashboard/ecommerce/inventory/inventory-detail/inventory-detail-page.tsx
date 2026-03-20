import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useInventory } from '@starcoex-frontend/inventory';
import {
  Loader2,
  Package,
  RotateCcw,
  ShieldAlert,
  Warehouse,
  ArrowLeft,
  MapPin,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';
import { InventoryTransactionList } from './components/inventory-transaction-list';
import { INVENTORY_ZONE_OPTIONS } from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';

export default function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentInventory, isLoading, error, fetchInventoryById } =
    useInventory();

  useEffect(() => {
    if (id) fetchInventoryById(parseInt(id));
  }, [id, fetchInventoryById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            재고 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentInventory) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '재고 정보를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate(INVENTORY_ROUTES.LIST)}>
          재고 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const zoneName =
    INVENTORY_ZONE_OPTIONS.find((z) => z.value === currentInventory.zone)
      ?.label ?? currentInventory.zone;

  const stockUsagePercent =
    currentInventory.maxStock > 0
      ? Math.round(
          (currentInventory.currentStock / currentInventory.maxStock) * 100
        )
      : 0;

  return (
    <>
      <PageHead
        title={`재고 #${currentInventory.id} - ${COMPANY_INFO.name}`}
        description="재고 상세 정보 및 트랜잭션 이력"
        keywords={[
          '재고 상세',
          `매장 #${currentInventory.storeId}`,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `재고 #${currentInventory.id} - ${COMPANY_INFO.name}`,
          description: '재고 상세 정보 및 트랜잭션 이력',
          image: '/images/og-inventory.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={INVENTORY_ROUTES.LIST}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                재고 #{currentInventory.id}
              </h1>
              <p className="text-muted-foreground text-sm">
                매장 #{currentInventory.storeId} · 상품 #
                {currentInventory.productId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentInventory.isLowStock && (
              <Badge variant="warning">재고 부족</Badge>
            )}
            {currentInventory.isOutOfStock && (
              <Badge variant="destructive">재고 없음</Badge>
            )}
            {currentInventory.needsReorder && (
              <Badge variant="outline">재주문 필요</Badge>
            )}
            {!currentInventory.isActive && (
              <Badge variant="secondary">비활성</Badge>
            )}
          </div>
        </div>

        {/* 스탯 카드 4개 */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Warehouse,
              label: '현재 재고',
              value: currentInventory.currentStock.toLocaleString(),
            },
            {
              icon: Package,
              label: '가용 재고',
              value: currentInventory.availableStock.toLocaleString(),
            },
            {
              icon: ShieldAlert,
              label: '예약 재고',
              value: currentInventory.reservedStock.toLocaleString(),
            },
            {
              icon: RotateCcw,
              label: '재주문 시점',
              value: currentInventory.reorderPoint.toLocaleString(),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4"
            >
              <stat.icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  {stat.label}
                </span>
                <span className="text-lg font-semibold">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 본문 2컬럼 */}
        <div className="grid gap-4 xl:grid-cols-3">
          {/* 상세 정보 */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>재고 상세</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">매장 ID</TableCell>
                    <TableCell className="text-right">
                      #{currentInventory.storeId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">상품 ID</TableCell>
                    <TableCell className="text-right">
                      #{currentInventory.productId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">최소 재고</TableCell>
                    <TableCell className="text-right">
                      {currentInventory.minStock.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">최대 재고</TableCell>
                    <TableCell className="text-right">
                      {currentInventory.maxStock.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">재주문 수량</TableCell>
                    <TableCell className="text-right">
                      {currentInventory.reorderQuantity.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  {currentInventory.costPrice != null && (
                    <TableRow>
                      <TableCell className="font-semibold">원가</TableCell>
                      <TableCell className="text-right">
                        ₩{currentInventory.costPrice.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  {currentInventory.storePrice != null && (
                    <TableRow>
                      <TableCell className="font-semibold">
                        매장 판매가
                      </TableCell>
                      <TableCell className="text-right">
                        ₩{currentInventory.storePrice.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-semibold">재고 사용률</TableCell>
                    <TableCell className="text-right">
                      {stockUsagePercent}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">상태</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Badge
                          variant={
                            currentInventory.isActive ? 'default' : 'secondary'
                          }
                        >
                          {currentInventory.isActive ? '활성' : '비활성'}
                        </Badge>
                        {currentInventory.isSellable && (
                          <Badge variant="outline">온라인</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>

            {/* 위치 정보 */}
            {(currentInventory.location || currentInventory.zone) && (
              <>
                <Separator />
                <CardContent className="pt-4 space-y-2">
                  {currentInventory.zone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="text-muted-foreground size-4" />
                      <span className="text-muted-foreground">구역:</span>
                      <Badge variant="outline">{zoneName}</Badge>
                    </div>
                  )}
                  {currentInventory.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-muted-foreground size-4" />
                      <span className="text-muted-foreground">위치:</span>
                      <span className="font-medium">
                        {currentInventory.location}
                      </span>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>

          {/* 트랜잭션 이력 */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>입출고 이력</CardTitle>
              <CardDescription>최근 재고 변동 내역입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryTransactionList
                transactions={currentInventory.transactions ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
