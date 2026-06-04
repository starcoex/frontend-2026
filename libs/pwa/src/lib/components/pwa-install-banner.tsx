import { Download, X, Smartphone } from 'lucide-react';
import { usePwaInstall } from '../hooks';
import { Button } from './ui';
import { cn } from '../utils';

interface PwaInstallBannerProps {
  className?: string;
}

export function PwaInstallBanner({ className }: PwaInstallBannerProps) {
  const { isInstallable, isIos, install, dismiss } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm',
        className
      )}
    >
      {/* 아이콘 */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Smartphone className="h-4 w-4 text-primary" />
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">앱으로 설치하기</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {isIos
            ? '하단 공유 버튼 → "홈 화면에 추가" 를 탭하세요.'
            : '홈 화면에 추가하면 더 빠르게 이용할 수 있습니다.'}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        {!isIos && (
          <Button size="sm" className="h-8 text-xs" onClick={install}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            설치
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={dismiss}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
