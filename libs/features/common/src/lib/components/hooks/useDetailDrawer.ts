import { useState } from 'react';

export function useDetailDrawer<T>() {
  const [selected, setSelected] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  const openDrawer = (item: T) => {
    setSelected(item);
    setOpen(true);
  };

  const closeDrawer = () => setOpen(false);

  return { selected, open, setOpen, openDrawer, closeDrawer };
}
