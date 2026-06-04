import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Globe } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';
import { SocialLoginButtons } from '@/app/pages/auth/social-login-buttons';

const CARD_CLS =
  'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-cyan-100 dark:border-cyan-900/50';
const BTN_CLS =
  'w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600';

export const RegisterTypePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title={`회원가입 - ${APP_CONFIG.seo.siteName}`}
        description={`간편한 소셜 로그인으로 ${APP_CONFIG.seo.siteName} 세차 서비스를 이용하세요.`}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}${APP_CONFIG.routes.register}`}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="social" className="w-full space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <TabsTrigger value="social" className="text-sm gap-2">
                  <Globe className="w-4 h-4" />
                  소셜 가입
                </TabsTrigger>
                <TabsTrigger value="email" className="text-sm gap-2">
                  <Mail className="w-4 h-4" />
                  이메일 가입
                </TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="mt-0">
                <Card className={CARD_CLS}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      소셜 계정으로 가입
                    </CardTitle>
                    <CardDescription>
                      3초 만에 가입하고 프리미엄 세차를 예약하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SocialLoginButtons />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <Card className={CARD_CLS}>
                  <CardHeader>
                    <CardTitle className="text-base">이메일로 가입</CardTitle>
                    <CardDescription>
                      이메일과 비밀번호로 계정을 만드세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={BTN_CLS}
                      onClick={() =>
                        navigate(APP_CONFIG.routes.registerPersonal)
                      }
                    >
                      이메일로 시작하기
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* ✅ 로그인 링크 */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link
                to={APP_CONFIG.routes.login}
                className="font-medium text-cyan-600 hover:text-cyan-500 underline underline-offset-4 transition-colors"
              >
                로그인
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
