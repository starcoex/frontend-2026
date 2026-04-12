import { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  PowerOff,
  Power,
  Copy,
  CheckCircle,
  XCircle,
  PauseCircle,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DeliveryDriver, DriverStatus } from '@starcoex-frontend/delivery';
import { useDelivery } from '@starcoex-frontend/delivery';
import { BulkDeleteDialog } from '@starcoex-frontend/common';

interface Props {
  driver: DeliveryDriver;
  onStatusChange: (driverId: number, status: DriverStatus) => void;
  onAvailabilityChange: (driverId: number, isAvailable: boolean) => void;
  onDeleted: (driverId: number) => void;
}

const STATUS_ACTIONS: {
  status: DriverStatus;
  label: string;
  icon: React.ElementType;
  className?: string;
}[] = [
  {
    status: 'ACTIVE',
    label: '승인 (활성화)',
    icon: CheckCircle,
    className: 'text-green-600',
  },
  {
    status: 'SUSPENDED',
    label: '일시 정지',
    icon: PauseCircle,
    className: 'text-yellow-600',
  },
  {
    status: 'TERMINATED',
    label: '해지',
    icon: XCircle,
    className: 'text-destructive',
  },
  { status: 'INACTIVE', label: '비활성화', icon: PowerOff },
];

export function DriverRowActions({
  driver,
  onStatusChange,
  onAvailabilityChange,
  onDeleted,
}: Props) {
  const navigate = useNavigate();
  const { updateDriverAvailability, updateDriverStatus, deleteDriver } =
    useDelivery();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(driver.driverCode);
    toast.success('기사 코드가 복사되었습니다.');
  };

  const handleToggleAvailability = async () => {
    setIsLoading(true);
    const res = await updateDriverAvailability(driver.id, !driver.isAvailable);
    if (res.success && res.data) {
      toast.success('가용 상태가 변경되었습니다.');
      onAvailabilityChange(driver.id, res.data.isAvailable);
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (status: DriverStatus) => {
    setIsLoading(true);
    const res = await updateDriverStatus({ driverId: driver.id, status });
    if (res.success && res.data?.driver) {
      toast.success('기사 상태가 변경되었습니다.');
      onStatusChange(driver.id, res.data.driver.status);
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteDriver(driver.id);
    if (res.success) {
      toast.success('기사가 삭제되었습니다.');
      onDeleted(driver.id);
      setDeleteDialogOpen(false);
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
    setIsDeleting(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => navigate(`/admin/delivery/drivers/${driver.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              navigate(`/admin/delivery/drivers/${driver.id}/edit`)
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyCode}>
            <Copy className="mr-2 h-4 w-4" />
            기사 코드 복사
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 가용 상태 토글 */}
          {driver.status === 'ACTIVE' && (
            <DropdownMenuItem onSelect={handleToggleAvailability}>
              {driver.isAvailable ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  가용 해제
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  가용 설정
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* 상태 변경 서브메뉴 */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle className="mr-2 h-4 w-4" />
              상태 변경
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {STATUS_ACTIONS.filter((a) => a.status !== driver.status).map(
                (action) => (
                  <DropdownMenuItem
                    key={action.status}
                    onSelect={() => handleStatusChange(action.status)}
                    className={action.className}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* 삭제 */}
          <DropdownMenuItem
            onSelect={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 삭제 확인 다이얼로그 */}
      <BulkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        count={1}
        itemLabel="배달기사"
        description={`${driver.name}(${driver.driverCode}) 기사를 완전히 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
      />
    </>
  );
}
