import { useAuth } from '@starcoex-frontend/auth';
import { LayoutDashboard } from 'lucide-react';
import React from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AdminGuard = ({
  children,
  allowedRoles = ['ADMIN', 'SUPER_ADMIN'],
}: AdminGuardProps) => {
  const { user: currentUser } = useAuth();

  const hasPermission = currentUser?.role
    ? allowedRoles.includes(currentUser.role)
    : false;

  if (!hasPermission) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-muted p-4">
          <LayoutDashboard className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">접근 권한이 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            해당 페이지는 관리자 이상의 권한이 필요합니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
