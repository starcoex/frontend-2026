import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActions } from '@starcoex-frontend/common';

export function ReviewPrimaryActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to="/admin/reviews/scopes">
          <Settings className="mr-2 h-4 w-4" />
          스코프 관리
        </Link>
      </Button>
      <PrimaryActions to="/admin/reviews/create" label="리뷰 추가" />
    </div>
  );
}
