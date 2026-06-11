import { useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';
import { VehicleSizeGradeBadge } from '../components/vehicle-status-badge';
import type {
  VehicleSizeGradeValue,
  VehicleBodyTypeValue,
} from '../data/vehicle-data';
import { BODY_TYPE_LABELS } from '@/app/pages/dashboard/ecommerce/vehicles/data/car-care-data';

export default function VehicleDimensionRulesPage() {
  const {
    dimensionRules,
    isLoading,
    fetchDimensionRules,
    deleteDimensionRule,
  } = useVehicleManagement();

  useEffect(() => {
    fetchDimensionRules();
  }, [fetchDimensionRules]);

  const handleDelete = async (id: number) => {
    if (!confirm('이 치수 등급 룰을 삭제하시겠습니까?')) return;
    const res = await deleteDimensionRule(id);
    if (res.success) {
      toast.success('치수 등급 룰이 삭제되었습니다.');
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
        title={`차체 치수 등급 룰 - ${COMPANY_INFO.name}`}
        description="차체 치수 기준 등급 산출 룰을 관리하세요."
        keywords={['차체 치수', '등급 룰', COMPANY_INFO.name]}
        og={{
          title: `치수 등급 룰 - ${COMPANY_INFO.name}`,
          description: '차체 치수 등급 산출 룰',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">차체 유형</th>
              <th className="px-4 py-3 text-right font-medium">
                최소 길이 (mm)
              </th>
              <th className="px-4 py-3 text-right font-medium">
                최대 길이 (mm)
              </th>
              <th className="px-4 py-3 text-center font-medium">사이즈 등급</th>
              <th className="px-4 py-3 text-center font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {dimensionRules.map((rule) => (
              <tr key={rule.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-2 font-medium">
                  {BODY_TYPE_LABELS[rule.bodyType as VehicleBodyTypeValue] ??
                    rule.bodyType}
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  {rule.minLength.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  {rule.maxLength.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <VehicleSizeGradeBadge
                    grade={rule.sizeGrade as VehicleSizeGradeValue}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {dimensionRules.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  등록된 치수 등급 룰이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
