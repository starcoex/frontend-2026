import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { PageHead, RegisterTypeForm } from '@starcoex-frontend/common';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { APP_CONFIG } from '@/app/config/app.config';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';

const RegisterTypePageContent: React.FC = () => {
  const navigate = useNavigate();

  const pageTitle = `회원가입 - ${APP_CONFIG.seo.siteName}`;
  const pageDescription = `간편한 소셜 로그인으로 ${APP_CONFIG.seo.siteName} 서비스를 이용하세요.`;

  const handleEmailRegister = () => {
    navigate(APP_CONFIG.routes.registerPersonal);
  };

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDescription}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.register}`}
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
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                회원가입
              </CardTitle>
              <CardDescription>
                소셜 로그인으로 3초만에 가입하고 모든 서비스를 이용하세요
              </CardDescription>
            </CardHeader>

            <RegisterTypeForm
              onEmailRegister={handleEmailRegister}
              loginPath={APP_CONFIG.routes.login}
              dividerClassName="bg-white/90 dark:bg-gray-900/90"
              buttonClassName="w-full h-12 font-medium group bg-white dark:bg-gray-800"
            />
          </Card>
        </motion.div>
      </div>
    </>
  );
};

// FuelDataProvider로 감싸서 export
export const RegisterTypePage: React.FC = () => {
  return (
    <FuelDataProvider>
      <RegisterTypePageContent />
    </FuelDataProvider>
  );
};
