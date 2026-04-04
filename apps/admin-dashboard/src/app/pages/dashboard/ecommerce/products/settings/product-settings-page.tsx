import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useProducts } from '@starcoex-frontend/products';
import { ProductTypeManager } from '@/app/pages/dashboard/ecommerce/products/components/product-type-manager';

export default function ProductSettingsPage() {
  const { fetchProductTypes } = useProducts();

  useEffect(() => {
    // ✅ 설정 페이지 진입 시 항상 최신 데이터 로드
    // 상품 타입 추가/수정 후 다른 페이지 다녀와도 최신 상태 유지
    fetchProductTypes();
  }, [fetchProductTypes]);

  return (
    <>
      <PageHead
        title={`제품 설정 - ${COMPANY_INFO.name}`}
        description="상품 타입 등 제품 관련 설정을 관리합니다."
        keywords={['제품 설정', '상품 타입', COMPANY_INFO.name]}
        og={{
          title: `제품 설정 - ${COMPANY_INFO.name}`,
          description: '상품 타입 관리',
          image: '/images/og-products.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-6">
        <ProductTypeManager />
      </div>
    </>
  );
}
