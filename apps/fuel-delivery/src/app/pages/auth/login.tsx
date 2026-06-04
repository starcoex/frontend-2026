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
import { AnimatedBackground } from '@/app/pages/auth/components/animated-background';

// ── 샘플 코드 스타일 상수 ─────────────────────────────────────────────────────
const CARD_CLS =
  'border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] bg-card mx-auto w-full max-w-md rounded-[12px] border text-left';
const INPUT_CLS = 'h-11 rounded-[8px]';
const BTN_CLS =
  'bg-foreground text-background hover:bg-foreground/90 h-11 w-full rounded-[8px]';

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
        description={`${APP_CONFIG.seo.siteName}에 로그인하여 난방유 배달 서비스를 이용하세요.`}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.login}`}
        robots="noindex, nofollow"
      />

      <AnimatedBackground />

      <section className="bg-background/60 relative px-6 lg:px-0 min-h-screen">
        <div className="container px-0 py-16 md:px-6">
          <div className="rounded-[16px] px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20">
            {/* 로고 */}
            <div className="mb-4 flex w-full items-center justify-center sm:mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">⛽</span>
              </div>
            </div>

            <h1 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">
              로그인
            </h1>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              별표주유소 난방유 배달 서비스에 오신 것을 환영합니다
            </p>

            {/* 에러 */}
            {error && (
              <motion.div
                className="mt-6 mx-auto max-w-md"
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
              <div className="mt-6">
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
              </div>
            ) : (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mx-auto w-full max-w-md space-y-4"
                >
                  {/* 탭 헤더 */}
                  <TabsList className="grid w-full grid-cols-3 h-11 rounded-[8px]">
                    <TabsTrigger
                      value="email"
                      className="text-sm gap-1.5 rounded-[6px]"
                    >
                      <Mail className="w-4 h-4" />
                      이메일
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="text-sm gap-1.5 rounded-[6px]"
                    >
                      <Globe className="w-4 h-4" />
                      소셜
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="text-sm gap-1.5 rounded-[6px]"
                    >
                      <Smartphone className="w-4 h-4" />
                      휴대폰
                    </TabsTrigger>
                  </TabsList>

                  {/* 이메일 탭 */}
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

                  {/* 소셜 탭 */}
                  <TabsContent value="social" className="mt-0">
                    <Card className={CARD_CLS}>
                      <CardHeader className="pb-0">
                        <CardTitle className="text-base">
                          소셜 계정 로그인
                        </CardTitle>
                        <CardDescription>
                          사용 중인 소셜 계정으로 간편하게 로그인하세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <SocialLoginButtons />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* 휴대폰 탭 */}
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
          </div>
        </div>
      </section>
    </>
  );
};
