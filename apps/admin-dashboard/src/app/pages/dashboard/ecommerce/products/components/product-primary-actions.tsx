import { PlusIcon, ScanBarcode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarcodeScanDialog } from '@/app/pages/dashboard/ecommerce/products/scan/components/barcode-scan-dialog';

export function ProductPrimaryActions() {
  return (
    <div className="flex gap-2">
      <BarcodeScanDialog>
        <Button variant="outline">
          <ScanBarcode className="mr-2 h-4 w-4" />
          바코드 스캔
        </Button>
      </BarcodeScanDialog>
      <Button asChild>
        <Link to="/admin/products/create">
          <PlusIcon className="mr-2 h-4 w-4" />
          제품 추가
        </Link>
      </Button>
    </div>
  );
}
