import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VEHICLE_ROUTES } from '@/app/constants/vehicle-routes';

export function VehiclePrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to={VEHICLE_ROUTES.PENDING_REVIEW}>검토 대기</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to={VEHICLE_ROUTES.LOW_CONFIDENCE}>낮은 신뢰도</Link>
      </Button>
    </div>
  );
}
