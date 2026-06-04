import { Search, XCircle } from 'lucide-react';
import React from 'react';

export interface ChatMessageSearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  matchCount: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  /** Input 컴포넌트 (앱마다 다른 디자인 시스템 대응) */
  InputComponent: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement>
  >;
  ButtonComponent: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: string;
      size?: string;
    }
  >;
}

export function ChatMessageSearchBar({
  query,
  onQueryChange,
  matchCount,
  currentIndex,
  onPrev,
  onNext,
  onClose,
  InputComponent,
  ButtonComponent,
}: ChatMessageSearchBarProps) {
  return (
    <div className="flex-shrink-0 border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <Search className="text-muted-foreground size-4 flex-shrink-0" />
        <InputComponent
          autoFocus
          aria-label="메시지 검색"
          placeholder="메시지 검색..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-8 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {query && (
          <span className="text-muted-foreground flex-shrink-0 text-xs">
            {matchCount > 0
              ? `${currentIndex + 1} / ${matchCount}`
              : '결과 없음'}
          </span>
        )}
        <ButtonComponent
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={onPrev}
          disabled={matchCount === 0}
          aria-label="이전 결과"
        >
          <span className="text-xs">▲</span>
        </ButtonComponent>
        <ButtonComponent
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={onNext}
          disabled={matchCount === 0}
          aria-label="다음 결과"
        >
          <span className="text-xs">▼</span>
        </ButtonComponent>
        <ButtonComponent
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={onClose}
          aria-label="검색 닫기"
        >
          <XCircle className="size-4" />
        </ButtonComponent>
      </div>
    </div>
  );
}
