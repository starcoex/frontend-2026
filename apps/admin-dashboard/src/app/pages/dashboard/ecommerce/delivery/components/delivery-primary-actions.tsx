import { Truck, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActions } from '@starcoex-frontend/common';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';

export function DeliveryPrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to={DELIVERY_ROUTES.DRIVERS}>
          <UserPlus className="mr-2 h-4 w-4" />
          기사 관리
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to={DELIVERY_ROUTES.TRACKING}>
          <Truck className="mr-2 h-4 w-4" />
          배송 추적
        </Link>
      </Button>
      <PrimaryActions to={DELIVERY_ROUTES.CREATE} label="배송 추가" />
    </div>
  );
}
