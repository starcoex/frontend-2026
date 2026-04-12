import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { DriverRestLicenseVerify } from '@/app/pages/dashboard/ecommerce/delivery/drivers/components/driver-rest-license-verify';

interface Props {
  driver: DeliveryDriver;
  onVerified: (licenseNumber: string) => void;
}

export function DriverLicenseTab({ driver, onVerified }: Props) {
  return (
    <DriverRestLicenseVerify
      driverId={driver.id}
      currentLicenseNumber={driver.licenseNumber}
      onVerified={onVerified}
    />
  );
}
