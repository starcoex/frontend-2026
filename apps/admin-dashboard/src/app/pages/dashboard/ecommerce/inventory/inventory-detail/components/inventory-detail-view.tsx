import { Link } from 'react-router-dom';
import {
  Package,
  RotateCcw,
  ShieldAlert,
  Warehouse,
  ArrowLeft,
  MapPin,
  Tag,
  Pencil,
  PackagePlus,
  Fuel,
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
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';
import { InventoryTransactionList } from './inventory-transaction-list';
import { INVENTORY_ZONE_OPTIONS } from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';
import type { StoreInventory } from '@starcoex-frontend/inventory';
import { useState } from 'react';
import { InventoryAddStockDrawer } from '@/app/pages/dashboard/ecommerce/inventory/inventory-detail/components/inventory-add-stock-drawer';
import { InventoryAddFuelStockDrawer } from '@/app/pages/dashboard/ecommerce/inventory/inventory-detail/components/inventory-add-fuel-stock-drawer';

interface InventoryDetailViewProps {
  inventory: StoreInventory;
}

export function InventoryDetailView({ inventory }: InventoryDetailViewProps) {
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [addFuelStockOpen, setAddFuelStockOpen] = useState(false);

  const zoneName =
    INVENTORY_ZONE_OPTIONS.find((z) => z.value === inventory.zone)?.label ??
    inventory.zone;

  const stockUsagePercent =
    inventory.maxStock > 0
      ? Math.round((inventory.currentStock / inventory.maxStock) * 100)
      : 0;

  return (
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
              재고 #{inventory.id}
            </h1>
            <p className="text-muted-foreground text-sm">
              매장 #{inventory.storeId} · 상품 #{inventory.productId}
            </p>
          </div>
        </div>

        {/* 헤더 우측: 배지 + 액션 버튼 */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {inventory.isOutOfStock && (
            <Badge variant="destructive">재고 없음</Badge>
          )}
          {inventory.isLowStock && !inventory.isOutOfStock && (
            <Badge variant="warning">재고 부족</Badge>
          )}
          {inventory.needsReorder && (
            <Badge variant="outline">재주문 필요</Badge>
          )}
          {inventory.hasMinStockAlert && (
            <Badge variant="warning">최소 재고 알림</Badge>
          )}
          {inventory.hasReorderAlert && (
            <Badge variant="outline">재주문 알림</Badge>
          )}
          {inventory.hasExpiringItems && (
            <Badge variant="destructive">유통기한 임박</Badge>
          )}
          {!inventory.isActive && <Badge variant="secondary">비활성</Badge>}

          {/* FUEL 구역이 아닌 경우만 수동 입고 버튼 노출 */}
          {inventory.zone !== 'FUEL' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddStockOpen(true)}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              입고
            </Button>
          )}

          {/* FUEL 구역인 경우 유류 입고 버튼 */}
          {inventory.zone === 'FUEL' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddFuelStockOpen(true)}
            >
              <Fuel className="mr-2 h-4 w-4" />
              유류 입고
            </Button>
          )}

          <Button size="sm" variant="outline" asChild>
            <Link
              to={INVENTORY_ROUTES.EDIT.replace(':id', String(inventory.id))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              수정
            </Link>
          </Button>
        </div>
      </div>
      {/* 재고 수량 스탯 카드 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Warehouse,
            label: '현재 재고',
            value: inventory.currentStock.toLocaleString(),
          },
          {
            icon: Package,
            label: '가용 재고',
            value: inventory.availableStock.toLocaleString(),
          },
          {
            icon: ShieldAlert,
            label: '예약 재고',
            value: inventory.reservedStock.toLocaleString(),
          },
          {
            icon: RotateCcw,
            label: '재주문 시점',
            value: inventory.reorderPoint.toLocaleString(),
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
              <span className="text-lg font-semibold">
                {stat.value}
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  {inventory.unit}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 부피 재고 카드 (연료 등 volume 있는 경우만) */}
      {inventory.currentVolume != null && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: '현재 부피', value: inventory.currentVolume },
            { label: '가용 부피', value: inventory.availableVolume },
            { label: '예약 부피', value: inventory.reservedVolume },
          ].map((v) => (
            <div key={v.label} className="bg-muted rounded-lg border p-4">
              <span className="text-muted-foreground text-sm">{v.label}</span>
              <p className="text-lg font-semibold">
                {v.value?.toLocaleString() ?? '-'}
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  L
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 본문 2컬럼 */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* 상세 정보 카드 */}
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
                    #{inventory.storeId}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">상품 ID</TableCell>
                  <TableCell className="text-right">
                    #{inventory.productId}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">재고 단위</TableCell>
                  <TableCell className="text-right">{inventory.unit}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">최소 재고</TableCell>
                  <TableCell className="text-right">
                    {inventory.minStock.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">최대 재고</TableCell>
                  <TableCell className="text-right">
                    {inventory.maxStock.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">재주문 수량</TableCell>
                  <TableCell className="text-right">
                    {inventory.reorderQuantity.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">재고 사용률</TableCell>
                  <TableCell className="text-right">
                    {stockUsagePercent}%
                  </TableCell>
                </TableRow>
                {inventory.reservedPercentage != null && (
                  <TableRow>
                    <TableCell className="font-semibold">예약률</TableCell>
                    <TableCell className="text-right">
                      {inventory.reservedPercentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                )}
                {inventory.costPrice != null && (
                  <TableRow>
                    <TableCell className="font-semibold">원가</TableCell>
                    <TableCell className="text-right">
                      ₩{inventory.costPrice.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
                {inventory.storePrice != null && (
                  <TableRow>
                    <TableCell className="font-semibold">매장 판매가</TableCell>
                    <TableCell className="text-right">
                      ₩{inventory.storePrice.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
                {inventory.totalValue != null && (
                  <TableRow>
                    <TableCell className="font-semibold">재고 총가치</TableCell>
                    <TableCell className="text-right">
                      ₩{inventory.totalValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
                {inventory.daysSinceLastCount != null && (
                  <TableRow>
                    <TableCell className="font-semibold">마지막 실사</TableCell>
                    <TableCell className="text-right">
                      {inventory.daysSinceLastCount}일 전
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="font-semibold">판매 상태</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Badge
                        variant={inventory.isActive ? 'default' : 'secondary'}
                      >
                        {inventory.isActive ? '활성' : '비활성'}
                      </Badge>
                      {inventory.isSellable && (
                        <Badge variant="outline">온라인</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>

          {/* 위치 정보 */}
          {(inventory.location || inventory.zone) && (
            <>
              <Separator />
              <CardContent className="space-y-2 pt-4">
                {inventory.zone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">구역:</span>
                    <Badge variant="outline">{zoneName}</Badge>
                  </div>
                )}
                {inventory.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">위치:</span>
                    <span className="font-medium">{inventory.location}</span>
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
              transactions={inventory.transactions ?? []}
            />
          </CardContent>
        </Card>
      </div>

      {/* 수동 입고 Drawer */}
      <InventoryAddStockDrawer
        inventory={inventory}
        open={addStockOpen}
        onOpenChange={setAddStockOpen}
      />

      {/* 유류 수동 입고 Drawer */}
      <InventoryAddFuelStockDrawer
        inventory={inventory}
        open={addFuelStockOpen}
        onOpenChange={setAddFuelStockOpen}
      />
    </div>
  );
}
