import { UsersTable } from './components/users-table';
import { columns } from './components/users-columns';
import { User } from '@starcoex-frontend/graphql';
import { useOutletContext } from 'react-router-dom';

// ✅ 타입 정의
type UsersOutletContext = {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => void;
};

export default function UsersPage() {
  // ✅ context에서 데이터 받기 (API 호출 제거)
  const { users, loading, error } = useOutletContext<UsersOutletContext>();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  return <UsersTable data={users} columns={columns} />;
}
