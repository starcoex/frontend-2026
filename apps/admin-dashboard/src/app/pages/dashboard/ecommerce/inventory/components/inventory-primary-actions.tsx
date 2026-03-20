import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { InventoryCreateDrawer } from '@/app/pages/dashboard/ecommerce/inventory/create/inventory-create-drawer';

export function InventoryPrimaryActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        재고 추가
      </Button>
      <InventoryCreateDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
