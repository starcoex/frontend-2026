import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { PageHead, RegisterForm } from '@starcoex-frontend/common';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';

const PersonalRegisterPageContent: React.FC = () => {
  const navigate = useNavigate();
  const { error, clearError } = useAuth();

  const pageTitle = `이메일 회원가입 - ${APP_CONFIG.seo.siteName}`;
  const pageDescription = `이메일로 ${APP_CONFIG.seo.siteName} 회원가입을 완료하세요.`;

  const handleBackToRegister = () => {
    navigate(APP_CONFIG.routes.register);
  };

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDescription}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.registerPersonal}`}
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
          {/* 뒤로가기 버튼 */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToRegister}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              소셜 로그인으로 돌아가기
            </Button>
          </motion.div>

          {/* 에러 표시 */}
          {error && (
            <motion.div
              className="mb-4"
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

          <RegisterForm
            redirectTo={APP_CONFIG.routes.register}
            verifyEmailPath={APP_CONFIG.routes.verifyEmail}
            loginPath={APP_CONFIG.routes.login}
            termsPath={APP_CONFIG.routes.terms}
            privacyPath={APP_CONFIG.routes.privacy}
            cardClassName="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
            inputClassName="bg-white dark:bg-gray-800"
            buttonClassName="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          />
        </motion.div>
      </div>
    </>
  );
};

// FuelDataProvider로 감싸서 export
export const PersonalRegisterPage: React.FC = () => {
  return (
    <FuelDataProvider>
      <PersonalRegisterPageContent />
    </FuelDataProvider>
  );
};
