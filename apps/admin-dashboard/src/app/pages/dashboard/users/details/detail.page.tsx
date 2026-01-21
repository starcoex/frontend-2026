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
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById, currentUser, changeUserRole } = useAuth();
  const { refetch } = useUsersContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isChangingRole, setIsChangingRole] = useState(false);
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

  // ✅ 권한 변경 핸들러
  const handleRoleChange = async () => {
    if (!id || !selectedRole || selectedRole === user?.role) return;

    if (currentUser?.id === parseInt(id)) {
      toast.error('자신의 권한은 변경할 수 없습니다.');
      return;
    }

    if (
      !window.confirm(
        `${user?.name}(${user?.email})의 권한을 ${selectedRole}로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    setIsChangingRole(true);

    try {
      const response = await changeUserRole({
        targetUserId: parseInt(id),
        newRole: selectedRole as any,
      });

      if (response.success) {
        toast.success('권한이 성공적으로 변경되었습니다.');
        await handleUpdate();
      } else {
        const errorMsg =
          response.error?.message ||
          response.graphQLErrors?.[0]?.message ||
          '권한 변경에 실패했습니다.';
        toast.error(errorMsg);
        setSelectedRole(user?.role || 'USER');
      }
    } catch (error) {
      console.error('Role change failed:', error);
      toast.error('권한 변경 중 오류가 발생했습니다.');
      setSelectedRole(user?.role || 'USER');
    } finally {
      setIsChangingRole(false);
    }
  };

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

  const canChangeRole = currentUser?.role === 'SUPER_ADMIN';

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
        {/* ✅ 권한 변경 카드 (SUPER_ADMIN만) */}
        {canChangeRole && (
          <Card className="border-primary/20 mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                권한 관리
              </CardTitle>
              <CardDescription>
                사용자의 시스템 권한을 변경합니다. (SUPER_ADMIN 전용)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.id === user.id && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    ⚠️ 자신의 권한은 변경할 수 없습니다.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">권한 선택</Label>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                    disabled={isChangingRole || currentUser?.id === user.id}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="권한을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">일반 사용자 (USER)</SelectItem>
                      <SelectItem value="ADMIN">관리자 (ADMIN)</SelectItem>
                      <SelectItem value="SUPER_ADMIN">
                        최고 관리자 (SUPER_ADMIN)
                      </SelectItem>
                      <SelectItem value="DELIVERY">
                        배송 담당 (DELIVERY)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    💡 권한 변경은 신중하게 진행해주세요. 변경 후 즉시
                    적용됩니다.
                  </p>
                </div>

                <Button
                  onClick={handleRoleChange}
                  disabled={
                    isChangingRole ||
                    selectedRole === user.role ||
                    currentUser?.id === user.id
                  }
                  className="w-full"
                >
                  {isChangingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      권한 변경 중...
                    </>
                  ) : (
                    '권한 변경'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
