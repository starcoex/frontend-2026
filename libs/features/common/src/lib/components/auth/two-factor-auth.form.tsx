import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Mail, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { IconLockPassword } from '@tabler/icons-react';
import { Disable2FaDuringLoginInput } from '@starcoex-frontend/graphql';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  SmartTimer,
  Input,
} from '../ui';

// ===== 타입 정의 =====
const twoFactorSchema = z.object({
  code: z.string().length(6, '6자리 코드를 입력해주세요'),
});

const passwordConfirmSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
type PasswordConfirmData = z.infer<typeof passwordConfirmSchema>;
type AuthMethod = 'app' | 'emergency' | 'password';

interface TwoFactorAuthFormProps {
  // 필수 props
  isLoading: boolean;
  onSubmit: (data: TwoFactorFormData) => Promise<void>;
  onCancel: () => void;

  // 선택적 props - 긴급 인증용
  onRequestEmergencyCode?: (tempToken: string) => Promise<void>;
  onDisable2FA?: (input: Disable2FaDuringLoginInput) => Promise<void>;
  tempToken?: string;
  userEmail?: string;
  isSocialLogin?: boolean;
  hasPassword?: boolean;
}

// ===== 상수 =====
const EMERGENCY_CODE_DURATION = 10 * 60 * 1000; // 10분
const STORAGE_KEY = 'emergencyCodeStartTime';

// ===== 메인 컴포넌트 =====
export function TwoFactorAuthForm({
  isLoading,
  onSubmit,
  onCancel,
  onRequestEmergencyCode,
  onDisable2FA,
  tempToken,
  userEmail,
  isSocialLogin = false,
  hasPassword = false,
}: TwoFactorAuthFormProps) {
  // ===== 상태 관리 =====
  const [authMethod, setAuthMethod] = useState<AuthMethod>('app');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerKey, setTimerKey] = useState(0);
  const [emergencyCodeSent, setEmergencyCodeSent] = useState(false);

  // ===== 폼 설정 =====
  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: '' },
  });

  const passwordForm = useForm<PasswordConfirmData>({
    resolver: zodResolver(passwordConfirmSchema),
    defaultValues: { password: '' },
  });

  // ===== 계산된 값 =====
  const isEmergencyAvailable = Boolean(
    onRequestEmergencyCode && onDisable2FA && tempToken
  );
  const isTimerActive = authMethod === 'emergency' && emergencyCodeSent;

  const emergencyOptions = {
    showPasswordOption: !isSocialLogin || hasPassword,
    showEmailOption: true,
  };

  // ===== 타이머 관리 (verify-email 패턴) =====
  useEffect(() => {
    if (!isTimerActive) {
      setTimeLeft(0);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const storedStartTime = localStorage.getItem(STORAGE_KEY);

    // 기존 시간 유효성 검사
    if (storedStartTime) {
      const savedTime = parseInt(storedStartTime, 10);
      const elapsedTime = Date.now() - savedTime;

      // 24시간 초과시 초기화
      if (elapsedTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
      }
      // 10분 초과시 새로 시작
      else if (elapsedTime > EMERGENCY_CODE_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 시작 시간 설정
    const startTime = storedStartTime
      ? parseInt(storedStartTime, 10)
      : Date.now();
    const elapsedTime = Date.now() - startTime;
    const initialTimeLeft = EMERGENCY_CODE_DURATION - elapsedTime;

    if (initialTimeLeft <= 0) {
      // 새로운 타이머 시작
      const newStartTime = Date.now();
      localStorage.setItem(STORAGE_KEY, String(newStartTime));
      setTimeLeft(EMERGENCY_CODE_DURATION);
    } else {
      setTimeLeft(initialTimeLeft);
    }

    // 시작 시간 저장
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, String(startTime));
    }

    // 인터벌 설정
    const interval = setInterval(() => {
      const currentStartTime = parseInt(
        localStorage.getItem(STORAGE_KEY) || String(Date.now()),
        10
      );
      const elapsed = Date.now() - currentStartTime;
      const remainingTime = EMERGENCY_CODE_DURATION - elapsed;

      if (remainingTime <= 0) {
        handleTimeout();
        clearInterval(interval);
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authMethod, emergencyCodeSent, timerKey]);

  // ===== 이벤트 핸들러 =====
  const handleTimeout = () => {
    toast.error('긴급 인증 코드가 만료되었습니다. 다시 요청하세요.');
    setTimeLeft(0);
    setEmergencyCodeSent(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetTimer = () => {
    const newStartTime = Date.now();
    localStorage.setItem(STORAGE_KEY, String(newStartTime));
    setTimeLeft(EMERGENCY_CODE_DURATION);
    setTimerKey((prev) => prev + 1);
  };

  const handlePasswordConfirm = async (data: PasswordConfirmData) => {
    try {
      // 비밀번호를 폼에 저장 (나중에 사용)
      passwordForm.setValue('password', data.password);
      await handleRequestEmergencyCode();
    } catch (error) {
      toast.error('긴급 인증 코드 요청에 실패했습니다.');
    }
  };

  const handleRequestEmergencyCode = async () => {
    if (!onRequestEmergencyCode || !tempToken) {
      toast.error('긴급 인증 코드를 요청할 수 없습니다.');
      return;
    }

    try {
      await onRequestEmergencyCode(tempToken);
      setAuthMethod('emergency');
      setEmergencyCodeSent(true);
      resetTimer();
      form.reset();
      toast.success('긴급 인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      toast.error('긴급 인증 코드 요청에 실패했습니다.');
    }
  };

  const handleEmergencyCodeSubmit = async (data: TwoFactorFormData) => {
    if (!onDisable2FA || !tempToken) {
      toast.error('2FA 비활성화 기능을 사용할 수 없습니다.');
      return;
    }

    try {
      const input: Disable2FaDuringLoginInput = {
        tempToken,
        emailVerificationCode: data.code,
        ...(isSocialLogin && !passwordForm.getValues('password')
          ? { useEmergencyEmail: true }
          : { password: passwordForm.getValues('password') }),
      };

      await onDisable2FA(input);
      localStorage.removeItem(STORAGE_KEY);
      toast.success('2FA가 비활성화되고 로그인되었습니다.');
    } catch (error) {
      toast.error(
        '긴급 인증 코드가 올바르지 않거나 비밀번호가 일치하지 않습니다.'
      );
    }
  };

  const handleSubmit = async (data: TwoFactorFormData) => {
    if (authMethod === 'emergency') {
      await handleEmergencyCodeSubmit(data);
    } else {
      await onSubmit(data);
    }
  };

  const handleBackToApp = () => {
    setAuthMethod('app');
    setEmergencyCodeSent(false);
    setTimeLeft(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleEmergencyMethodSelection = () => {
    if (isSocialLogin && !hasPassword) {
      handleRequestEmergencyCode();
    } else {
      setAuthMethod('password');
    }
  };

  // ===== 렌더링 함수 =====
  const renderPasswordConfirmScreen = () => (
    <div className="space-y-4 mb-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            비밀번호 확인
          </CardTitle>
          <p className="text-sm text-blue-700">
            긴급 인증을 위해 현재 비밀번호를 입력해주세요
          </p>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordConfirm)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>현재 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="현재 비밀번호를 입력하세요"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? '확인 중...' : '✅ 비밀번호 확인'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAuthMethod('app')}
                  disabled={isLoading}
                >
                  취소
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmergencyOptions = () => {
    if (authMethod !== 'app') return null;

    return (
      <div className="mt-6 text-center">
        <p className="text-sm leading-7 mb-3">인증 앱을 찾을 수 없나요?</p>
        <div className="space-y-2">
          {emergencyOptions.showPasswordOption && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEmergencyMethodSelection}
              className="w-full"
              disabled={isLoading}
            >
              <IconLockPassword className="h-4 w-4 mr-2" />
              {hasPassword
                ? '비밀번호로 인증하기'
                : '이메일로 긴급 인증 코드 받기'}
            </Button>
          )}
          {emergencyOptions.showEmailOption && hasPassword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRequestEmergencyCode}
              className="w-full"
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              이메일로 바로 긴급 코드 받기
            </Button>
          )}
        </div>
        {isSocialLogin && hasPassword && (
          <p className="text-xsleading-7 mt-2">
            설정하신 비밀번호 또는 이메일 인증을 선택하세요
          </p>
        )}
      </div>
    );
  };

  const renderEmergencyActions = () => {
    if (authMethod !== 'emergency') return null;

    return (
      <div className="mt-6 text-center">
        {timeLeft <= 0 ? (
          <div>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>제한 시간이 초과되었습니다!</AlertDescription>
            </Alert>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRequestEmergencyCode}
              className=""
              disabled={isLoading}
            >
              새 긴급 코드 요청하기
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm leading-7 mb-2">코드를 받지 못하셨나요?</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRequestEmergencyCode}
              className=""
              disabled={isLoading}
            >
              긴급 코드 다시 요청하기
            </Button>
          </div>
        )}
        <div className="mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBackToApp}
            className=""
            disabled={isLoading}
          >
            인증 앱으로 돌아가기
          </Button>
        </div>
      </div>
    );
  };

  // ===== 메인 렌더링 =====
  // 비밀번호 확인 화면
  if (authMethod === 'password') {
    return renderPasswordConfirmScreen();
  }

  // 메인 2FA 화면
  return (
    <div className="space-y-4 mb-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            {authMethod === 'app' ? (
              <Shield className="h-5 w-5" />
            ) : (
              <Mail className="h-5 w-5" />
            )}
            {authMethod === 'app' ? '2단계 인증' : '긴급 인증'}
          </CardTitle>
          <p className="text-sm leading-7">
            {authMethod === 'app'
              ? '등록하신 인증 앱에서 생성된 6자리 코드를 입력해주세요'
              : `이메일로 전송된 6자리 긴급 인증 코드를 입력해주세요 ${
                  userEmail || ''
                }`}
          </p>
        </CardHeader>

        <CardContent>
          {/* 타이머 */}
          {isTimerActive && timeLeft > 0 && (
            <SmartTimer
              timeLeft={timeLeft}
              urgentThreshold={300000} // 5분
              criticalThreshold={60000} // 1분
            />
          )}

          {/* 메인 폼 */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <fieldset
                disabled={
                  isLoading || (authMethod === 'emergency' && timeLeft <= 0)
                }
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel>
                        {authMethod === 'app' ? '인증 코드' : '긴급 인증 코드'}
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          {...field}
                        >
                          <InputOTPGroup className="space-x-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="rounded-md border-l"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs leading-7 [&:not(:first-child)]:mt-6 text-center">
                        {authMethod === 'app'
                          ? '6자리 코드를 모두 입력하면 자동으로 인증됩니다'
                          : '긴급 코드로 인증하면 2FA가 비활성화됩니다'}
                      </p>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    form.watch('code').length !== 6 ||
                    (authMethod === 'emergency' && timeLeft <= 0)
                  }
                >
                  {isLoading
                    ? '인증 중...'
                    : authMethod === 'emergency' && timeLeft <= 0
                    ? '시간이 만료되었습니다'
                    : authMethod === 'app'
                    ? '✅ 인증 완료'
                    : '🔓 긴급 인증 & 2FA 비활성화'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full"
                >
                  취소
                </Button>
              </fieldset>
            </form>
          </Form>

          {/* 하단 옵션 */}
          {isEmergencyAvailable && (
            <>
              {renderEmergencyOptions()}
              {renderEmergencyActions()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
