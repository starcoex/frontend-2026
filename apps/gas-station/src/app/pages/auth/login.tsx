import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Globe, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Disable2FaDuringLoginInput } from '@starcoex-frontend/graphql';
import {
  PageHead,
  LoginForm,
  SocialLoginButtons,
  IdentityLoginCard,
  TwoFactorAuthForm,
  useLoginForm,
} from '@starcoex-frontend/common';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { APP_CONFIG } from '@/app/config/app.config';
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
import { AnimatedBackground } from '@/app/pages/auth/animated-background';

const LoginPageContent: React.FC = () => {
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
  } = useLoginForm({ redirectTo: APP_CONFIG.routes.home });

  const pageTitle = `로그인 - ${APP_CONFIG.seo.siteName}`;
  const pageDescription = `${APP_CONFIG.seo.siteName}에 로그인하여 모든 서비스를 이용하세요.`;

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDescription}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.login}`}
        robots="noindex, nofollow"
      />

      {/* 애니메이션 배경 (오피넷 API 연동) */}
      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 에러 표시 */}
          {error && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-auto p-1 hover:bg-transparent"
                  >
                    ✕
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* 2FA 인증 화면 */}
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
              onDisable2FA={async (input: Disable2FaDuringLoginInput) => {
                try {
                  await handleDisable2FA(input);
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : '2FA 해제 실패'
                  );
                }
              }}
            />
          ) : (
            /* 3단 탭 구성 */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full space-y-6"
              >
                <TabsList className="grid w-full grid-cols-3 h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <TabsTrigger value="email" className="text-sm gap-2">
                    <Mail className="w-4 h-4" />
                    이메일
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-sm gap-2">
                    <Globe className="w-4 h-4" />
                    소셜
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="text-sm gap-2">
                    <Smartphone className="w-4 h-4" />
                    휴대폰
                  </TabsTrigger>
                </TabsList>

                {/* 탭 1: 이메일 로그인 */}
                <TabsContent value="email" className="mt-0">
                  <LoginForm
                    redirectTo={APP_CONFIG.routes.home}
                    forgotPasswordPath={APP_CONFIG.routes.forgotPassword}
                    registerPath={APP_CONFIG.routes.register}
                    cardClassName="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                    inputClassName="bg-white dark:bg-gray-800"
                    buttonClassName="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  />
                </TabsContent>

                {/* 탭 2: 소셜 로그인 */}
                <TabsContent value="social" className="mt-0">
                  <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle>소셜 계정 로그인</CardTitle>
                      <CardDescription>
                        사용 중인 소셜 계정으로 간편하게 로그인하세요
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-4">
                        <SocialLoginButtons />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 탭 3: 휴대폰 본인인증 로그인 */}
                <TabsContent value="phone" className="mt-0">
                  <IdentityLoginCard
                    isLoading={isLoading}
                    onStartVerification={handleStartVerification}
                    onSwitchToEmailLogin={() => setActiveTab('email')}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

// FuelDataProvider로 감싸서 export
export const LoginPage: React.FC = () => {
  return (
    <FuelDataProvider>
      <LoginPageContent />
    </FuelDataProvider>
  );
};
