import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, UserCog, Loader2 } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        '정말로 계정을 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.'
      )
    ) {
      return;
    }
    if (!window.confirm('정말 확실합니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success('계정이 삭제되었습니다.');
        window.location.href = '/';
      } else {
        toast.error(result.error?.message || '계정 삭제 실패');
      }
    } catch (error) {
      console.error('Delete Account Error:', error);
      toast.error('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <CardTitle className="text-3xl font-bold mb-2">설정</CardTitle>
        <CardDescription>앱 설정 및 계정 관리를 수행합니다.</CardDescription>
      </div>

      <div className="space-y-6">
        {/* 일반 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">일반</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Link
              to="/security"
              className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-medium">보안 설정</CardTitle>
                  <CardDescription>비밀번호 변경, 2단계 인증</CardDescription>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Separator className="my-1" />

            <Link
              to="/profile"
              className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-medium">프로필 관리</CardTitle>
                  <CardDescription>내 정보 수정, 아바타 변경</CardDescription>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* 추후 알림 설정 등 추가 가능 */}
            {/* <Link to="/settings/notifications" ... /> */}
          </CardContent>
        </Card>

        {/* 계정 작업 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">계정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex items-center justify-between">
            <div className="flex flex-col items-start text-sm">
              <CardDescription className="font-bold tracking-wide text-destructive">
                계정 삭제
              </CardDescription>
              <CardDescription className="text-muted-foreground font-medium">
                계정을 영구적으로 삭제합니다.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {/* ✅ [수정] DeleteActions 컴포넌트 대신 직접 버튼과 핸들러 연결 */}
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '계정 삭제'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
