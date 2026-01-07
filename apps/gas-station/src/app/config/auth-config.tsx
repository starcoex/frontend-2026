import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { AppConfigContextType } from '@starcoex-frontend/common';
import { AnimatedBackground } from '@/app/pages/auth/animated-background';
import { APP_CONFIG } from './app.config';

// 페이지 래퍼 (배경 + 애니메이션 + FuelDataProvider)
const GasStationPageWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <FuelDataProvider>
    <AnimatedBackground />
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  </FuelDataProvider>
);

export const gasStationAuthConfig: Partial<AppConfigContextType> = {
  appName: APP_CONFIG.app.name,
  siteName: APP_CONFIG.seo.siteName,
  getSeoTitle: (pageTitle) => `${pageTitle} - ${APP_CONFIG.seo.siteName}`,
  routes: APP_CONFIG.routes,
  PageWrapper: GasStationPageWrapper,
  styles: {
    card: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-700',
    input: 'bg-white dark:bg-gray-800',
    primaryButton:
      'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
  },
};
