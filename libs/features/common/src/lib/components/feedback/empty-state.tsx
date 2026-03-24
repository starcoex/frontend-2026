import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  message = '데이터가 없습니다.',
  icon: Icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-32 items-center justify-center rounded-lg border border-dashed',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-8 opacity-40" />}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
