import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@starcoex-frontend/common';
import { PrimaryActions } from '@starcoex-frontend/common';
import { WalkInCreateDrawer } from '@/app/pages/dashboard/ecommerce/reservations/walk-ins/components/walk-in-create-drawer';

interface Props {
  onSuccess: () => void;
}

export function WalkInPrimaryActions({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <PrimaryActions>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        워크인 등록
      </Button>
      <WalkInCreateDrawer
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </PrimaryActions>
  );
}
