import React from 'react';
import { Phone } from 'lucide-react';
import { supportsTelephone } from '../utils/device-detection';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui';

interface ContactButtonProps {
  /** 전화번호 (기본값: '064-713-2002') */
  phoneNumber?: string;
  /** 버튼 크기 */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** 버튼 변형 */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 전화번호 텍스트 표시 여부 (기본값: true) */
  showText?: boolean;
  /** 전화번호 텍스트를 특정 화면 크기에서만 표시할지 여부 */
  textBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'always';
  /** 커스텀 라벨 (기본값: 전화번호) */
  label?: string;
  /** 툴팁 메시지 커스터마이징 */
  tooltipMessage?: {
    /** 전화 기능 지원시 메시지 */
    supported?: string;
    /** 전화 기능 미지원시 메시지 */
    notSupported?: string;
  };
  /** 클릭 이벤트 핸들러 (기본 전화 걸기 동작을 오버라이드) */
  onClick?: () => void;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  phoneNumber = '064-713-2002',
  size = 'sm',
  variant = 'outline',
  className = '',
  showText = true,
  textBreakpoint = 'lg',
  label,
  tooltipMessage,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (supportsTelephone()) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const getTextVisibilityClass = () => {
    if (!showText) return 'sr-only';

    switch (textBreakpoint) {
      case 'always':
        return '';
      case 'sm':
        return 'hidden sm:inline';
      case 'md':
        return 'hidden md:inline';
      case 'lg':
        return 'hidden lg:inline';
      case 'xl':
        return 'hidden xl:inline';
      case '2xl':
        return 'hidden 2xl:inline';
      default:
        return 'hidden lg:inline';
    }
  };

  const displayLabel = label || phoneNumber;
  const isSupported = supportsTelephone();

  const defaultTooltipMessage = {
    supported: `${phoneNumber}로 전화걸기`,
    notSupported: '모바일에서 이용 가능합니다',
  };

  const tooltip = tooltipMessage || defaultTooltipMessage;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center space-x-1 bg-transparent hover:bg-accent border-border ${
            !isSupported ? 'cursor-not-allowed opacity-60' : ''
          } ${className}`}
          onClick={handleClick}
        >
          <Phone className="w-4 h-4" />
          <span className={getTextVisibilityClass()}>{displayLabel}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isSupported ? tooltip.supported : tooltip.notSupported}
      </TooltipContent>
    </Tooltip>
  );
};
