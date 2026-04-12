import { useState } from 'react';
import { Car, Pencil, Check, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardAction,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver, VehicleType } from '@starcoex-frontend/delivery';
import { VEHICLE_TYPE_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'BICYCLE', label: '자전거' },
  { value: 'MOTORCYCLE', label: '오토바이' },
  { value: 'CAR', label: '자동차' },
  { value: 'TRUCK', label: '트럭' },
];

interface Props {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

export function DriverVehicleCard({ driver, onUpdated }: Props) {
  const { updateDriverProfile } = useDelivery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    vehicleType: driver.vehicleType,
    vehicleNumber: driver.vehicleNumber ?? '',
    vehicleModel: driver.vehicleModel ?? '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateDriverProfile({
      driverId: driver.id,
      vehicleType: form.vehicleType, // ✅ vehicleType 전송
      vehicleNumber: form.vehicleNumber || undefined,
      vehicleModel: form.vehicleModel || undefined,
    });
    if (res.success && res.data?.driver) {
      toast.success('차량 정보가 수정되었습니다.');
      onUpdated(res.data.driver);
      setIsEditing(false);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setForm({
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber ?? '',
      vehicleModel: driver.vehicleModel ?? '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          차량 정보
        </CardTitle>
        <CardAction>
          {isEditing ? (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Check className="h-3.5 w-3.5 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {/* ✅ 차량 타입 수정 가능 */}
            <TableRow>
              <TableCell className="font-semibold">차량 타입</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Select
                    value={form.vehicleType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, vehicleType: v as VehicleType }))
                    }
                  >
                    <SelectTrigger className="h-7 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {VEHICLE_TYPES.map((v) => (
                          <SelectItem key={v.value} value={v.value}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  VEHICLE_TYPE_CONFIG[driver.vehicleType].label
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">차량 번호</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Input
                    value={form.vehicleNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, vehicleNumber: e.target.value }))
                    }
                    className="h-7 text-right font-mono text-sm"
                    placeholder="12가 3456"
                  />
                ) : (
                  driver.vehicleNumber ?? '-'
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">차량 모델</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Input
                    value={form.vehicleModel}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, vehicleModel: e.target.value }))
                    }
                    className="h-7 text-right text-sm"
                    placeholder="혼다 PCX 125"
                  />
                ) : (
                  driver.vehicleModel ?? '-'
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">운전면허 번호</TableCell>
              <TableCell className="text-right font-mono">
                {driver.licenseNumber ?? (
                  <span className="text-muted-foreground text-sm">미인증</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
