import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export function OrderPrimaryActions() {
  return (
    <Button asChild>
      <Link to="/admin/orders/create">
        <PlusIcon className="mr-2 h-4 w-4" />
        주문 추가
      </Link>
    </Button>
  );
}
