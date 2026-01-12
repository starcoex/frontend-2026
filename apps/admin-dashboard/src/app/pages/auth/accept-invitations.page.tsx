import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { AcceptInvitationForm } from '@/app/pages/dashboard/users/components/accept-invitation-form';

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyInvitationToken } = useAuth();

  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ 중복 실행 방지
  const hasVerified = useRef(false);

  useEffect(() => {
    // ✅ 이미 검증했거나 토큰이 없으면 종료
    if (hasVerified.current || !token) {
      if (!token) {
        setError('초대 토큰이 없습니다.');
        setVerifying(false);
      }
      return;
    }

    const verifyToken = async () => {
      try {
        hasVerified.current = true; // ✅ 검증 시작 표시

        const response = await verifyInvitationToken(token);

        // ✅ 응답 구조 확인
        if (response.success && response.data?.verifyInvitationToken) {
          const data = response.data.verifyInvitationToken;

          if (data.valid) {
            setInvitationData(data);
          } else {
            setError('초대 링크가 유효하지 않거나 만료되었습니다.');
          }
        } else {
          // ✅ 에러 메시지 자세히 표시
          const errorMessage =
            response.error?.message ||
            response.graphQLErrors?.[0]?.message ||
            '초대 링크가 유효하지 않거나 만료되었습니다.';
          setError(errorMessage);
        }
      } catch (err: any) {
        console.error('❌ Verification error:', err);

        // ✅ "이미 요청이 진행 중" 에러는 무시
        if (err.message?.includes('이미 요청이 진행 중')) {
          console.warn('⚠️ Duplicate request ignored');
          return;
        }

        setError(err.message || '초대 정보를 확인하는 중 오류가 발생했습니다.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, verifyInvitationToken]);

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">초대 정보 확인 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <IconAlertCircle className="h-5 w-5" />
              초대 링크 오류
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                로그인 페이지로 이동
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin/users/invitations')}
              >
                초대 관리 페이지로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>회원 가입 초대</CardTitle>
          <CardDescription>
            스타코엑스 관리자로 초대되었습니다. 아래 정보를 입력하여 계정을
            생성하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationData.adminMessage && (
            <Alert className="mb-6">
              <AlertDescription>
                <strong>관리자 메시지:</strong> {invitationData.adminMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">이메일:</div>
              <div className="font-medium">{invitationData.email}</div>

              <div className="text-muted-foreground">역할:</div>
              <div className="font-medium capitalize">
                {invitationData.role}
              </div>

              <div className="text-muted-foreground">사용자 타입:</div>
              <div className="font-medium">
                {invitationData.userType === 'INDIVIDUAL' ? '개인' : '사업자'}
              </div>
            </div>
          </div>

          <AcceptInvitationForm
            token={token!}
            email={invitationData.email}
            onSuccess={() => {
              navigate('/auth/verify-email', {
                state: {
                  email: invitationData.email,
                  fromInvitation: true,
                },
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
