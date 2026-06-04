import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { NOTICES_ROUTES } from '@/app/constants/notices-routes';

export function NoticePrimaryActions() {
  const { pathname } = useLocation();

  if (pathname === NOTICES_ROUTES.MANUALS) {
    return (
      <Button asChild>
        <Link to={NOTICES_ROUTES.MANUAL_CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          매뉴얼 추가
        </Link>
      </Button>
    );
  }

  if (pathname === NOTICES_ROUTES.CATEGORIES) {
    return (
      <Button asChild>
        <Link to={NOTICES_ROUTES.CATEGORY_CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          카테고리 추가
        </Link>
      </Button>
    );
  }

  // 기본: 공지 목록 페이지
  return (
    <Button asChild>
      <Link to={NOTICES_ROUTES.CREATE}>
        <PlusIcon className="mr-2 h-4 w-4" />
        공지 추가
      </Link>
    </Button>
  );
}
