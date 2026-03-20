import ProductImageGallery from './product-image-gallery';
import {
  CircleDollarSign,
  Edit3Icon,
  HandCoinsIcon,
  Layers2Icon,
  Loader2,
  StarIcon,
  Trash2Icon,
  TruckIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProductReviewList from './reviews';
import SubmitReviewForm from './submit-review-form';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '@starcoex-frontend/products';
import { InventoryTable } from '@/app/pages/dashboard/ecommerce/products/inventory/components/inventory-table';
import type { InventoryRow } from '@/app/pages/dashboard/ecommerce/products/inventory/components/inventory-columns';
import Barcode from 'react-barcode';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProductById } = useProducts();

  useEffect(() => {
    if (id) fetchProductById(parseInt(id));
  }, [id, fetchProductById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            제품 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '제품을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/products')}>
          제품 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const productName = currentProduct.name;
  const productDescription = currentProduct.description || '제품 상세 정보';
  const productImage =
    currentProduct.imageUrls[0] || '/images/og-stores-detail.jpg';

  // 카테고리/브랜드명
  const categoryName =
    currentProduct.category &&
    typeof currentProduct.category === 'object' &&
    'name' in currentProduct.category
      ? (currentProduct.category as { name: string }).name
      : `카테고리 #${currentProduct.categoryId}`;

  const brandName =
    currentProduct.brand &&
    typeof currentProduct.brand === 'object' &&
    'name' in currentProduct.brand
      ? (currentProduct.brand as { name: string }).name
      : null;

  // 재고 행 변환
  const inventoryRows: InventoryRow[] = currentProduct.inventories.map(
    (inv) => ({
      ...inv,
      product: {
        id: currentProduct.id,
        name: currentProduct.name,
        sku: currentProduct.sku,
        imageUrls: currentProduct.imageUrls,
      },
    })
  );

  // 총 재고 (inventories 합산)
  const totalInventoryStock = currentProduct.inventories.reduce(
    (sum, inv) => sum + inv.stock,
    0
  );

  return (
    <>
      <PageHead
        title={`${productName} - ${COMPANY_INFO.name}`}
        description={productDescription}
        keywords={['제품 상세', productName, categoryName, COMPANY_INFO.name]}
        og={{
          title: `${productName} - ${COMPANY_INFO.name}`,
          description: productDescription,
          image: productImage,
          type: 'product',
        }}
      />
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <h1 className="font-display text-xl tracking-tight lg:text-2xl">
              {productName}
            </h1>
            <div className="text-muted-foreground inline-flex flex-col gap-2 text-sm lg:flex-row lg:gap-4">
              <div>
                <span className="text-foreground font-semibold">Category:</span>{' '}
                {categoryName}
              </div>
              <div>
                <span className="text-foreground font-semibold">SKU:</span>{' '}
                {currentProduct.sku}
              </div>
              {currentProduct.barcode && (
                <div>
                  <span className="text-foreground font-semibold">
                    Barcode:
                  </span>{' '}
                  <span className="font-mono">{currentProduct.barcode}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
              <Edit3Icon />
              <span className="hidden lg:inline">Edit</span>
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2Icon />
            </Button>
          </div>
        </div>

        {/* 상단: 이미지 + 스탯 */}
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-1">
            {/* ✅ 실제 이미지 전달 */}
            <ProductImageGallery
              imageUrls={currentProduct.imageUrls}
              productName={productName}
            />
          </div>
          <div className="space-y-4 xl:col-span-2">
            {/* 스탯 카드 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
                <CircleDollarSign className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Price</span>
                  <span className="text-lg font-semibold">
                    ₩{currentProduct.basePrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
                <TruckIcon className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">
                    No. of Orders
                  </span>
                  <span className="text-lg font-semibold">
                    {currentProduct.orderCount}
                  </span>
                </div>
              </div>
              <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
                <Layers2Icon className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">
                    Available Stocks
                  </span>
                  {/* ✅ inventories 합산 재고 표시 */}
                  <span className="text-lg font-semibold">
                    {totalInventoryStock.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
                <HandCoinsIcon className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">
                    Total Revenue
                  </span>
                  <span className="text-lg font-semibold">
                    ₩
                    {(
                      currentProduct.basePrice * currentProduct.orderCount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">
                  개요
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex-1">
                  재고
                  {inventoryRows.length > 0 && (
                    <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                      {inventoryRows.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  리뷰
                  {currentProduct.reviewCount > 0 && (
                    <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                      {currentProduct.reviewCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* 개요 탭 */}
              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid items-start gap-8 xl:grid-cols-3">
                      <div className="space-y-6 xl:col-span-2">
                        <div>
                          <h3 className="mb-2 font-semibold">Description:</h3>
                          <p className="text-muted-foreground">
                            {productDescription}
                          </p>
                        </div>
                        {/* ✅ 바코드 이미지 표시 */}
                        {currentProduct.barcode &&
                          currentProduct.barcode.length === 13 && (
                            <div>
                              <h3 className="mb-2 font-semibold">바코드:</h3>
                              <div className="inline-flex rounded-md border bg-white p-3">
                                <Barcode
                                  value={currentProduct.barcode}
                                  format="EAN13"
                                  width={1.5}
                                  height={60}
                                  fontSize={12}
                                  margin={4}
                                />
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="rounded-md border xl:col-span-1">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-semibold">
                                Category
                              </TableCell>
                              <TableCell className="text-right">
                                {categoryName}
                              </TableCell>
                            </TableRow>
                            {brandName && (
                              <TableRow>
                                <TableCell className="font-semibold">
                                  Brand
                                </TableCell>
                                <TableCell className="text-right">
                                  {brandName}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell className="font-semibold">
                                SKU
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {currentProduct.sku}
                              </TableCell>
                            </TableRow>
                            {currentProduct.barcode && (
                              <TableRow>
                                <TableCell className="font-semibold">
                                  Barcode
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs">
                                  {currentProduct.barcode}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell className="font-semibold">
                                Base Stock
                              </TableCell>
                              <TableCell className="text-right">
                                {totalInventoryStock.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            {currentProduct.salePrice && (
                              <TableRow>
                                <TableCell className="font-semibold">
                                  Sale Price
                                </TableCell>
                                <TableCell className="text-right">
                                  ₩{currentProduct.salePrice.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell className="font-semibold">
                                Status
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Badge
                                    variant={
                                      currentProduct.isActive
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {currentProduct.isActive
                                      ? '활성'
                                      : '비활성'}
                                  </Badge>
                                  {currentProduct.isFeatured && (
                                    <Badge variant="outline">추천</Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 재고 탭 */}
              <TabsContent value="inventory" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      매장별 재고 현황
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        총 {totalInventoryStock.toLocaleString()}개
                      </span>
                    </CardTitle>
                    <CardAction>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={INVENTORY_ROUTES.LIST}>
                          재고 관리로 이동 →
                        </Link>
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <InventoryTable
                      data={inventoryRows}
                      defaultProductId={currentProduct.id}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 리뷰 탭 */}
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader className="flex-row justify-between">
                    <CardTitle>Reviews</CardTitle>
                    <CardAction>
                      <SubmitReviewForm />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 xl:grid-cols-3">
                      <div className="order-last lg:order-first xl:col-span-2">
                        {/* ✅ 빈 배열 전달 (리뷰 API 미구현) */}
                        <ProductReviewList
                          reviews={[]}
                          reviewCount={currentProduct.reviewCount}
                        />
                      </div>
                      <div className="order-first lg:order-last xl:col-span-1">
                        <div className="overflow-hidden rounded-lg border">
                          <div className="bg-muted flex items-center gap-4 p-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`size-4 ${
                                    i < Math.floor(currentProduct.rating || 0)
                                      ? 'fill-orange-400 stroke-orange-400'
                                      : 'stroke-orange-400'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {currentProduct.rating?.toFixed(1) || '0.0'} (
                              {currentProduct.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="space-y-4 p-4">
                            <p className="text-muted-foreground text-xs">
                              리뷰가 등록되면 별점 분포가 표시됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
