import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui';

interface IdentityLoginCardProps {
  isLoading: boolean;
  onStartVerification: (redirectPath: string) => Promise<void>;
  onSwitchToEmailLogin?: () => void;
}

export function IdentityLoginCard({
  isLoading,
  onStartVerification,
  onSwitchToEmailLogin,
}: IdentityLoginCardProps) {
  const [localLoading, setLocalLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLocalLoading(true);
      // 본인인증 완료 후 돌아올 경로 지정 (현재는 /auth/login 고정)
      await onStartVerification('/auth/login?identity-callback=true');
      // 성공 시 토스트는 부모나 훅에서 처리한다고 가정하거나 여기서 띄움
    } catch (error) {
      // 에러 처리 위임
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  };

  const isBusy = isLoading || localLoading;

  return (
    <div className="space-y-4 mb-6">
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            휴대폰 인증 로그인
          </CardTitle>
          <CardDescription>
            휴대폰 또는 신용카드로 안전하게 본인인증하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            type="button"
            onClick={handleStart}
            disabled={isBusy}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isBusy ? '휴대폰 인증 진행 중...' : '휴대폰 인증으로 로그인'}
          </Button>
        </CardContent>
      </Card>

      {onSwitchToEmailLogin && (
        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToEmailLogin}
            className="text-muted-foreground hover:text-foreground"
          >
            이메일/비밀번호로 로그인하기
          </Button>
        </div>
      )}
    </div>
  );
}
