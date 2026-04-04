import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';
import { useState } from 'react';

export function useAddressForm(form: UseFormReturn<any>) {
  const [selectedAddress, setSelectedAddress] = useState<JusoApiAddress | null>(
    null
  );

  const handleAddressSelect = (address: JusoApiAddress) => {
    setSelectedAddress(address);
    form.setValue('roadAddress', address.roadAddr);
    form.setValue('jibunAddress', address.jibunAddr || '');
    form.setValue('zipCode', address.zipNo);
    toast.success('주소가 선택되었습니다.');
  };

  return { selectedAddress, handleAddressSelect };
}
