import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../utils';

interface FormPageAction {
  label: string;
  loadingLabel?: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  disabled?: boolean;
  isLoading?: boolean;
}

interface FormPageHeaderProps {
  /** 뒤로가기 링크 경로 (to) 또는 클릭 핸들러 */
  backTo?: string;
  onBack?: () => void;
  /** 페이지 제목 */
  title: string;
  /** 부제목 (주문번호 등) */
  subtitle?: string;
  /** 우측 액션 버튼 목록 (왼쪽 → 오른쪽 순서) */
  actions?: FormPageAction[];
  className?: string;
}

export function FormPageHeader({
  backTo,
  onBack,
  title,
  subtitle,
  actions = [],
  className,
}: FormPageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3',
        'sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* 좌측: 뒤로가기 + 타이틀 */}
      <div className="flex items-center gap-3 min-w-0">
        {/* 뒤로가기 버튼 */}
        {backTo ? (
          <Button
            aria-label="뒤로가기"
            variant="outline"
            size="icon"
            className="shrink-0"
            asChild
          >
            <Link to={backTo}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : onBack ? (
          <Button
            aria-label="뒤로가기"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}

        {/* 타이틀 */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight truncate sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground font-mono text-xs mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* 우측: 액션 버튼들 */}
      {actions.length > 0 && (
        <div className="flex items-center gap-2 sm:shrink-0">
          {actions.map((action, index) => (
            <Button
              key={index}
              type={action.type ?? 'button'}
              variant={action.variant ?? 'default'}
              onClick={action.onClick}
              disabled={action.disabled || action.isLoading}
              className="flex-1 sm:flex-none"
            >
              {action.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {action.isLoading
                ? action.loadingLabel ?? action.label
                : action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
