import { cn } from '../../utils';
import React from 'react';

interface MobileCardProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

interface MobileCardSectionProps {
  children: React.ReactNode;
  className?: string;
}

// ─── 루트 카드 ────────────────────────────────────────────────────────────────
export function MobileCard({ onClick, children, className }: MobileCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 space-y-3 transition-colors',
        onClick && 'cursor-pointer active:bg-muted',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── 상단 헤더 영역 ───────────────────────────────────────────────────────────
export function MobileCardHeader({
  children,
  className,
}: MobileCardSectionProps) {
  return (
    <div className={cn('flex items-start justify-between gap-2', className)}>
      {children}
    </div>
  );
}

// ─── 헤더 내 타이틀 블록 ──────────────────────────────────────────────────────
export function MobileCardTitle({
  children,
  className,
}: MobileCardSectionProps) {
  return <div className={cn('min-w-0 flex-1', className)}>{children}</div>;
}

// ─── 헤더 내 액션 버튼 영역 (카드 클릭 이벤트 차단) ──────────────────────────
export function MobileCardAction({
  children,
  className,
}: MobileCardSectionProps) {
  return (
    <div
      className={cn('shrink-0', className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

// ─── 중간 바디 영역 ───────────────────────────────────────────────────────────
export function MobileCardBody({
  children,
  className,
}: MobileCardSectionProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      {children}
    </div>
  );
}

// ─── 하단 푸터 영역 (border-t 구분선 포함) ───────────────────────────────────
export function MobileCardFooter({
  children,
  className,
}: MobileCardSectionProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 pt-1 border-t',
        className
      )}
    >
      {children}
    </div>
  );
}
