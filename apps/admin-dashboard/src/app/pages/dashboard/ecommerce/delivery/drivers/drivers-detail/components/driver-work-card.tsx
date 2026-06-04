import { useRef, useState } from 'react';
import { MapPin, Clock, Pencil, Check, X, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardAction,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';

const DAY_LABELS: Record<string, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};

interface Props {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

export function DriverWorkCard({ driver, onUpdated }: Props) {
  const { updateDriverProfile } = useDelivery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // ✅ string[] 상태로 직접 관리
  const [editAreas, setEditAreas] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState('');
  const areaInputRef = useRef<HTMLInputElement>(null);

  const workingHours = driver.workingHours as Record<string, string> | null;
  const workingAreas = (driver.workingAreas as unknown as string[]) ?? [];

  // ── 편집 시작 ──────────────────────────────────────────────────────────────
  const handleStartEdit = () => {
    setEditAreas([...workingAreas]);
    setAreaInput('');
    setIsEditing(true);
  };

  // ── 지역 추가 ──────────────────────────────────────────────────────────────
  const handleAddArea = () => {
    const trimmed = areaInput.trim();
    if (!trimmed) return;
    if (editAreas.includes(trimmed)) return;
    setEditAreas((prev) => [...prev, trimmed]);
    setAreaInput('');
    areaInputRef.current?.focus();
  };

  const handleRemoveArea = (area: string) => {
    setEditAreas((prev) => prev.filter((a) => a !== area));
  };

  // ── 저장 ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateDriverProfile({
      driverId: driver.id,
      workingAreas: editAreas,
    });
    if (res.success && res.data?.driver) {
      toast.success('근무 지역이 수정되었습니다.');
      onUpdated(res.data.driver);
      setIsEditing(false);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditAreas([]);
    setAreaInput('');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          근무 정보
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
              onClick={handleStartEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 근무 지역 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">근무 지역</p>

          {isEditing ? (
            <div className="space-y-2">
              {/* 태그 입력 */}
              <div className="flex gap-2">
                <Input
                  ref={areaInputRef}
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddArea();
                    }
                  }}
                  placeholder="예: 제주시"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddArea}
                  disabled={!areaInput.trim()}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  추가
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Enter 또는 추가 버튼으로 지역 입력
              </p>
              {/* 현재 태그 목록 */}
              {editAreas.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-destructive ml-0.5 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : workingAreas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {workingAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">설정된 지역 없음</p>
          )}
        </div>

        {/* 근무 시간 (읽기 전용) */}
        {workingHours && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Clock className="h-3.5 w-3.5" />
              근무 시간
            </p>
            <div className="space-y-1">
              {Object.entries(workingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground w-6">
                    {DAY_LABELS[day] ?? day}
                  </span>
                  <span className="font-mono">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
