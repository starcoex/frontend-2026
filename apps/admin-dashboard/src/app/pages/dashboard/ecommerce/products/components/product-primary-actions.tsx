import { PlusIcon, ScanBarcode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ProductPrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to="/admin/products/scan">
          <ScanBarcode className="mr-2 h-4 w-4" />
          바코드 스캔
        </Link>
      </Button>
      <Button asChild>
        <Link to="/admin/products/create">
          <PlusIcon className="mr-2 h-4 w-4" />
          제품 추가
        </Link>
      </Button>
    </div>
  );
}
