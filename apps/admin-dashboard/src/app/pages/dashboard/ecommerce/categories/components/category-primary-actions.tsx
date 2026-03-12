import { useState } from 'react';
import { CategoryMutateDrawer } from './category-mutate-drawer';
import { Button } from '@/components/ui/button';

export function CategoryPrimaryActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="font-semibold" onClick={() => setOpen(true)}>
        카테고리 등록
      </Button>
      <CategoryMutateDrawer
        key="category-create"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
