import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export function ContactPrimaryActions() {
  return (
    <Button asChild variant="outline">
      <Link to="/admin/contacts/stats">
        <BarChart3 className="mr-2 h-4 w-4" />
        문의 통계
      </Link>
    </Button>
  );
}
