import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { usePermissions } from '@starcoex-frontend/auth';
import { useOnboarding } from '@/hooks/use-onboarding';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StarLogo } from '@starcoex-frontend/common';

type OnboardingStep = 'welcome' | 'verify' | 'services' | 'done';

const STEPS: { id: OnboardingStep; label: string; stepNumber: number }[] = [
  { id: 'welcome', label: '환영', stepNumber: 1 },
  { id: 'verify', label: '인증', stepNumber: 2 },
  { id: 'services', label: '서비스', stepNumber: 3 },
  { id: 'done', label: '완료', stepNumber: 4 },
];

/* ───────────────────────────────────────────
   메인 페이지
─────────────────────────────────────────── */
export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isEmailVerified, isPhoneVerified } = usePermissions();
  const { completeOnboarding, updateOnboardingStep } = useOnboarding();
  const [step, setStep] = useState<OnboardingStep>('welcome');

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  const goToStep = async (nextStep: OnboardingStep) => {
    const stepConfig = STEPS.find((s) => s.id === nextStep);
    if (stepConfig) {
      await updateOnboardingStep(stepConfig.stepNumber);
    }
    setStep(nextStep);
  };

  const handleDone = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 상단 로고 */}
      <header className="flex items-center gap-2 px-6 py-5">
        <StarLogo width={28} height={28} />
        <span className="font-bold text-base">스타코엑스</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  i < currentIndex && 'text-primary',
                  i === currentIndex && 'text-primary',
                  i > currentIndex && 'text-muted-foreground'
                )}
              >
                {i < currentIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Circle
                    className={cn(
                      'w-4 h-4',
                      i === currentIndex && 'fill-primary text-primary'
                    )}
                  />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px w-8 transition-colors',
                    i < currentIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 단계별 콘텐츠 */}
        <div className="w-full max-w-lg">
          {step === 'welcome' && (
            <WelcomeStep
              userName={currentUser?.name ?? '고객'}
              onNext={() => goToStep('verify')}
            />
          )}
          {step === 'verify' && (
            <VerifyStep
              isEmailVerified={isEmailVerified()}
              isPhoneVerified={isPhoneVerified()}
              onNext={() => goToStep('services')}
            />
          )}
          {step === 'services' && (
            <ServicesStep onNext={() => goToStep('done')} />
          )}
          {step === 'done' && <DoneStep onGoToDashboard={handleDone} />}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   Step 1 — 환영
─────────────────────────────────────────── */
const WelcomeStep: React.FC<{
  userName: string;
  onNext: () => void;
}> = ({ userName, onNext }) => (
  <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-4">
      <div className="text-6xl">🎉</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{userName}님, 환영합니다!</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          스타코엑스 가입을 축하드립니다.
          <br />
          빠르게 시작할 수 있도록 안내해 드릴게요.
        </p>
      </div>
    </div>

    {/* 간단 소개 카드 */}
    <div className="grid grid-cols-2 gap-3 text-left">
      {[
        { emoji: '⛽', label: '주유소 서비스' },
        { emoji: '🚗', label: '세차 서비스' },
        { emoji: '🚛', label: '난방유 배달' },
        { emoji: '🛡', label: '카케어 서비스' },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 p-3 rounded-xl border bg-card"
        >
          <span className="text-xl">{item.emoji}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      ))}
    </div>

    <Button size="lg" onClick={onNext} className="w-full">
      시작하기 <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

/* ───────────────────────────────────────────
   Step 2 — 인증
─────────────────────────────────────────── */
const VerifyStep: React.FC<{
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onNext: () => void;
}> = ({ isEmailVerified, isPhoneVerified, onNext }) => {
  const navigate = useNavigate();

  const items = [
    {
      label: '이메일 인증',
      subLabel: '가입 완료 필수',
      done: isEmailVerified,
      href: '/auth/verify-email',
      urgent: true,
    },
    {
      label: '휴대폰 인증',
      subLabel: '보안 강화 + 추가 혜택',
      done: isPhoneVerified,
      href: '/auth/verify-phone',
      urgent: false,
    },
  ];

  const allDone = isEmailVerified && isPhoneVerified;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">계정 인증</h2>
        <p className="text-muted-foreground text-sm">
          인증을 완료하면 더 많은 혜택을 받을 수 있어요.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center justify-between p-4 rounded-xl border transition-colors',
              item.done
                ? 'border-primary/30 bg-primary/5'
                : item.urgent
                ? 'border-orange-300/50 bg-orange-50/50 dark:bg-orange-900/10'
                : 'border-border bg-card'
            )}
          >
            <div className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle
                  className={cn(
                    'w-5 h-5 shrink-0',
                    item.urgent ? 'text-orange-500' : 'text-muted-foreground'
                  )}
                />
              )}
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">
                  {item.subLabel}
                </div>
              </div>
            </div>

            {item.done ? (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                완료
              </span>
            ) : (
              <Button
                size="sm"
                variant={item.urgent ? 'default' : 'outline'}
                onClick={() => navigate(item.href)}
              >
                인증하기
              </Button>
            )}
          </div>
        ))}
      </div>

      {allDone && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-primary">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>모든 인증이 완료되었습니다!</span>
        </div>
      )}

      <div className="space-y-2">
        <Button onClick={onNext} className="w-full">
          다음으로 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
        <button
          onClick={onNext}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          나중에 하기
        </button>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   Step 3 — 서비스 소개
─────────────────────────────────────────── */
const ServicesStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center space-y-1">
      <h2 className="text-2xl font-bold">이용 가능한 서비스</h2>
      <p className="text-muted-foreground text-sm">
        스타코엑스의 다양한 서비스를 이용해 보세요.
      </p>
    </div>

    <div className="space-y-3">
      {SERVICES_CONFIG.filter((s) => s.available).map((service) => {
        const Icon = service.icon;
        return (
          <a
            key={service.id}
            href={service.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border bg-card',
              'hover:shadow-sm transition-all group'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                service.color.background
              )}
            >
              <Icon className={cn('w-5 h-5', service.color.primary)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{service.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {service.description}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </a>
        );
      })}
    </div>

    <Button onClick={onNext} className="w-full">
      완료하기 <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

/* ───────────────────────────────────────────
   Step 4 — 완료
─────────────────────────────────────────── */
const DoneStep: React.FC<{ onGoToDashboard: () => void }> = ({
  onGoToDashboard,
}) => (
  <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">준비 완료!</h2>
        <p className="text-muted-foreground leading-relaxed text-sm">
          이제 스타코엑스의 모든 서비스를 이용할 수 있습니다.
          <br />
          대시보드에서 서비스 현황을 한눈에 확인하세요.
        </p>
      </div>
    </div>

    {/* 대시보드 미리보기 힌트 */}
    <div className="grid grid-cols-3 gap-2 opacity-60">
      {['서비스 현황', '인증 상태', '빠른 접근'].map((label) => (
        <div
          key={label}
          className="p-3 rounded-xl border bg-card text-xs text-center text-muted-foreground"
        >
          {label}
        </div>
      ))}
    </div>

    <Button size="lg" onClick={onGoToDashboard} className="w-full">
      대시보드 시작하기 🚀
    </Button>
  </div>
);
