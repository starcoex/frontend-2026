import React from 'react';
import { Loader2 } from 'lucide-react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiShield, FiCalendar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

interface LoadingPageProps {
  /** 로딩 메시지 */
  message?: string;
  /** 서브 메시지 */
  subtitle?: string;
  /** 로딩 타입 */
  variant?: 'default' | 'portal' | 'auth' | 'booking' | 'custom';
  /** 커스텀 아이콘 */
  icon?: React.ReactNode;
  /** 전체 화면 여부 */
  fullScreen?: boolean;
  /** 애니메이션 속도 */
  speed?: 'slow' | 'normal' | 'fast';
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = '로딩 중...',
  subtitle,
  variant = 'default',
  icon,
  fullScreen = true,
  speed = 'normal',
}) => {
  // 변형별 설정
  const getVariantConfig = () => {
    switch (variant) {
      case 'portal':
        return {
          icon: <HiSparkles className="w-8 h-8 text-blue-500 animate-pulse" />,
          gradient: 'from-blue-500 to-purple-600',
          message: message || '포털 연결 중...',
          subtitle: subtitle || '스타코엑스 통합 시스템에 연결하고 있습니다',
          progressColor: 'bg-blue-500',
        };

      case 'auth':
        return {
          icon: <FiShield className="w-8 h-8 text-green-500 animate-pulse" />,
          gradient: 'from-green-500 to-blue-600',
          message: message || '인증 확인 중...',
          subtitle: subtitle || '로그인 상태를 확인하고 있습니다',
          progressColor: 'bg-green-500',
        };

      case 'booking':
        return {
          icon: (
            <FiCalendar className="w-8 h-8 text-purple-500 animate-bounce" />
          ),
          gradient: 'from-purple-500 to-pink-600',
          message: message || '예약 처리 중...',
          subtitle: subtitle || '예약 정보를 저장하고 있습니다',
          progressColor: 'bg-purple-500',
        };

      case 'custom':
        return {
          icon: icon || (
            <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-primary" />
          ),
          gradient: 'from-gray-500 to-gray-600',
          message,
          subtitle,
          progressColor: 'bg-primary',
        };

      default:
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin text-primary" />,
          gradient: 'from-primary to-primary/80',
          message,
          subtitle,
          progressColor: 'bg-primary',
        };
    }
  };

  const config = getVariantConfig();

  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} bg-background`}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* 메인 로딩 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 배경 그라디언트 원 */}
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 animate-pulse absolute inset-0`}
            />

            {/* 아이콘 컨테이너 */}
            <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center relative">
              {config.icon}
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            {config.message}
          </h2>

          {config.subtitle && (
            <p className="text-sm text-muted-foreground">{config.subtitle}</p>
          )}
        </div>

        {/* 진행 바 (Tailwind 애니메이션 사용) */}
        {variant !== 'custom' && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className={`${config.progressColor} h-1 rounded-full animate-[loading-progress_2s_ease-in-out_infinite]`}
              />
            </div>
          </div>
        )}

        {/* 닷 애니메이션 */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
