import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Vehicle } from '@starcoex-frontend/vehicles';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import {
  VEHICLE_BODY_TYPE_OPTIONS,
  VEHICLE_SIZE_GRADE_OPTIONS,
  type VehicleBodyTypeValue,
  type VehicleSizeGradeValue,
} from '../data/vehicle-data';

interface VehicleGradeOverrideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
  onSuccess?: () => void;
}

export function VehicleGradeOverrideDialog({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: VehicleGradeOverrideDialogProps) {
  const { overrideVehicleGrade } = useVehicleManagement();
  const [sizeGrade, setSizeGrade] = useState<VehicleSizeGradeValue | ''>('');
  const [bodyType, setBodyType] = useState<VehicleBodyTypeValue | ''>('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setSizeGrade('');
    setBodyType('');
    setReason('');
  };

  const handleSubmit = async () => {
    if (!sizeGrade || !bodyType || !reason.trim()) return;
    setIsLoading(true);
    try {
      const res = await overrideVehicleGrade(
        vehicle.id,
        sizeGrade,
        bodyType,
        reason
      );
      if (res.success) {
        toast.success('차량 등급이 수동 지정되었습니다.');
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.error?.message ?? '등급 지정에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>등급 수동 지정</DialogTitle>
          <DialogDescription>
            차량번호:{' '}
            <span className="font-mono font-medium">{vehicle.carNo}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>차체 유형 *</Label>
            <Select
              value={bodyType}
              onValueChange={(v) => setBodyType(v as VehicleBodyTypeValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="차체 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_BODY_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>사이즈 등급 *</Label>
            <Select
              value={sizeGrade}
              onValueChange={(v) => setSizeGrade(v as VehicleSizeGradeValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="사이즈 등급 선택" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_SIZE_GRADE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>지정 사유 *</Label>
            <Textarea
              placeholder="수동 지정 사유를 입력하세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!sizeGrade || !bodyType || !reason.trim() || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            지정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
