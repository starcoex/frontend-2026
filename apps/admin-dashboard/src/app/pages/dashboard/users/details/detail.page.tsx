import { UserDetailForm } from './components/user-detail-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@starcoex-frontend/auth';
import { User } from '@starcoex-frontend/graphql';
import { useUsersContext } from '@starcoex-frontend/auth';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById } = useAuth();
  const { refetch } = useUsersContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false); // ✅ ref로 변경

  // ✅ fetchUser를 useCallback으로 감싸서 안정화
  const fetchUser = useCallback(
    async (userId: number) => {
      if (!userId || userId <= 0) {
        navigate('/admin/users', { replace: true });
        return;
      }

      setLoading(true);

      try {
        const response = await getUserById(userId);

        if (response.success && response.data?.getUserById) {
          setUser(response.data.getUserById);
        } else {
          navigate('/admin/users', { replace: true });
        }
      } catch (error) {
        navigate('/admin/users', { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [getUserById, navigate]
  );

  useEffect(() => {
    if (!id || isNaN(Number(id)) || hasFetchedRef.current) {
      if (!id || isNaN(Number(id))) {
        navigate('/admin/users', { replace: true });
      }
      return;
    }

    hasFetchedRef.current = true;
    fetchUser(Number(id));
  }, [id, navigate, fetchUser]);

  const handleUpdate = useCallback(async () => {
    if (id) {
      const response = await getUserById(Number(id));
      if (response.success && response.data?.getUserById) {
        setUser(response.data.getUserById);
      }
    }
    await refetch();
  }, [id, getUserById, refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/users">Users</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 space-y-1">
        <div className="flex flex-wrap gap-2">
          <h1 className="text-lg font-bold">User Details: {user.name}</h1>
          <Badge variant="outline" className="text-muted-foreground">
            #{user.id}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Comprehensive user information, including details, role, status, and
          management options.
        </p>
      </div>

      <div className="mt-4">
        <UserDetailForm user={user as User} onUpdate={handleUpdate} />
      </div>
    </div>
  );
};
