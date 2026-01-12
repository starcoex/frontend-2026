import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useUsers } from '../hooks';
import { User, UserInvitation } from '@starcoex-frontend/graphql';

interface UsersContextType {
  users: User[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    emailUnverifiedUsers: number;
  };
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  search: string;
  setSearch: (search: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  roleFilter: string[];
  setRoleFilter: (filter: string[]) => void;
  fetchUsers: () => Promise<void>;

  // ✅ 초대 관련 필드 추가
  invitations: UserInvitation[];
  invitationsPage: number;
  invitationsLimit: number;
  invitationsTotal: number;
  invitationsLoading: boolean;
  invitationsError: string | null;
  setInvitationsPage: (page: number) => void;
  setInvitationsLimit: (limit: number) => void;
  fetchInvitations: () => Promise<void>;
  handleResendInvitation: (invitationId: number) => Promise<any>;
  handleCancelInvitation: (invitationId: number) => Promise<any>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const usersData = useUsers({ autoFetch: true, initialLimit: 50 });

  // ✅ useMemo로 Context value 최적화 (불필요한 리렌더 방지)
  const contextValue = useMemo(
    () => usersData,
    [
      usersData.users,
      usersData.stats,
      usersData.loading,
      usersData.statsLoading,
      usersData.error,
      usersData.total,
      usersData.hasMore,
      usersData.page,
      usersData.limit,
      usersData.search,
      usersData.statusFilter,
      usersData.roleFilter,
      usersData.refetch,
      usersData.fetchUsers,
      usersData.setPage,
      usersData.setLimit,
      usersData.setSearch,
      usersData.setStatusFilter,
      usersData.setRoleFilter,
      // ✅ 초대 필드 추가
      usersData.invitations,
      usersData.invitationsPage,
      usersData.invitationsLimit,
      usersData.invitationsTotal,
      usersData.invitationsLoading,
      usersData.invitationsError,
      usersData.setInvitationsPage,
      usersData.setInvitationsLimit,
      usersData.fetchInvitations,
      usersData.handleResendInvitation,
      usersData.handleCancelInvitation,
    ]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within UsersProvider');
  }
  return context;
};
