import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type { User } from '@starcoex-frontend/graphql';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean | null;
  initialized: boolean;
}

interface AuthContextValue extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: () => void;
  setError: (message: string | null) => void;
  setLogout: () => void;
  setInitialized: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    initialized: false,
  });

  // ✅ setUser: 사용자 설정 시 initialized도 true로
  const setUser = useCallback((user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      initialized: true, // ✅ 사용자 설정 시 초기화 완료로 표시
      isLoading: false, // ✅ 로딩도 false로
    }));
  }, []);

  const setLoading = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
  }, []);

  const setError = useCallback((message: string | null) => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: message,
      initialized: true, // ✅ 에러가 발생해도 초기화 완료로 표시
    }));
  }, []);

  const setLogout = useCallback(() => {
    setState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      initialized: true, // ✅ 로그아웃도 초기화 완료 상태
    });
  }, []);

  const setInitialized = useCallback(() => {
    setState((prev) => ({ ...prev, initialized: true, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ✅ value 객체를 useMemo로 감싸서 참조 고정
  const value = useMemo(
    () => ({
      ...state,
      setUser,
      setLoading,
      setError,
      setLogout,
      setInitialized,
      clearError,
    }),
    [
      state,
      setUser,
      setLoading,
      setError,
      setLogout,
      setInitialized,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuthContext는 AuthProvider 내부에서만 사용해야 합니다.'
    );
  }
  return ctx;
};
