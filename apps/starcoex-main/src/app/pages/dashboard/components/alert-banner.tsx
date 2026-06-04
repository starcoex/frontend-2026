import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserType } from '@starcoex-frontend/graphql';

interface AlertItem {
  key: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  href: string;
  btnLabel: string;
}

interface AlertBannerProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  isIdentityVerified: boolean;
  userType: UserType;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  isEmailVerified,
  isPhoneVerified,
  is2FAEnabled,
  isIdentityVerified,
  userType,
}) => {
  const navigate = useNavigate();

  const alerts: AlertItem[] = [
    !isEmailVerified && {
      key: 'email',
      type: 'error',
      message:
        '이메일 인증을 완료해 주세요. 인증 후 모든 서비스를 이용할 수 있습니다.',
      href: '/auth/verify-email',
      btnLabel: '인증하기',
    },
    !isPhoneVerified && {
      key: 'phone',
      type: 'warning',
      message:
        '휴대폰 인증을 완료하면 보안이 강화되고 추가 혜택을 받을 수 있습니다.',
      href: '/auth/verify-phone',
      btnLabel: '인증하기',
    },
    !isIdentityVerified && {
      key: 'identity',
      type: 'warning',
      message: '본인인증을 완료하면 더 많은 서비스를 이용할 수 있습니다.',
      href: '/auth/identity-verification',
      btnLabel: '인증하기',
    },
    !is2FAEnabled && {
      key: '2fa',
      type: 'info',
      message: '2단계 인증을 설정하면 계정 보안이 크게 강화됩니다.',
      href: '/security',
      btnLabel: '설정하기',
    },
  ].filter(Boolean) as AlertItem[];

  if (alerts.length === 0) return null;

  const styleMap = {
    error: {
      wrapper:
        'border-orange-300/60 bg-orange-50/80 dark:bg-orange-900/20 dark:border-orange-700/40',
      icon: (
        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
      ),
      text: 'text-orange-800 dark:text-orange-300',
      btn: 'border-orange-400 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-600 dark:hover:bg-orange-900/30',
    },
    warning: {
      wrapper:
        'border-blue-300/60 bg-blue-50/80 dark:bg-blue-900/20 dark:border-blue-700/40',
      icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
      text: 'text-blue-800 dark:text-blue-300',
      btn: 'border-blue-400 text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/30',
    },
    info: {
      wrapper: 'border-border bg-muted/50',
      icon: (
        <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      ),
      text: 'text-muted-foreground',
      btn: 'border-border text-muted-foreground hover:bg-accent',
    },
  } as const;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const style = styleMap[alert.type];
        return (
          <div
            key={alert.key}
            className={cn(
              'flex items-start justify-between gap-4 p-4 rounded-xl border',
              style.wrapper
            )}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              {style.icon}
              <p className={cn('text-sm leading-relaxed', style.text)}>
                {alert.message}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className={cn('shrink-0 text-xs h-8', style.btn)}
              onClick={() => navigate(alert.href)}
            >
              {alert.btnLabel}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
