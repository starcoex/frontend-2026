import React from 'react';
import { HeroPresets, HeroPresetKey } from './hero-images';
import { cn } from '../utils/utils';

interface HeroBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 이미지 소스
   * - Preset Key: 'main', 'gas-station' 등 (정적)
   * - URL String: 'https://api.starcoex.com/uploads/...' (동적/업로드)
   */
  imageSource?: HeroPresetKey | string;

  /** 배경 위에 깔릴 어두운 막의 투명도 (0.0 ~ 1.0) */
  overlayOpacity?: number;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  imageSource = 'main',
  overlayOpacity = 0,
  className,
  style,
  children,
  ...props
}) => {
  // 1. 로직: 입력값이 프리셋에 있으면 프리셋 사용, 없으면 URL로 간주
  // (타입 단언을 사용하여 string 키 접근 허용)
  const bgImage = (HeroPresets as any)[imageSource] || imageSource;

  return (
    <div
      // ✅ 부모는 relative여야 내부 absolute가 기준을 잡습니다.
      className={cn(
        'absolute inset-0 bg-cover bg-center bg-no-repeat z-0',
        className
      )}
      style={{
        backgroundImage: `url(${bgImage})`,
        ...style,
      }}
      {...props}
    >
      {/* 오버레이 */}
      {overlayOpacity > 0 && (
        <div
          // ✅ [수정] z-10 추가하여 배경 이미지보다 확실히 위에 뜨게 설정
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500 z-10"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* 자식 요소(텍스트 등)는 오버레이보다 더 위에 있어야 하므로 z-20 부여 */}
      <div className="relative z-20 w-full h-full">{children}</div>
    </div>
  );
};
