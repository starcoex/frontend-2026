import { motion } from 'motion/react';
import { AlertTriangle, Globe, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Disable2FaDuringLoginInput } from '@starcoex-frontend/graphql';
import {
  PageHead,
  LoginForm,
  IdentityLoginCard,
  TwoFactorAuthForm,
  useLoginForm,
} from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';
// ↓ 로컬 SocialLoginButtons 사용 (심플 버전)
import { SocialLoginButtons } from '@/app/pages/auth/social-login-buttons';
import React from 'react';

// ─── 공통 스타일 상수 ─────────────────────────────────────────────────────────
const CARD_CLS =
  'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-cyan-100 dark:border-cyan-900/50';
const INPUT_CLS = 'bg-white dark:bg-gray-800 focus-visible:ring-cyan-500';
const BTN_CLS =
  'w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600';

// ─────────────────────────────────────────────────────────────────────────────

export const LoginPage: React.FC = () => {
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

  return (
    <>
      <PageHead
        title={`로그인 - ${APP_CONFIG.seo.siteName}`}
        description={`${APP_CONFIG.seo.siteName}에 로그인하여 세차 예약 및 대기 서비스를 이용하세요.`}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.login}`}
        robots="noindex, nofollow"
      />

      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 에러 */}
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

          {/* 2FA */}
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

                <TabsContent value="email" className="mt-0">
                  <LoginForm
                    redirectTo={APP_CONFIG.routes.home}
                    forgotPasswordPath={APP_CONFIG.routes.forgotPassword}
                    registerPath={APP_CONFIG.routes.register}
                    cardClassName={CARD_CLS}
                    inputClassName={INPUT_CLS}
                    buttonClassName={BTN_CLS}
                  />
                </TabsContent>

                <TabsContent value="social" className="mt-0">
                  <SocialLoginButtons />
                </TabsContent>

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
