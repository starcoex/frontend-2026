import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export function JobPrimaryActions() {
  return (
    <Button asChild>
      <Link to="/admin/jobs/create">
        <PlusIcon className="mr-2 h-4 w-4" />
        공고 추가
      </Link>
    </Button>
  );
}
