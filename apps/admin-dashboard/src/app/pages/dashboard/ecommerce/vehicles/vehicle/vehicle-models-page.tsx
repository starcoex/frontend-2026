import { useEffect, useState } from 'react';
import { Loader2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';
import { VehicleSizeGradeBadge } from '../components/vehicle-status-badge';
import type { VehicleSizeGradeValue } from '../data/vehicle-data';

export default function VehicleModelsPage() {
  const {
    brands,
    models,
    isLoading,
    fetchVehicleBrands,
    fetchVehicleModelsByBrand,
    deleteVehicleModel,
  } = useVehicleManagement();
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicleBrands();
  }, [fetchVehicleBrands]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    fetchVehicleModelsByBrand(parseInt(brandId));
  };

  const filteredModels = models.filter(
    (m) =>
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.aliases ?? []).some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" 모델을 삭제하시겠습니까?`)) return;
    const res = await deleteVehicleModel(id);
    if (res.success) {
      toast.success('차량 모델이 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <PageHead
        title={`차량 모델 관리 - ${COMPANY_INFO.name}`}
        description="차량 모델을 관리하세요."
        keywords={['차량 모델', COMPANY_INFO.name]}
        og={{
          title: `차량 모델 관리 - ${COMPANY_INFO.name}`,
          description: '차량 모델 관리',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <Label>브랜드 선택</Label>
            <Select value={selectedBrandId} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="브랜드 선택" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedBrandId && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="모델명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">차명</th>
                  <th className="px-4 py-3 text-left font-medium">별칭</th>
                  <th className="px-4 py-3 text-center font-medium">
                    차체 유형
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    사이즈 등급
                  </th>
                  <th className="px-4 py-3 text-center font-medium">연식</th>
                  <th className="px-4 py-3 text-center font-medium">상태</th>
                  <th className="px-4 py-3 text-center font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{model.name}</td>
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      {(model.aliases ?? []).join(', ') || '-'}
                    </td>
                    <td className="px-4 py-2 text-center">{model.bodyType}</td>
                    <td className="px-4 py-2 text-center">
                      <VehicleSizeGradeBadge
                        grade={model.sizeGrade as VehicleSizeGradeValue}
                      />
                    </td>
                    <td className="px-4 py-2 text-center text-xs text-muted-foreground">
                      {model.yearFrom ?? '-'} ~ {model.yearTo ?? '현재'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Badge
                        variant={model.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {model.isActive ? '활성' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(model.id, model.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredModels.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      {selectedBrandId
                        ? '등록된 모델이 없습니다.'
                        : '브랜드를 먼저 선택하세요.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
