import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '@starcoex-frontend/products';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditProductForm from './edit-product-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function ProductEditPage() {
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

  return (
    <>
      <PageHead
        title={`${currentProduct.name} 수정 - ${COMPANY_INFO.name}`}
        description="제품 정보를 수정하세요."
        keywords={['제품 수정', currentProduct.name, COMPANY_INFO.name]}
        og={{
          title: `${currentProduct.name} 수정 - ${COMPANY_INFO.name}`,
          description: '제품 정보를 수정하세요.',
          image: currentProduct.imageUrls[0] || '/images/og-products.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <EditProductForm product={currentProduct} />
      </div>
    </>
  );
}
