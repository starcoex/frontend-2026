import { useState } from 'react';
import { Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FuelWalkInCreateDrawer } from '@/app/pages/dashboard/ecommerce/reservations/fuel-walk-ins/components/fuel-walk-in-create-drawer';

interface Props {
  onSuccess: () => void;
}

export function FuelWalkInPrimaryActions({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Fuel className="mr-2 h-4 w-4" />
        주유 워크인 등록
      </Button>
      <FuelWalkInCreateDrawer
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
