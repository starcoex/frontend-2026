import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import type { ReactNode } from 'react';

interface PrimaryActionsProps {
  /** 링크 이동 방식 (기본) */
  to?: string;
  label?: string;
  /** Drawer 등 커스텀 액션 */
  children?: ReactNode;
}

export function PrimaryActions({ to, label, children }: PrimaryActionsProps) {
  if (children) return <>{children}</>;

  return (
    <Button asChild>
      <Link to={to!}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
