import { useAuth } from './useAuth';
import { useEffect, useState, useRef, useCallback } from 'react';
import { User } from '@starcoex-frontend/graphql';

interface UseUsersOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { initialPage = 1, initialLimit = 20, autoFetch = true } = options;

  // ✅ useAuth에서 함수들 가져오기
  const { getAllUsers, getUsersStats } = useAuth();

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    emailUnverifiedUsers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // ✅ 중복 실행 방지
  const isFetchingUsers = useRef(false);
  const isFetchingStats = useRef(false);
  const hasFetchedStats = useRef(false); // ✅ 통계는 한번만 fetch

  // ✅ 사용자 목록 조회
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

  // ✅ 통계 조회 (한번만 실행)
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
        hasFetchedStats.current = true; // ✅ 한번 성공하면 다시 fetch 안함
      }
    } catch (err) {
      console.error('통계 조회 실패:', err);
    } finally {
      setStatsLoading(false);
      isFetchingStats.current = false;
    }
  }, [getUsersStats]);

  // ✅ 초기 로드 및 필터 변경시 자동 조회
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  // ✅ 통계는 마운트시 한번만 조회
  useEffect(() => {
    if (autoFetch && !hasFetchedStats.current) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  // ✅ 리프레시 함수 (통계도 다시 가져옴)
  const refetch = useCallback(async () => {
    hasFetchedStats.current = false; // ✅ 통계 refetch 허용
    await Promise.all([fetchUsers(), fetchStats()]);
  }, [fetchUsers, fetchStats]);

  return {
    // 데이터
    users,
    total,
    hasMore,
    stats,

    // 로딩/에러
    loading,
    statsLoading,
    error,

    // 페이지네이션
    page,
    limit,
    setPage,
    setLimit,

    // 검색/필터
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,

    // 리프레시
    refetch,
    fetchUsers,
  };
};
