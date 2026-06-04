import { useState } from 'react';

export interface GuestInfo {
  guestName: string;
  guestPhone: string;
  guestVehicleNumber?: string;
}

export function useGuestQueueModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState<
    ((info: GuestInfo | null) => void) | null
  >(null);

  const prompt = (): Promise<GuestInfo | null> =>
    new Promise((res) => {
      setResolve(() => res);
      setIsOpen(true);
    });

  const confirm = (info: GuestInfo) => {
    resolve?.(info);
    setIsOpen(false);
  };

  const cancel = () => {
    resolve?.(null);
    setIsOpen(false);
  };

  return { isOpen, prompt, confirm, cancel };
}
