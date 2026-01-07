import React, { useEffect, useState } from 'react';
import {
  Shield,
  Smartphone,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth, usePermissions } from '@starcoex-frontend/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 *  보안 설정 페이지 (2단계 인증 포함)
 */
export const SecurityPage: React.FC = () => {
  const {
    currentUser,
    changePassword,
    generateTwoFactorQR,
    enableTwoFactor,
    disableTwoFactor,
  } = useAuth();
  const { is2FAEnabled } = usePermissions();

  const [activeTab, setActiveTab] = useState<'password' | '2fa'>('password');

  // 비밀번호 변경 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false, // 추가
  });

  // 2FA 설정 상태
  const [twoFAState, setTwoFAState] = useState({
    step: 'setup' as 'setup' | 'verify' | 'complete',
    qrCode: '',
    verificationCode: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 메시지 자동 제거
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message]);

  // 2FA 설정 시작
  const handleSetup2FA = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await generateTwoFactorQR();

      if (result.success && result.data) {
        setTwoFAState((prev) => ({
          ...prev,
          step: 'verify',
          qrCode: result.data?.generate2FAQR.qrCodeImage || '',
        }));
      } else {
        setMessage({
          type: 'error',
          text: result.error?.message || '2단계 인증 설정에 실패했습니다.',
        });
      }
    } catch (error) {
      console.error('2FA 설정 시작 실패:', error);
      setMessage({ type: 'error', text: '2단계 인증 설정에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2FA 인증 코드 확인
  const handleVerify2FA = async () => {
    if (twoFAState.verificationCode.length !== 6) {
      setMessage({ type: 'error', text: '6자리 인증 코드를 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await enableTwoFactor({
        verificationCode: twoFAState.verificationCode,
      });

      if (result.success) {
        // 백업 코드 생성 (모의) - 실제로는 백엔드에서 제공해야 함
        const backupCodes = Array.from({ length: 10 }, () =>
          Math.random().toString(36).substring(2, 8).toUpperCase()
        );

        setTwoFAState((prev) => ({
          ...prev,
          step: 'complete',
          backupCodes,
        }));

        setMessage({
          type: 'success',
          text: '2단계 인증이 성공적으로 활성화되었습니다!',
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error?.message || '인증 코드가 올바르지 않습니다.',
        });
      }
    } catch (error) {
      console.error('2FA 인증 실패:', error);
      setMessage({ type: 'error', text: '인증 코드가 올바르지 않습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2FA 비활성화
  const handleDisable2FA = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const input = currentUser?.isSocialUser
        ? { currentPassword: '' } // 소셜 사용자는 비밀번호 없이
        : { currentPassword: prompt('현재 비밀번호를 입력하세요:') || '' }; // 일반 사용자는 비밀번호 필요

      if (!currentUser?.isSocialUser && !input.currentPassword) {
        setMessage({ type: 'error', text: '비밀번호를 입력해주세요.' });
        return;
      }

      const result = await disableTwoFactor(input);

      if (result.success) {
        setMessage({
          type: 'success',
          text: '2단계 인증이 비활성화되었습니다.',
        });
        setTwoFAState({
          step: 'setup',
          qrCode: '',
          verificationCode: '',
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error?.message || '2단계 인증 비활성화에 실패했습니다.',
        });
      }
    } catch (error) {
      console.error('2FA 비활성화 실패:', error);
      setMessage({
        type: 'error',
        text: '2단계 인증 비활성화에 실패했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSocialUser =
    currentUser?.password === null && currentUser?.isSocialUser;

  // 비밀번호 변경 처리
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: '비밀번호는 최소 6자리 이상이어야 합니다.',
      });
      return;
    }

    // 일반 사용자는 현재 비밀번호 필수, 소셜 사용자는 불필요
    if (!isSocialUser && !passwordForm.currentPassword) {
      setMessage({ type: 'error', text: '현재 비밀번호를 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const requestData = isSocialUser
        ? {
            currentPassword: '',
            newPassword: passwordForm.newPassword,
            newPasswordConfirmation: passwordForm.newPassword,
          } // 소셜 사용자는 현재 비밀번호 없이
        : {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
            newPasswordConfirmation: passwordForm.newPassword,
          };

      const result = await changePassword(requestData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: isSocialUser
            ? '비밀번호가 성공적으로 설정되었습니다.'
            : '비밀번호가 성공적으로 변경되었습니다.',
        });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false, // 추가
        });
      } else {
        setMessage({
          type: 'error',
          text:
            result.error?.message ||
            `비밀번호 ${isSocialUser ? '설정' : '변경'}에 실패했습니다.`,
        });
      }
    } catch (error) {
      console.error(`비밀번호 ${isSocialUser ? '설정' : '변경'} 실패:`, error);
      setMessage({
        type: 'error',
        text: isSocialUser
          ? '비밀번호 설정에 실패했습니다.'
          : '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 페이지 헤더 */}
      <CardContent className="mb-8">
        <CardTitle className="text-3xl font-bold mb-2">보안 설정</CardTitle>
        <CardDescription>
          계정 보안을 강화하고 안전하게 관리하세요.
        </CardDescription>
      </CardContent>

      {/* 알림 메시지 */}
      {message && (
        <Alert
          className={`mb-6 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <AlertDescription
            className={
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* 보안 상태 개요 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            보안 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>비밀번호</span>
              </div>
              <Badge
                variant="outline"
                className={
                  isSocialUser
                    ? 'text-orange-700 border-orange-200'
                    : 'text-green-700 border-green-200'
                }
              >
                {isSocialUser ? (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    설정 필요
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    변경 가능
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span>2단계 인증</span>
              </div>
              <Badge
                variant={is2FAEnabled() ? 'outline' : 'destructive'}
                className={
                  is2FAEnabled() ? 'text-green-700 border-green-200' : ''
                }
              >
                {is2FAEnabled() ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    활성화
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    비활성화
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            비밀번호 변경
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            2단계 인증
          </TabsTrigger>
        </TabsList>

        {/* 비밀번호 변경 탭 */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>
                {isSocialUser ? '비밀번호 설정' : '비밀번호 변경'}
              </CardTitle>
              <CardDescription>
                {isSocialUser
                  ? '소셜 로그인 계정에 비밀번호를 설정하여 보안을 강화하세요.'
                  : '보안을 위해 정기적으로 비밀번호를 변경해주세요.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 소셜 사용자 알림 */}
              {isSocialUser && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    소셜 로그인으로 가입하신 계정입니다. 비밀번호를 설정하면
                    이메일로도 로그인할 수 있습니다.
                  </AlertDescription>
                </Alert>
              )}

              {/* 현재 비밀번호 입력 (일반 사용자만) */}
              {!isSocialUser && (
                <div>
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={
                        passwordForm.showCurrentPassword ? 'text' : 'password'
                      }
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          showCurrentPassword: !prev.showCurrentPassword,
                        }))
                      }
                    >
                      {passwordForm.showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="newPassword">
                  {isSocialUser ? '비밀번호' : '새 비밀번호'}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={passwordForm.showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder={`${
                      isSocialUser ? '비밀번호' : '새 비밀번호'
                    }를 입력하세요 (최소 6자)`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        showNewPassword: !prev.showNewPassword,
                      }))
                    }
                  >
                    {passwordForm.showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  {isSocialUser ? '비밀번호' : '새 비밀번호'} 확인
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={
                      passwordForm.showConfirmPassword ? 'text' : 'password'
                    }
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder={`${
                      isSocialUser ? '비밀번호' : '새 비밀번호'
                    }를 다시 입력하세요`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        showConfirmPassword: !prev.showConfirmPassword,
                      }))
                    }
                  >
                    {passwordForm.showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={
                  isLoading ||
                  (!isSocialUser && !passwordForm.currentPassword) ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword
                }
                className="w-full"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Key className="w-4 h-4 mr-2" />
                )}
                {isSocialUser ? '비밀번호 설정' : '비밀번호 변경'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2단계 인증 탭 */}
        <TabsContent value="2fa">
          {is2FAEnabled() ? (
            // 2FA 활성화됨
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  2단계 인증 활성화됨
                </CardTitle>
                <CardDescription>
                  계정이 2단계 인증으로 보호되고 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      2단계 인증이 활성화되어 계정 보안이 강화되었습니다. 로그인
                      시 인증 앱에서 생성된 코드를 입력해야 합니다.
                    </AlertDescription>
                  </Alert>

                  {currentUser?.isSocialUser && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        소셜 로그인 사용자는 비밀번호 입력 없이 2단계 인증을
                        비활성화할 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    variant="destructive"
                    onClick={handleDisable2FA}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      '2단계 인증 비활성화'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : twoFAState.step === 'setup' ? (
            // 2FA 설정 시작
            <Card>
              <CardHeader>
                <CardTitle>2단계 인증 설정</CardTitle>
                <CardDescription>
                  계정 보안을 강화하기 위해 2단계 인증을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      <strong>2단계 인증이란?</strong>
                      <br />
                      비밀번호 외에 휴대폰 인증 앱을 통해 생성되는 6자리 코드를
                      추가로 입력하여 계정 보안을 강화하는 기능입니다.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <CardTitle className="font-medium">
                      설정하기 전에 준비사항:
                    </CardTitle>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Google Authenticator 또는 기타 인증 앱 설치</li>
                      <li>• 백업 코드를 안전한 곳에 저장할 준비</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleSetup2FA}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Smartphone className="w-4 h-4 mr-2" />
                    )}
                    2단계 인증 설정 시작
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            twoFAState.step === 'verify' && (
              // QR 코드 스캔 및 인증
              <Card>
                <CardHeader>
                  <CardTitle>QR 코드 스캔</CardTitle>
                  <CardDescription>
                    인증 앱으로 QR 코드를 스캔하고 생성된 코드를 입력하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR 코드 */}
                  <div className="text-center">
                    <div className="inline-block p-4 border rounded-lg bg-white">
                      <img
                        src={twoFAState.qrCode}
                        alt="2FA QR Code"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                  </div>

                  {/* 인증 코드 입력 */}
                  <div>
                    <Label htmlFor="verificationCode">인증 코드</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      maxLength={6}
                      value={twoFAState.verificationCode}
                      onChange={(e) =>
                        setTwoFAState((prev) => ({
                          ...prev,
                          verificationCode: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      placeholder="6자리 인증 코드"
                      className="mt-1 text-center text-2xl tracking-widest"
                    />
                  </div>

                  <Button
                    onClick={handleVerify2FA}
                    disabled={
                      isLoading || twoFAState.verificationCode.length !== 6
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    인증 완료
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
