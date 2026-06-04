import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, BadgeCheck, ChevronRight } from 'lucide-react';
import type { User as UserType } from '@starcoex-frontend/graphql';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileSummaryProps {
  user: UserType;
}

const ROLE_LABEL: Record<string, string> = {
  USER: '일반 회원',
  BUSINESS: '사업자 회원',
  ADMIN: '관리자',
  DELIVERY: '배송 담당',
};

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ user }) => {
  const navigate = useNavigate();

  const rows = [
    {
      icon: Mail,
      label: '이메일',
      value: user.email ?? '-',
    },
    {
      icon: BadgeCheck,
      label: '회원 등급',
      value: ROLE_LABEL[user.role ?? ''] ?? user.role ?? '-',
    },
    {
      icon: Calendar,
      label: '가입일',
      value: user.createdAt
        ? new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(user.createdAt))
        : '-',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">내 계정 정보</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground h-8"
          onClick={() => navigate('/profile')}
        >
          전체 보기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="flex items-center gap-4 px-5 py-4 border-b bg-muted/30">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? '프로필'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <div className="font-semibold">{user.name ?? '이름 없음'}</div>
            <div className="text-xs text-muted-foreground">
              {ROLE_LABEL[user.role ?? ''] ?? user.role}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="divide-y">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-center gap-3 px-5 py-3"
              >
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground w-16 shrink-0">
                  {row.label}
                </span>
                <span
                  className={cn(
                    'text-sm truncate',
                    !row.value && 'text-muted-foreground'
                  )}
                >
                  {row.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
