import { UsersTable } from './components/users-table';
import { columns } from './components/users-columns';
import { User } from '@starcoex-frontend/graphql';
import { useLocation, useOutletContext } from 'react-router-dom';
import { useMemo } from 'react';

// ✅ 타입 정의
type UsersOutletContext = {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => void;
};

export default function UsersPage() {
  // ✅ context에서 데이터 받기 (API 호출 제거)
  const { users, error } = useOutletContext<UsersOutletContext>();
  const location = useLocation();

  // ✅ URL 경로에 따라 사용자 필터링
  const filteredUsers = useMemo(() => {
    const pathname = location.pathname;

    // /admin/users/admins - ADMIN + SUPER_ADMIN만
    if (pathname.includes('/admins')) {
      return users.filter(
        (user) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      );
    }

    // /admin/users/members - USER만
    if (pathname.includes('/members')) {
      return users.filter((user) => user.role === 'USER');
    }

    // /admin/users/drivers - DELIVERY만
    if (pathname.includes('/drivers')) {
      return users.filter((user) => user.role === 'DELIVERY');
    }

    // /admin/users - 전체 사용자
    return users;
  }, [users, location.pathname]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  return <UsersTable data={filteredUsers} columns={columns} />;
}
