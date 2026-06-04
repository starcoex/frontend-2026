import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Shield, User, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardsProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  isBusinessVerified: boolean;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  isEmailVerified,
  isPhoneVerified,
  is2FAEnabled,
  isBusinessVerified,
}) => {
  const navigate = useNavigate();

  const statuses = [
    {
      key: 'email',
      label: '이메일 인증',
      icon: Mail,
      done: isEmailVerified,
      href: '/auth/verify-email',
    },
    {
      key: 'phone',
      label: '휴대폰 인증',
      icon: Phone,
      done: isPhoneVerified,
      href: '/auth/verify-phone',
    },
    {
      key: '2fa',
      label: '2단계 인증',
      icon: Shield,
      done: is2FAEnabled,
      href: '/security',
    },
    {
      key: 'account',
      label: '계정 상태',
      icon: User,
      done: true, // 로그인 된 상태이므로 항상 정상
      href: '/profile',
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">계정 인증 현황</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.href)}
              className={cn(
                'flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all text-center',
                'hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
                item.done
                  ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                  : 'border-orange-300/50 bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-100/50 dark:hover:bg-orange-900/20'
              )}
            >
              {/* 아이콘 */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  item.done
                    ? 'bg-primary/15'
                    : 'bg-orange-100 dark:bg-orange-900/30'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    item.done ? 'text-primary' : 'text-orange-500'
                  )}
                />
              </div>

              {/* 라벨 */}
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>

              {/* 상태 뱃지 */}
              <div className="flex items-center gap-1">
                {item.done ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      완료
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs text-orange-500 font-medium">
                      미완료
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
