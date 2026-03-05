import { useState } from 'react';
import { SuggestionMutateDrawer } from './suggestion-mutate-drawer';
import { Button } from '@/components/ui/button';

export function SuggestionPrimaryActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="font-semibold" onClick={() => setOpen(true)}>
        건의사항 등록
      </Button>
      <SuggestionMutateDrawer
        key="suggestion-create"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
