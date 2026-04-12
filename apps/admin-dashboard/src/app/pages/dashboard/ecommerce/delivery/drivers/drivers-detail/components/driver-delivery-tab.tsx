import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';

export function DriverDeliveryTab({ driver }: { driver: DeliveryDriver }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송 이력 ({driver.deliveries.length}건)</CardTitle>
      </CardHeader>
      <CardContent>
        {driver.deliveries.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">
              배송 이력이 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {driver.deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm font-medium">
                    {delivery.deliveryNumber}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(delivery.requestedAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={DELIVERY_STATUS_CONFIG[delivery.status].variant}
                    className="text-xs"
                  >
                    {DELIVERY_STATUS_CONFIG[delivery.status].label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      navigate(
                        DELIVERY_ROUTES.DETAIL.replace(
                          ':id',
                          String(delivery.id)
                        )
                      )
                    }
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
