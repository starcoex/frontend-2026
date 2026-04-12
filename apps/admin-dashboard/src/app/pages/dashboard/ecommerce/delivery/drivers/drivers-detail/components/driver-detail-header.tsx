import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { DRIVER_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';

interface Props {
  driver: DeliveryDriver;
  onToggleAvailability: () => void;
  onDeactivate: () => void;
  isLoading: boolean;
}

export function DriverDetailHeader({
  driver,
  onToggleAvailability,
  onDeactivate,
  isLoading,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(DELIVERY_ROUTES.DRIVERS)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
              {driver.name}
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {driver.driverCode}
            </p>
          </div>
        </div>
        <div className="ml-12 flex flex-wrap items-center gap-2">
          <Badge variant={DRIVER_STATUS_CONFIG[driver.status].variant}>
            {DRIVER_STATUS_CONFIG[driver.status].label}
          </Badge>
          <Badge variant={driver.isAvailable ? 'success' : 'secondary'}>
            {driver.isAvailable ? '가용' : '비가용'}
          </Badge>
          {driver.licenseNumber && (
            <Badge variant="outline" className="gap-1 font-mono text-xs">
              🪪 {driver.licenseNumber}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 가용 상태 토글 */}
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <span className="text-muted-foreground text-sm">가용</span>
          <Switch
            checked={driver.isAvailable}
            onCheckedChange={onToggleAvailability}
            disabled={driver.status !== 'ACTIVE' || isLoading}
          />
        </div>
        {/* 비활성화 버튼 */}
        {driver.status === 'ACTIVE' && (
          <Button
            variant="outline"
            onClick={onDeactivate}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <PowerOff className="mr-2 h-4 w-4" />
            비활성화
          </Button>
        )}
        {driver.status === 'INACTIVE' && (
          <Badge variant="secondary" className="px-3 py-2">
            <Power className="mr-1 h-3 w-3" />
            비활성
          </Badge>
        )}
      </div>
    </div>
  );
}
