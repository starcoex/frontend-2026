import { ScanBarcode, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActions } from '@starcoex-frontend/common';

export function ProductPrimaryActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* 모바일: 아이콘만 표시 */}
      <Button variant="outline" size="icon" className="sm:hidden" asChild>
        <Link to="/admin/products/scan">
          <ScanBarcode className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" className="sm:hidden" asChild>
        <Link to="/admin/products/settings">
          <Settings className="h-4 w-4" />
        </Link>
      </Button>

      {/* 데스크탑: 텍스트 포함 */}
      <Button variant="outline" className="hidden sm:flex" asChild>
        <Link to="/admin/products/scan">
          <ScanBarcode className="mr-2 h-4 w-4" />
          바코드 스캔
        </Link>
      </Button>
      <Button variant="outline" className="hidden sm:flex" asChild>
        <Link to="/admin/products/settings">
          <Settings className="mr-2 h-4 w-4" />
          제품 설정
        </Link>
      </Button>

      <PrimaryActions to="/admin/products/create" label="제품 추가" />
    </div>
  );
}
