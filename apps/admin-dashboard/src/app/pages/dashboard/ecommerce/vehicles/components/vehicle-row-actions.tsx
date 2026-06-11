import { useState } from 'react';
import { MoreHorizontal, Eye, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Vehicle } from '@starcoex-frontend/vehicles';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { VehicleGradeOverrideDialog } from './vehicle-grade-override-dialog';

export function VehicleRowActions({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();
  const { updateVehicleStatus } = useVehicleManagement();
  const [gradeOpen, setGradeOpen] = useState(false);

  const handleToggleActive = async () => {
    const newStatus = vehicle.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await updateVehicleStatus(vehicle.id, newStatus);
    if (res.success) {
      toast.success(
        `차량 상태가 ${
          newStatus === 'ACTIVE' ? '활성' : '비활성'
        }으로 변경되었습니다.`
      );
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/vehicles/${vehicle.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setGradeOpen(true)}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            등급 수동 지정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleToggleActive}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {vehicle.status === 'ACTIVE' ? '비활성화' : '활성화'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <VehicleGradeOverrideDialog
        open={gradeOpen}
        onOpenChange={setGradeOpen}
        vehicle={vehicle}
      />
    </>
  );
}
