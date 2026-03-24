import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';

export function InventoryPrimaryActions() {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(INVENTORY_ROUTES.CREATE)}>
      <PlusIcon className="mr-2 h-4 w-4" />
      재고 추가
    </Button>
  );
}
