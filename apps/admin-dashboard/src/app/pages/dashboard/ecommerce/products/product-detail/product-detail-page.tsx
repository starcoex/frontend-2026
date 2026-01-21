import ProductImageGallery from './product-image-gallery';
import {
  CircleDollarSign,
  Edit3Icon,
  HandCoinsIcon,
  HeartIcon,
  Layers2Icon,
  Loader2,
  ShoppingCart,
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
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '@starcoex-frontend/products';

// 타입 가드 헬퍼 함수
const getCategoryName = (category: unknown): string => {
  if (
    category &&
    typeof category === 'object' &&
    'name' in category &&
    typeof category.name === 'string'
  ) {
    return category.name;
  }
  return 'Uncategorized';
};

const getBrandName = (brand: unknown): string => {
  if (
    brand &&
    typeof brand === 'object' &&
    'name' in brand &&
    typeof brand.name === 'string'
  ) {
    return brand.name;
  }
  return 'N/A';
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProductById } = useProducts();

  useEffect(() => {
    if (id) {
      fetchProductById(parseInt(id));
    }
  }, [id, fetchProductById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            제품 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">
          {error || '제품을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/products')}>
          제품 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 안전한 데이터 추출
  const productName = currentProduct.name;
  const productDescription = currentProduct.description || '제품 상세 정보';
  const productImage =
    currentProduct.imageUrls[0] || '/images/og-product-detail.jpg';
  const categoryName = getCategoryName(currentProduct.category);
  const brandName = getBrandName(currentProduct.brand);

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
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
              <Edit3Icon />
              <span className="hidden lg:inline">Edit</span>
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2Icon />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-1">
            <ProductImageGallery />
          </div>
          <div className="space-y-4 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
                <CircleDollarSign className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Price</span>
                  <span className="text-lg font-semibold">
                    ${currentProduct.basePrice.toFixed(2)}
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
                  <span className="text-lg font-semibold">
                    {currentProduct.baseStock}
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
                    $
                    {(
                      currentProduct.basePrice * currentProduct.orderCount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Card>
              <CardContent className="space-y-4">
                <div className="grid items-start gap-8 xl:grid-cols-3">
                  <div className="space-y-8 xl:col-span-2">
                    <div>
                      <h3 className="mb-2 font-semibold">Description:</h3>
                      <p className="text-muted-foreground">
                        {productDescription}
                      </p>
                    </div>
                    {currentProduct.metadata && (
                      <div>
                        <h3 className="mb-2 font-semibold">Key Features:</h3>
                        <ul className="text-muted-foreground list-inside list-disc">
                          <li>High quality product</li>
                          <li>Excellent customer satisfaction</li>
                        </ul>
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
                        <TableRow>
                          <TableCell className="font-semibold">Brand</TableCell>
                          <TableCell className="text-right">
                            {brandName}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">SKU</TableCell>
                          <TableCell className="text-right">
                            {currentProduct.sku}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">Stock</TableCell>
                          <TableCell className="text-right">
                            {currentProduct.baseStock}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="grid auto-cols-max grid-flow-row gap-8">
                  <div>
                    <div className="mb-4 font-semibold">Colors:</div>
                    <RadioGroup defaultValue="card" className="flex gap-2">
                      <div>
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="peer sr-only"
                          aria-label="Card"
                        />
                        <Label
                          htmlFor="card"
                          className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-green-400 -indent-[9999px] peer-data-[state=checked]:ring"
                        >
                          Card
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="paypal"
                          id="paypal"
                          className="peer sr-only"
                          aria-label="Paypal"
                        />
                        <Label
                          htmlFor="paypal"
                          className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-indigo-400 -indent-[9999px] peer-data-[state=checked]:ring"
                        >
                          Paypal
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="apple"
                          id="apple"
                          className="peer sr-only"
                          aria-label="Apple"
                        />
                        <Label
                          htmlFor="apple"
                          className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-purple-400 -indent-[9999px] peer-data-[state=checked]:ring"
                        >
                          Apple
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <div className="mb-4 font-semibold">Sizes:</div>
                    <RadioGroup defaultValue="md" className="flex gap-2">
                      {['sm', 'md', 'lg', 'xl', 'xxl'].map((item, key) => (
                        <div key={key}>
                          <RadioGroupItem
                            value={item}
                            id={item}
                            className="peer sr-only"
                            aria-label={item}
                          />
                          <Label
                            htmlFor={item}
                            className="hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-md border text-xs uppercase"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button>
                    <ShoppingCart /> Add to Cart
                  </Button>
                  <Button variant="outline">
                    <HeartIcon /> Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                    <ProductReviewList />
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
                        <div className="flex items-center gap-4 text-sm">
                          <span className="w-20">5 stars</span>
                          <Progress value={70} color="bg-orange-400" />
                          <span>70%</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="w-20">4 stars</span>
                          <Progress value={17} color="bg-orange-600" />
                          <span>17%</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="w-20">3 stars</span>
                          <Progress value={7} color="bg-yellow-300" />
                          <span>7%</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="w-20">2 stars</span>
                          <Progress value={4} color="bg-yellow-600" />
                          <span>4%</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="w-20">1 star</span>
                          <Progress value={2} color="bg-red-600" />
                          <span>2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
