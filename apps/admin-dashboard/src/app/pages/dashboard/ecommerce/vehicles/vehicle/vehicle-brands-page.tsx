import { useEffect } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';

export default function VehicleBrandsPage() {
  const { brands, isLoading,  fetchVehicleBrands, deleteVehicleBrand } =
    useVehicleManagement();

  useEffect(() => {
    fetchVehicleBrands();
  }, [fetchVehicleBrands]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" 브랜드를 삭제하시겠습니까?`)) return;
    const res = await deleteVehicleBrand(id);
    if (res.success) {
      toast.success('브랜드가 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`브랜드 관리 - ${COMPANY_INFO.name}`}
        description="차량 브랜드를 관리하세요."
        keywords={['차량 브랜드', COMPANY_INFO.name]}
        og={{
          title: `브랜드 관리 - ${COMPANY_INFO.name}`,
          description: '차량 브랜드 관리',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" asChild>
            <a href="/admin/vehicles/brands/create">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              브랜드 추가
            </a>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{brand.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(brand.id, brand.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {brand.nameEn && (
                  <p className="text-xs text-muted-foreground">
                    {brand.nameEn}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">모델 수</span>
                  <Badge variant="outline">{brand.models.length}개</Badge>
                </div>
                <Badge
                  variant={brand.isActive ? 'default' : 'secondary'}
                  className="mt-2 text-xs"
                >
                  {brand.isActive ? '활성' : '비활성'}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {brands.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
              등록된 브랜드가 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
