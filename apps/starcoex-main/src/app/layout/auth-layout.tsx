import {
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
  Link,
} from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@starcoex-frontend/auth';

/**
 * 🔐 인증 페이지 전용 레이아웃
 */
export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, initialized, checkAuthStatus } = useAuth();

  // 1) 아직 인증 초기화가 되지 않았다면, 한 번만 서버에 상태 확인 요청
  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  // 2) 초기화 중이거나 로딩 중이면 로딩 UI
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 이미 인증된 사용자는 대시보드로 리디렉션
  if (isAuthenticated === true) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="p-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {/* 뒤로가기 버튼 */}
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault(); // 기본 링크 동작(페이지 이동) 방지
              navigate(-1); // 뒤로 가기 기능 실행
            }}
            className="p-2 h-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-7 h-7" />
          </Link>

          {/* 홈 버튼 */}
          <Link
            to={'/'}
            className="p-2 h-auto text-muted-foreground hover:text-foreground"
          >
            <Home className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 - 중앙정렬 */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
