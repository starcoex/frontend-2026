import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '../ui';
import { supportsTelephone } from '../../utils';

interface ContactButtonProps {
  phoneNumber?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  className?: string;
  showText?: boolean;
  textBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'always';
  label?: string;
  tooltipMessage?: {
    supported?: string;
    notSupported?: string;
  };
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

  const isSupported = supportsTelephone();
  const displayLabel = label || phoneNumber;

  const defaultTooltipMessage = {
    supported: `${phoneNumber}로 전화걸기`,
    notSupported: '모바일에서 이용 가능합니다',
  };
  const tooltip = tooltipMessage || defaultTooltipMessage;
  const titleText = isSupported ? tooltip.supported : tooltip.notSupported;

  return (
    <Button
      variant={variant}
      size={size}
      title={titleText}
      className={`flex items-center space-x-1 bg-transparent hover:bg-accent border-border ${
        !isSupported ? 'cursor-not-allowed opacity-60' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <Phone className="w-4 h-4" />
      <span className={getTextVisibilityClass()}>{displayLabel}</span>
    </Button>
  );
};
