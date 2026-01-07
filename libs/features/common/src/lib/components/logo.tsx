import React from 'react';
import { Logos, type LogoKind, type LogoFormat } from '../logo';

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  kind?: LogoKind; // 'starcoex' | 'staroil' | 'delivery' | 'zeragae'
  format?: LogoFormat; // 'svg' | 'png'
  width?: number;
  height?: number;
  className?: string;
  /**
   * 다크모드에서 PNG로 강제하고 싶을 때 사용 (선택)
   * - true: 무조건 png 사용
   */
  preferPngInDarkMode?: boolean;
}

/**
 * 공통 로고 컴포넌트
 * - kind: 어떤 브랜드 로고인지
 * - format: svg / png 선택 (기본 svg)
 */
export const Logo: React.FC<LogoProps> = ({
  kind = 'starcoex',
  format = 'svg',
  width = 20,
  height = 20,
  className = '',
  alt,
  preferPngInDarkMode = false,
  ...rest
}) => {
  const logoSet = Logos[kind] ?? Logos.starcoex;

  let finalFormat: LogoFormat = format;

  // 다크모드에서 svg 색상이 안 맞는 경우, png 로 강제하는 옵션
  if (preferPngInDarkMode && typeof window !== 'undefined') {
    const isDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      finalFormat = 'png';
    }
  }

  const src = logoSet[finalFormat] ?? logoSet.svg;

  const defaultAlt =
    alt ||
    (kind === 'starcoex'
      ? 'logo-starcoex'
      : kind === 'staroil'
      ? 'logo-staroil'
      : kind === 'delivery'
      ? 'logo-starcoex-delivery'
      : kind === 'zeragae'
      ? 'logo-zeragae'
      : `logo-${kind}`);

  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={defaultAlt}
      className={className}
      {...rest}
    />
  );
};

/**
 * 편의 alias (기본 svg, 크기만 조절해서 사용)
 */

export const StarLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="starcoex" {...props} />
);

export const StarOilLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="staroil" {...props} />
);

export const StarDeliveryLogo: React.FC<Omit<LogoProps, 'kind'>> = ({
  width = 30,
  height = 30,
  ...props
}) => <Logo kind="delivery" width={width} height={height} {...props} />;

export const ZeragaeLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="zeragae" {...props} />
);

export const KakaoLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="kakao" {...props} />
);

export const NaverLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="naver" {...props} />
);

export const GoogleLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="google" {...props} />
);

export const AppleLogo: React.FC<Omit<LogoProps, 'kind'>> = (props) => (
  <Logo kind="apple" {...props} />
);
