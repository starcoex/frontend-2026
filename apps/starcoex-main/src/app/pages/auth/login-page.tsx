import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Globe, Mail, Smartphone } from 'lucide-react';
import {
  LoginForm,
  SocialLoginButtons,
  IdentityLoginCard,
  StarLogo,
  TwoFactorAuthForm,
  useLoginForm,
} from '@starcoex-frontend/common';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginPage() {
  const {
    isLoading,
    error,
    clearError,
    activeTab,
    setActiveTab,
    show2FA,
    loginResult,
    on2FASubmit,
    handle2FACancel,
    handleRequestEmergencyCode,
    handleDisable2FA,
    getLoginUserInfo,
    handleStartVerification,
  } = useLoginForm({ redirectTo: '/' });

  return (
    <>
      <Helmet>
        <title>로그인 - 스타코엑스</title>
      </Helmet>

      <div className="w-full max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 mb-6"
          >
            <StarLogo
              format="svg"
              width={60}
              height={60}
              className="w-16 h-16"
            />
          </Link>
          <CardTitle className="text-2xl font-bold mb-2">
            스타코엑스 로그인
          </CardTitle>
          <CardDescription>
            하나의 계정으로 모든 서비스를 이용하세요
          </CardDescription>
        </div>

        {/* 에러 표시 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* 2FA 또는 로그인 탭 */}
        {show2FA && loginResult ? (
          <TwoFactorAuthForm
            isLoading={isLoading}
            onSubmit={on2FASubmit}
            onCancel={handle2FACancel}
            tempToken={getLoginUserInfo().tempToken || undefined}
            userEmail={getLoginUserInfo().userEmail}
            isSocialLogin={getLoginUserInfo().isSocialLogin}
            hasPassword={true}
            onRequestEmergencyCode={handleRequestEmergencyCode}
            onDisable2FA={handleDisable2FA}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                이메일
              </TabsTrigger>
              <TabsTrigger value="social">
                <Globe className="w-4 h-4 mr-2" />
                소셜
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Smartphone className="w-4 h-4 mr-2" />
                휴대폰
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <LoginForm redirectTo="/" />
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>소셜 계정 로그인</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLoginButtons />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phone">
              <IdentityLoginCard
                isLoading={isLoading}
                onStartVerification={handleStartVerification}
                onSwitchToEmailLogin={() => setActiveTab('email')}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
