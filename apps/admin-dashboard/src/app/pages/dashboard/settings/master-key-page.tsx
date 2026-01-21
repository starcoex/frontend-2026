import React, { useState } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { toast } from 'sonner';
import {
  Loader2,
  ShieldAlert,
  Lock,
  X,
  Lightbulb,
  KeyRound,
  Shield,
  ClipboardList,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentSection from '@/app/pages/dashboard/settings/components/content-section';

export function MasterKeyPromotePage() {
  const { promoteToSuperAdminWithMasterKey, currentUser } = useAuth();

  const [userId, setUserId] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId || !masterKey) {
      setError('사용자 ID와 마스터 키를 모두 입력해주세요.');
      return;
    }

    // ✅ 추가 확인
    if (
      !window.confirm(
        `정말로 사용자 ID ${userId}를 SUPER_ADMIN으로 승격하시겠습니까?`
      )
    ) {
      return;
    }

    setIsPromoting(true);

    try {
      const response = await promoteToSuperAdminWithMasterKey({
        userId: parseInt(userId),
        masterKey,
      });

      if (response.success) {
        toast.success(
          response.data?.promoteToSuperAdminWithMasterKey?.message ||
            'SUPER_ADMIN으로 승격되었습니다!'
        );

        // 폼 초기화
        setUserId('');
        setMasterKey('');

        // 본인이 승격된 경우 새로고침
        if (currentUser?.id === parseInt(userId)) {
          setTimeout(() => {
            toast.success(
              '권한이 업데이트되었습니다. 페이지를 새로고침합니다.'
            );
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, 1500);
        }
      } else {
        const errorMsg =
          response.error?.message ||
          response.graphQLErrors?.[0]?.message ||
          'SUPER_ADMIN 승격에 실패했습니다.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <ContentSection
      title="시스템 초기화"
      desc="마스터 키를 사용하여 첫 SUPER_ADMIN을 생성합니다."
      className="w-full lg:max-w-2xl"
    >
      <div>
        {/* ⚠️ 경고 알림 */}
        <Alert variant="destructive" className="mb-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">보안 경고</AlertTitle>
          <AlertDescription>
            이 페이지는 시스템 초기 설정용입니다.
            <br />
            마스터 키는 절대 공유하지 마세요.
            <br />
            이미 SUPER_ADMIN이 존재하는 경우 이 기능을 사용할 수 없습니다.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              마스터 키 인증
            </CardTitle>
            <CardDescription>
              백엔드 환경 변수에 설정된 마스터 키가 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>오류 발생</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setError(null)}
                    className="h-6 w-6 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePromote} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">사용자 ID *</Label>
                <Input
                  id="userId"
                  type="number"
                  placeholder="예: 1"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={isPromoting}
                  required
                  min="1"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  사용자 관리 페이지에서 ID를 확인할 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterKey">마스터 키 *</Label>
                <div className="relative">
                  <Input
                    id="masterKey"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="마스터 키 입력"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    disabled={isPromoting}
                    required
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    disabled={isPromoting}
                  >
                    {showPassword ? '숨기기' : '보기'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <KeyRound className="h-3 w-3" />
                  환경 변수:{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    MASTER_KEY
                  </code>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPromoting || !userId || !masterKey}
              >
                {isPromoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    승격 처리 중...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    SUPER_ADMIN으로 승격
                  </>
                )}
              </Button>
            </form>

            {/* 📖 안내 사항 */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                사용 가이드
              </h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>일반 사용자로 회원가입 완료</li>
                <li>
                  <strong>사용자 관리 페이지</strong>에서 해당 사용자의 ID 확인
                </li>
                <li>
                  백엔드{' '}
                  <code className="bg-muted-foreground/10 px-1 rounded">
                    env
                  </code>{' '}
                  파일에서 마스터 키 확인
                </li>
                <li>위 폼에서 정보 입력 후 승격 실행</li>
                <li>승격 완료 후 로그아웃 후 재로그인 (권한 갱신)</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  );
}

export default MasterKeyPromotePage;
