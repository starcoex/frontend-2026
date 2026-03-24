import { PrimaryActions } from '@starcoex-frontend/common';

export function HeatingOilDeliveryPrimaryActions() {
  return (
    <PrimaryActions
      to="/admin/heating-oil-deliveries/create"
      label="배달 등록"
    />
  );
}
