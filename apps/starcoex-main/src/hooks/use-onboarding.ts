import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@starcoex-frontend/auth';

export function useOnboarding() {
  const {
    currentUser,
    getOnboardingStatus,
    completeOnboarding,
    updateOnboardingStep,
  } = useAuth();

  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isServerLoading, setIsServerLoading] = useState(true); // ✅ 초기값 true — 첫 조회 전까지 로딩

  useEffect(() => {
    if (!currentUser) {
      // currentUser 없으면 로딩 종료 (미인증 상태)
      setIsServerLoading(false);
      setIsCompleted(false);
      return;
    }

    let cancelled = false;
    setIsServerLoading(true);

    getOnboardingStatus()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data?.getOnboardingStatus) {
          const meta = res.data.getOnboardingStatus;
          setIsCompleted(meta.onboardingCompleted);
          setCurrentStep(meta.onboardingStep ?? 0);
        } else {
          setIsCompleted(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsCompleted(false);
      })
      .finally(() => {
        if (!cancelled) setIsServerLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCompleteOnboarding = useCallback(async () => {
    const res = await completeOnboarding();
    if (res.success && res.data?.completeOnboarding) {
      setIsCompleted(res.data.completeOnboarding.onboardingCompleted);
      setCurrentStep(res.data.completeOnboarding.onboardingStep ?? 0);
    }
    return res;
  }, [completeOnboarding]);

  const handleUpdateOnboardingStep = useCallback(
    async (step: number) => {
      setCurrentStep(step);
      const res = await updateOnboardingStep({ step });
      if (res.success && res.data?.updateOnboardingStep) {
        setCurrentStep(res.data.updateOnboardingStep.onboardingStep ?? step);
      }
      return res;
    },
    [updateOnboardingStep]
  );

  return {
    isCompleted,
    isLoading: isServerLoading, // ✅ isCompleted === null 조건 제거 — isServerLoading만 사용
    currentStep,
    completeOnboarding: handleCompleteOnboarding,
    updateOnboardingStep: handleUpdateOnboardingStep,
  };
}
