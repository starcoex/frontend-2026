import { Clock, Phone, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { Reservation } from '@starcoex-frontend/reservations';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import type { ReservationStatusValue } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';

interface ReservationCalendarCardProps {
  reservation: Reservation;
  onDelete: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
}

const getCardStyle = (status: string): string => {
  const variantMap: Record<string, string> = {
    success:
      'bg-green-50 dark:bg-green-950 border-l-4 border-l-green-500 dark:border-l-green-700',
    warning:
      'bg-yellow-50 dark:bg-yellow-950 border-l-4 border-l-yellow-400 dark:border-l-yellow-700',
    destructive:
      'bg-red-50 dark:bg-red-950 border-l-4 border-l-red-400 dark:border-l-red-700',
    default:
      'bg-blue-50 dark:bg-blue-950 border-l-4 border-l-blue-400 dark:border-l-blue-700',
    outline: 'bg-muted/50 border-l-4 border-l-muted-foreground/30',
    secondary: 'bg-secondary/50 border-l-4 border-l-secondary-foreground/20',
  };

  const config = RESERVATION_STATUS_CONFIG[status as ReservationStatusValue];
  const variant = config?.variant ?? 'default';
  return variantMap[variant] ?? variantMap['default'];
};

const formatTime = (dateTimeStr: string): string => {
  try {
    return new Date(dateTimeStr).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dateTimeStr;
  }
};

export function ReservationCalendarCard({
  reservation,
  onDelete,
  onEdit,
}: ReservationCalendarCardProps) {
  const config =
    RESERVATION_STATUS_CONFIG[reservation.status as ReservationStatusValue];
  const customerInfo = reservation.customerInfo as Record<
    string,
    string
  > | null;
  const customerName = customerInfo?.name ?? customerInfo?.customerName ?? '-';
  const customerPhone =
    customerInfo?.phone ?? customerInfo?.customerPhone ?? '';

  return (
    <Card
      className={`relative p-2 shadow-none ${getCardStyle(reservation.status)}`}
    >
      <CardContent className="px-0 py-0">
        {/* 액션 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-1 top-1 h-6 w-6"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(reservation)}>
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(reservation)}
              className="text-destructive focus:text-destructive"
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 예약 번호 */}
        <p className="font-mono text-[10px] text-muted-foreground pr-6 truncate">
          {reservation.reservationNumber}
        </p>

        {/* 고객명 */}
        <div className="mt-0.5 flex items-center gap-1">
          <User className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium truncate">{customerName}</span>
        </div>

        {/* 시간 */}
        <div className="mt-0.5 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-muted-foreground">
            {formatTime(reservation.reservedStartTime)} -{' '}
            {formatTime(reservation.reservedEndTime)}
          </span>
        </div>

        {/* 연락처 */}
        {customerPhone && (
          <div className="mt-0.5 flex items-center gap-1">
            <Phone className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
            <span className="text-[10px] text-muted-foreground truncate">
              {customerPhone}
            </span>
          </div>
        )}

        {/* 상태 뱃지 */}
        {config && (
          <Badge
            variant={config.variant}
            className="mt-1 text-[10px] px-1 py-0 h-4"
          >
            {config.label}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
