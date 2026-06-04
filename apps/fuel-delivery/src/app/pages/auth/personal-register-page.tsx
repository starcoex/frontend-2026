import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { PageHead, RegisterForm } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedBackground } from '@/app/pages/auth/components/animated-background';

export const PersonalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { error, clearError } = useAuth();

  return (
    <>
      <PageHead
        title={`이메일 회원가입 - ${APP_CONFIG.seo.siteName}`}
        description={`이메일로 ${APP_CONFIG.seo.siteName} 회원가입을 완료하세요.`}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.registerPersonal}`}
        robots="noindex, nofollow"
      />

      <AnimatedBackground />

      <section className="bg-background/60 relative px-6 lg:px-0 min-h-screen">
        <div className="container px-0 py-16 md:px-6">
          <div className="rounded-[16px] px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20">
            <motion.div
              className="mx-auto w-full max-w-md text-left mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(APP_CONFIG.routes.register)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                소셜 로그인으로 돌아가기
              </Button>
            </motion.div>

            {/* 에러 */}
            {error && (
              <motion.div
                className="mx-auto w-full max-w-md mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RegisterForm
                redirectTo={APP_CONFIG.routes.register}
                verifyEmailPath={APP_CONFIG.routes.verifyEmail}
                loginPath={APP_CONFIG.routes.login}
                termsPath={APP_CONFIG.routes.terms}
                privacyPath={APP_CONFIG.routes.privacy}
                cardClassName="border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] bg-card mx-auto w-full max-w-md rounded-[12px] border text-left"
                inputClassName="h-11 rounded-[8px]"
                buttonClassName="bg-foreground text-background hover:bg-foreground/90 h-11 w-full rounded-[8px]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
