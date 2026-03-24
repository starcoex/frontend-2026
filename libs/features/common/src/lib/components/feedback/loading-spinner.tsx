import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = '데이터를 불러오는 중...',
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex h-64 items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
