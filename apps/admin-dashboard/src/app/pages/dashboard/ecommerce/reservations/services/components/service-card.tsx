import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Settings2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICE_TYPE_LABELS: Record<string, string> = {
  CAR_WASH: '세차',
  CAR_CARE: '카케어',
  CAR_REPAIR: '정비',
  OIL_CHANGE: '오일교환',
  FUEL: '주유',
  EV_CHARGING: '전기차 충전',
  TABLE: '테이블',
  ROOM: '룸/공간',
  PICKUP: '픽업',
  DELIVERY: '배송',
  CONSULTATION: '상담',
  EVENT: '이벤트',
};

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    type: string;
    description?: string | null;
    basePrice: number;
    slotDuration: number;
    isActive: boolean;
    isAvailable: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSettings: () => void; // ← 추가
}

export function ServiceCard({
  service,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onSettings, // ← 추가
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer border-2 transition-colors hover:bg-accent/50',
        isSelected ? 'border-primary bg-accent/20' : 'border-transparent'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="truncate">{service.name}</span>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {SERVICE_TYPE_LABELS[service.type] ?? service.type}
            </Badge>
            {/* 수정/삭제 버튼 — 클릭 이벤트 버블링 방지 */}
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-3" />
            </Button>
            <Button // ← 추가
              variant="ghost"
              size="icon"
              className="size-6 text-primary hover:text-primary"
              title="운영 설정"
              onClick={(e) => {
                e.stopPropagation();
                onSettings(); // ← 새 prop
              }}
            >
              <Settings2 className="size-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {service.description && (
          <p className="text-muted-foreground truncate text-xs">
            {service.description}
          </p>
        )}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>₩{service.basePrice.toLocaleString()}</span>
          <span>{service.slotDuration}분 단위</span>
        </div>
        <div className="flex gap-1">
          <Badge
            variant={service.isActive ? 'default' : 'secondary'}
            className="text-xs"
          >
            {service.isActive ? '활성' : '비활성'}
          </Badge>
          {!service.isAvailable && (
            <Badge variant="destructive" className="text-xs">
              예약 불가
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
