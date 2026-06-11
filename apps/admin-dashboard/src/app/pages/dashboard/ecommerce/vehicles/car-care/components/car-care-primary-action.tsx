import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CAR_CARE_ROUTES } from '@/app/constants/car-care-routes';

export function CarCarePrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link to={CAR_CARE_ROUTES.PRICES_CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          가격 추가
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to={CAR_CARE_ROUTES.SURCHARGES}>추가금 정책</Link>
      </Button>
    </div>
  );
}
