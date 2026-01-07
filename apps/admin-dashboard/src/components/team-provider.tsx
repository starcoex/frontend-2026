import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { TeamName, UserRole } from '@/app/types/sidebar-type';
import { getSidebarData } from '@/components/layout/data/sidebar-data';
import { useAuth } from '@starcoex-frontend/auth';

interface TeamContextType {
  currentTeam: TeamName;
  userRole: UserRole;
  setCurrentTeam: (team: TeamName) => void;
  sidebarData: ReturnType<typeof getSidebarData>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within TeamProvider');
  }
  return context;
};

interface TeamProviderProps {
  children: React.ReactNode;
  initialTeam?: TeamName;
}

export const TeamProvider = ({ children, initialTeam }: TeamProviderProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  // ✅ 사용자의 팀 정보 가져오기
  const getUserTeam = (): TeamName => {
    // 1. 로컬 스토리지에서 저장된 팀 가져오기
    const savedTeam = localStorage.getItem('selectedTeam') as TeamName;
    if (savedTeam) return savedTeam;

    // 2. 백엔드에서 제공하는 사용자의 기본 팀 (추후 구현)
    // if (currentUser?.defaultTeam) return currentUser.defaultTeam as TeamName;

    // 3. props로 전달된 초기 팀
    if (initialTeam) return initialTeam;

    // 4. 기본값
    return 'StarcoexMain';
  };

  const [currentTeam, setCurrentTeam] = useState<TeamName>(getUserTeam);

  // ✅ 핵심 수정: 조건을 AND(&&)로 변경
  const userRole: UserRole = useMemo(() => {
    // 로딩 중이거나, 인증 안 됐거나, 사용자 정보 없으면 GUEST
    if (!isAuthenticated || !currentUser?.role) {
      return 'GUEST' as UserRole;
    }

    // 모든 조건을 통과하면 실제 역할 반환
    return currentUser.role as UserRole;
  }, [isAuthenticated, currentUser?.role]); // ✅ 의존성 중복 제거

  // 2. 사이드바 데이터를 userRole이 확정된 후 useMemo로 생성하여 최적화
  const sidebarData = useMemo(() => {
    // currentUser 정보를 sidebarData에 전달할 수 있도록 userData 객체 생성
    const userData = currentUser
      ? {
          name: currentUser.name || currentUser.email,
          email: currentUser.email,
          // 🚨 타입 에러 방지: currentUser.avatar가 null일 수 있으므로 안전하게 처리
          avatar: currentUser.avatar?.url || '/avatars/default.png',
        }
      : undefined;

    return getSidebarData(currentTeam, userRole, userData);
  }, [currentTeam, userRole, currentUser]); // currentTeam, userRole, currentUser 변경 시에만 재계산

  // 로컬 스토리지에 팀 선택 상태 저장 (선택사항)
  useEffect(() => {
    localStorage.setItem('selectedTeam', currentTeam);
  }, [currentTeam]);

  // 로컬 스토리지에 팀 선택 상태 저장
  useEffect(() => {
    localStorage.setItem('selectedTeam', currentTeam);
  }, [currentTeam]);

  // 사용자 로그인 시 팀 정보 자동 업데이트 (선택사항)
  useEffect(() => {
    if (currentUser && !initialTeam) {
      const userTeam = getUserTeam();
      if (userTeam !== currentTeam) {
        setCurrentTeam(userTeam);
      }
    }
  }, [currentUser]);

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        userRole,
        setCurrentTeam,
        sidebarData,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
