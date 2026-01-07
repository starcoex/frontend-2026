import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  Alert,
  AlertDescription,
  Button,
  CardDescription,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  SmartTimer,
} from '../../ui';
import { cn } from '../../../utils/utils';

const verifyEmailSchema = z.object({
  activation_code: z.string().trim(),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export interface EmailVerificationConfig {
  email: string;
  totalDurationMs?: number;
  urgentThresholdMs?: number;
  criticalThresholdMs?: number;
  storageKey?: string;
}

export interface EmailVerificationCallbacks {
  onVerifyCode: (data: { email: string; code: string }) => Promise<{
    success: boolean;
    message?: string;
    error?: { message?: string };
    graphQLErrors?: Array<{ message: string }>;
  }>;
  onResendCode: (data: { email: string }) => Promise<{
    success: boolean;
    message?: string;
    error?: { message?: string };
    graphQLErrors?: Array<{ message: string }>;
  }>;
  onSuccess?: (data: { email: string; code: string }) => void;
  onTimeout?: () => void;
  onError?: (error: string) => void;
}

export interface EmailVerificationState {
  isLoading: boolean;
  error?: string;
  clearError: () => void;
}

export interface EmailVerificationFormProps {
  config: EmailVerificationConfig;
  callbacks: EmailVerificationCallbacks;
  state: EmailVerificationState;
  className?: string;
  // 스타일 오버라이드 추가
  styles?: {
    card?: string;
    input?: string;
    button?: string;
    primaryButton?: string;
  };
}

export function EmailVerificationForm({
  config,
  callbacks,
  state,
  className,
  styles,
}: EmailVerificationFormProps) {
  const {
    email,
    totalDurationMs = 15 * 60 * 1000,
    urgentThresholdMs = 5 * 60 * 1000,
    criticalThresholdMs = 60 * 1000,
    storageKey = 'verificationStartTime',
  } = config;

  const { onVerifyCode, onResendCode, onSuccess, onTimeout, onError } =
    callbacks;

  const { isLoading, error, clearError } = state;

  const [timerKey, setTimerKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(totalDurationMs);

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      activation_code: '',
    },
  });

  // 타이머 관리
  useEffect(() => {
    const storedStartTime = localStorage.getItem(storageKey);

    if (storedStartTime) {
      const savedTime = parseInt(storedStartTime, 10);
      const elapsedTime = Date.now() - savedTime;

      if (elapsedTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(storageKey);
      } else if (elapsedTime > totalDurationMs) {
        localStorage.removeItem(storageKey);
      }
    }

    const startTime = storedStartTime
      ? parseInt(storedStartTime, 10)
      : Date.now();

    const elapsedTime = Date.now() - startTime;
    const initialTimeLeft = totalDurationMs - elapsedTime;

    if (initialTimeLeft <= 0) {
      const newStartTime = Date.now();
      localStorage.setItem(storageKey, String(newStartTime));
      setTimeLeft(totalDurationMs);
    } else {
      setTimeLeft(initialTimeLeft);
    }

    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, String(startTime));
    }

    const interval = setInterval(() => {
      const currentStartTime = parseInt(
        localStorage.getItem(storageKey) || String(Date.now()),
        10
      );
      const elapsed = Date.now() - currentStartTime;
      const remainingTime = totalDurationMs - elapsed;

      if (remainingTime <= 0) {
        handleTimeout();
        clearInterval(interval);
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalDurationMs, timerKey, storageKey]);

  const handleSubmit = async (data: VerifyEmailFormData) => {
    try {
      clearError();

      const response = await onVerifyCode({
        email,
        code: data.activation_code,
      });

      if (response?.success) {
        localStorage.removeItem(storageKey);
        toast.success(response.message || '이메일 인증이 완료되었습니다.');
        onSuccess?.({ email, code: data.activation_code });
      } else {
        const errorMessage =
          response?.graphQLErrors?.[0]?.message ||
          response?.error?.message ||
          '인증 코드 검증에 실패했습니다.';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = '인증 코드 검증 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleResendCode = async () => {
    try {
      clearError();

      const response = await onResendCode({ email });

      if (response?.success) {
        resetTimer();
        toast.success(response.message || '인증 코드가 재전송되었습니다.');
      } else {
        const errorMessage =
          response?.graphQLErrors?.[0]?.message ||
          response?.error?.message ||
          '인증 코드 재전송에 실패했습니다.';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = '인증 코드 재전송 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  const resetTimer = () => {
    const newStartTime = Date.now();
    localStorage.setItem(storageKey, String(newStartTime));
    setTimeLeft(totalDurationMs);
    setTimerKey((prev) => prev + 1);
  };

  const handleTimeout = () => {
    toast.error('시간 초과되었습니다. 다시 요청하세요.');
    setTimeLeft(0);
    localStorage.removeItem(storageKey);
    onTimeout?.();
  };

  return (
    <div className={cn(className)}>
      <CardDescription className="text-center text-sm/7 text-gray-950 dark:text-white mb-4">
        6자리 인증코드가 전송되었습니다.{' '}
        <span className="font-semibold">{email}</span>
      </CardDescription>

      {timeLeft > 0 && (
        <SmartTimer
          timeLeft={timeLeft}
          urgentThreshold={urgentThresholdMs}
          criticalThreshold={criticalThresholdMs}
        />
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
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
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6">
          <fieldset
            disabled={form.formState.isSubmitting || timeLeft <= 0}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="activation_code"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup className="space-x-2">
                        {Array.from({ length: 6 }, (_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={`rounded-md border-l border-gray-500 ${
                              styles?.input || ''
                            }`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`mt-6 w-full ${styles?.primaryButton || ''}`}
              disabled={isLoading || timeLeft <= 0}
            >
              {isLoading
                ? '인증 중...'
                : timeLeft <= 0
                ? '시간이 만료되었습니다'
                : '인증 완료'}
            </Button>
          </fieldset>
        </form>
      </Form>

      <div className="mt-6 text-center">
        {timeLeft <= 0 ? (
          <CardDescription className="text-sm/7 text-gray-600 dark:text-gray-400 mt-1">
            제한 시간이 초과되었습니다!{' '}
            <Button
              type="button"
              onClick={handleResendCode}
              variant="ghost"
              className="font-semibold text-gray-950 underline decoration-gray-950/25 underline-offset-2 hover:decoration-gray-950/50 dark:text-white dark:decoration-white/25 dark:hover:decoration-white/50 m-0 p-0"
            >
              <span className="text-sm/6 font-semibold">새 코드 요청하기</span>
            </Button>
          </CardDescription>
        ) : (
          <CardDescription className="text-sm/7 text-gray-600 dark:text-gray-400">
            코드를 받지 못하셨나요?{' '}
            <Button
              type="button"
              onClick={handleResendCode}
              variant="ghost"
              disabled={isLoading}
              className="font-semibold text-gray-950 underline decoration-gray-950/25 underline-offset-2 hover:decoration-gray-950/50 dark:text-white dark:decoration-white/25 dark:hover:decoration-white/50 m-0 p-0"
            >
              <span className="text-sm/6 font-semibold">
                코드 다시 요청하기
              </span>
            </Button>
          </CardDescription>
        )}
      </div>
    </div>
  );
}
