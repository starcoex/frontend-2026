import { ScanBarcode, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActions } from '@starcoex-frontend/common';

export function ProductPrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to="/admin/products/scan">
          <ScanBarcode className="mr-2 h-4 w-4" />
          바코드 스캔
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/admin/products/settings">
          <Settings className="mr-2 h-4 w-4" />
          제품 설정
        </Link>
      </Button>
      <PrimaryActions to="/admin/products/create" label="제품 추가" />
    </div>
  );
}
