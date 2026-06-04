import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { PageHead, RegisterForm } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';

const CARD_CLS =
  'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-cyan-100 dark:border-cyan-900/50';
const INPUT_CLS = 'bg-white dark:bg-gray-800 focus-visible:ring-cyan-500';
const BTN_CLS =
  'w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600';

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

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 뒤로가기 */}
          <motion.div
            className="mb-4"
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
              className="mb-6"
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

          {/* 폼 */}
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
              cardClassName={CARD_CLS}
              inputClassName={INPUT_CLS}
              buttonClassName={BTN_CLS}
            />
          </motion.div>

          {/* ✅ 로그인 링크 */}
          <motion.p
            className="mt-6 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            이미 계정이 있으신가요?{' '}
            <Link
              to={APP_CONFIG.routes.login}
              className="font-medium text-cyan-600 hover:text-cyan-500 underline underline-offset-4 transition-colors"
            >
              로그인
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};
