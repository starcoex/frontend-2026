import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';
import { PageHead, RegisterTypeForm } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedBackground } from '@/app/pages/auth/components/animated-background';

export const RegisterTypePage: React.FC = () => {
  const navigate = useNavigate();

  const handleEmailRegister = () => {
    navigate(APP_CONFIG.routes.registerPersonal);
  };

  return (
    <>
      <PageHead
        title={`회원가입 - ${APP_CONFIG.seo.siteName}`}
        description={`간편한 소셜 로그인으로 ${APP_CONFIG.seo.siteName} 난방유 배달 서비스를 이용하세요.`}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.register}`}
        robots="noindex, nofollow"
      />

      <AnimatedBackground />

      <section className="bg-background/60 relative px-6 lg:px-0 min-h-screen">
        <div className="container px-0 py-16 md:px-6">
          <div className="rounded-[16px] px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20">
            {/* 로고 */}
            <div className="mb-4 flex w-full items-center justify-center sm:mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>

            <h1 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">
              회원가입
            </h1>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              가입 후 정량 보장 난방유 당일 배송을 이용하세요
            </p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] bg-card mx-auto w-full max-w-md rounded-[12px] border text-left">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-base">
                    소셜 계정으로 가입
                  </CardTitle>
                  <CardDescription>
                    3초 만에 가입하고 당일 배송을 시작하세요
                  </CardDescription>
                </CardHeader>
                <RegisterTypeForm
                  onEmailRegister={handleEmailRegister}
                  loginPath={APP_CONFIG.routes.login}
                  dividerClassName="bg-card"
                  buttonClassName="w-full h-11 rounded-[8px] font-medium"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
