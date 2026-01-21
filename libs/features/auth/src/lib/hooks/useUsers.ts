import { useAuth } from './useAuth';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  InvitationStatus,
  User,
  UserInvitation,
} from '@starcoex-frontend/graphql';

interface UseUsersOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { initialPage = 1, initialLimit = 20, autoFetch = true } = options;

  const {
    getAllUsers,
    getUsersStats,
    getInvitations,
    inviteUser,
    cancelInvitation,
    resendInvitation,
    verifyInvitationToken,
    acceptInvitation,
  } = useAuth();

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    emailUnverifiedUsers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // 초대 관련 상태
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [invitationsPage, setInvitationsPage] = useState(1);
  const [invitationsLimit, setInvitationsLimit] = useState(20);
  const [invitationsTotal, setInvitationsTotal] = useState(0);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [invitationsError, setInvitationsError] = useState<string | null>(null);
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<
    InvitationStatus | undefined
  >(undefined);

  // ✅ 중복 실행 방지 + 초기 fetch 완료 여부
  const isFetchingUsers = useRef(false);
  const isFetchingStats = useRef(false);
  const hasFetchedStats = useRef(false);
  const isFetchingInvitations = useRef(false);
  const hasFetchedInvitations = useRef(false);
  const isInitialMount = useRef(true); // ✅ 초기 마운트 추적

  // 사용자 목록 조회
  const fetchUsers = useCallback(async () => {
    if (isFetchingUsers.current) return;

    isFetchingUsers.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await getAllUsers({
        page,
        limit,
        search: search || undefined,
        status: statusFilter.length > 0 ? statusFilter : undefined,
        role: roleFilter.length > 0 ? roleFilter : undefined,
      });

      if (response.success && response.data?.getAllUsers) {
        const { users: fetchedUsers, pagination } = response.data.getAllUsers;
        setUsers(fetchedUsers || []);
        setTotal(pagination?.total || 0);
        setHasMore(pagination?.hasNextPage || false);
      } else {
        setError(
          response.error?.message || '사용자 목록을 불러오는데 실패했습니다'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      );
    } finally {
      setLoading(false);
      isFetchingUsers.current = false;
    }
  }, [getAllUsers, page, limit, search, statusFilter, roleFilter]);

  // 통계 조회
  const fetchStats = useCallback(async () => {
    if (isFetchingStats.current || hasFetchedStats.current) return;

    isFetchingStats.current = true;
    setStatsLoading(true);

    try {
      const response = await getUsersStats();

      if (response.success && response.data?.getUsersStats) {
        const statsData = response.data.getUsersStats;
        setStats({
          totalUsers: statsData.overview?.totalUsers || 0,
          activeUsers: statsData.overview?.activeUsers || 0,
          inactiveUsers: statsData.overview?.inactiveUsers || 0,
          emailUnverifiedUsers:
            statsData.verification?.emailUnverifiedUsers || 0,
        });
        hasFetchedStats.current = true;
      }
    } catch (err) {
      console.error('통계 조회 실패:', err);
    } finally {
      setStatsLoading(false);
      isFetchingStats.current = false;
    }
  }, [getUsersStats]);

  // ✅ 초대 목록 조회 (간소화)
  const fetchInvitations = useCallback(async () => {
    if (isFetchingInvitations.current) {
      return;
    }

    isFetchingInvitations.current = true;
    setInvitationsLoading(true);
    setInvitationsError(null);

    try {
      const response = await getInvitations({
        page: invitationsPage,
        limit: invitationsLimit,
        status: invitationStatusFilter,
      });

      if (response.success && response.data?.getInvitations) {
        const { invitations: fetchedInvitations, pagination } =
          response.data.getInvitations;

        setInvitations(fetchedInvitations || []);
        setInvitationsTotal(pagination?.total || 0);
        setInvitationsError(null);
        hasFetchedInvitations.current = true;
      } else {
        const errorMsg =
          response.error?.message ||
          response.graphQLErrors?.[0]?.message ||
          '초대 목록을 불러오는데 실패했습니다';

        setInvitationsError(errorMsg);

        if (errorMsg.includes('Forbidden') || errorMsg.includes('권한')) {
          toast.error('초대 목록을 볼 권한이 없습니다.');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';

      setInvitationsError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setInvitationsLoading(false);
      isFetchingInvitations.current = false;
    }
  }, [
    getInvitations,
    invitationsPage,
    invitationsLimit,
    invitationStatusFilter,
  ]);

  // 초대 보내기
  const handleInviteUser = useCallback(
    async (input: {
      email: string;
      role?: string;
      userType?: string;
      adminMessage?: string;
    }) => {
      try {
        const response = await inviteUser(input as any);

        if (response.success) {
          toast.success(
            response.message ||
              `${input.email}에게 초대 이메일이 발송되었습니다.`
          );
          hasFetchedInvitations.current = false; // ✅ 재조회를 위해 플래그 리셋
          await fetchInvitations();
        } else {
          const errorMsg =
            response.error?.message ||
            response.graphQLErrors?.[0]?.message ||
            '초대 발송에 실패했습니다.';

          toast.error(errorMsg);
        }

        return response;
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : '초대 발송 중 오류가 발생했습니다.';

        toast.error(errorMsg);

        return {
          success: false,
          error: { message: errorMsg },
        };
      }
    },
    [inviteUser, fetchInvitations]
  );

  // 초대 취소
  const handleCancelInvitation = useCallback(
    async (invitationId: number) => {
      const response = await cancelInvitation(invitationId);
      if (response.success) {
        toast.success('초대가 취소되었습니다.');
        hasFetchedInvitations.current = false;
        await fetchInvitations();
      } else {
        toast.error(response.error?.message || '초대 취소에 실패했습니다.');
      }
      return response;
    },
    [cancelInvitation, fetchInvitations]
  );

  // 초대 재발송
  const handleResendInvitation = useCallback(
    async (invitationId: number) => {
      const response = await resendInvitation(invitationId);
      if (response.success) {
        toast.success('초대 이메일이 재발송되었습니다.');
        hasFetchedInvitations.current = false;
        await fetchInvitations();
      } else {
        toast.error(response.error?.message || '초대 재발송에 실패했습니다.');
      }
      return response;
    },
    [resendInvitation, fetchInvitations]
  );

  // 초대 토큰 검증
  const handleVerifyInvitation = useCallback(
    async (token: string) => {
      const response = await verifyInvitationToken(token);
      return response;
    },
    [verifyInvitationToken]
  );

  // 초대 수락
  const handleAcceptInvitation = useCallback(
    async (token: string, input: any) => {
      const response = await acceptInvitation(token, input);
      if (response.success) {
        hasFetchedInvitations.current = false;
        await fetchInvitations();
      }
      return response;
    },
    [acceptInvitation, fetchInvitations]
  );

  // ✅ 초기 로드 (사용자 목록)
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  // ✅ 초기 로드 (통계)
  useEffect(() => {
    if (autoFetch && !hasFetchedStats.current) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  // ✅ 초대 목록 초기 로드 및 필터 변경 시 재조회
  useEffect(() => {
    if (!autoFetch) return;

    // 초기 마운트 시에만 실행
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!hasFetchedInvitations.current) {
        fetchInvitations();
      }
      return;
    }

    // 필터 변경 시에는 플래그와 관계없이 재조회
    hasFetchedInvitations.current = false;
    fetchInvitations();
  }, [
    autoFetch,
    invitationsPage,
    invitationsLimit,
    invitationStatusFilter,
    fetchInvitations,
  ]);

  // 리프레시
  const refetch = useCallback(async () => {
    hasFetchedStats.current = false;
    hasFetchedInvitations.current = false;
    await Promise.all([fetchUsers(), fetchStats(), fetchInvitations()]);
  }, [fetchUsers, fetchStats, fetchInvitations]);

  return {
    users,
    total,
    hasMore,
    stats,
    loading,
    statsLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,

    invitations,
    invitationsPage,
    invitationsLimit,
    invitationsTotal,
    invitationsLoading,
    invitationsError,
    invitationStatusFilter,
    setInvitationsPage,
    setInvitationsLimit,
    setInvitationStatusFilter,

    refetch,
    fetchUsers,
    fetchInvitations,

    handleInviteUser,
    handleCancelInvitation,
    handleResendInvitation,
    handleVerifyInvitation,
    handleAcceptInvitation,
  };
};
