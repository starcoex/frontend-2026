import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
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
import { toast } from 'sonner';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';

interface Props {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

export function DriverBasicInfoCard({ driver, onUpdated }: Props) {
  const { updateDriverProfile } = useDelivery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: driver.name,
    phone: driver.phone,
    email: driver.email ?? '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateDriverProfile({
      driverId: driver.id,
      name: form.name || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
    });
    if (res.success && res.data?.driver) {
      toast.success('기본 정보가 수정되었습니다.');
      onUpdated(res.data.driver);
      setIsEditing(false);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setForm({
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
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
            <TableRow>
              <TableCell className="font-semibold">이름</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="h-7 text-right text-sm"
                  />
                ) : (
                  driver.name
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">전화번호</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="h-7 text-right text-sm"
                  />
                ) : (
                  driver.phone
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">이메일</TableCell>
              <TableCell className="text-right">
                {isEditing ? (
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="h-7 text-right text-sm"
                  />
                ) : (
                  driver.email ?? '-'
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">기사 코드</TableCell>
              <TableCell className="text-right font-mono">
                {driver.driverCode}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">동시 배송 최대</TableCell>
              <TableCell className="text-right">
                {driver.maxConcurrentOrders}건
              </TableCell>
            </TableRow>
            {driver.approvedAt && (
              <TableRow>
                <TableCell className="font-semibold">승인일</TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(driver.approvedAt).toLocaleDateString('ko-KR')}
                </TableCell>
              </TableRow>
            )}
            {driver.lastActiveAt && (
              <TableRow>
                <TableCell className="font-semibold">마지막 활동</TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(driver.lastActiveAt).toLocaleString('ko-KR')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
