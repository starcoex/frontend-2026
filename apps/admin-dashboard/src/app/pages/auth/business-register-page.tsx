import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import validator from 'validator';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@starcoex-frontend/auth';
import { RegisterUserInput } from '@starcoex-frontend/graphql';
import { formatBusinessNumber } from '@/app/utils/business-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';

// ============================================================================
// 📝 스키마 정의
// ============================================================================

const businessRegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '유효한 이메일 주소를 입력해주세요.' }),
    phone_number: z
      .string({ message: '전화번호는 필수입니다.' })
      .trim()
      .transform((value) => '+82' + value.replace(/^0/, ''))
      .refine(
        (phone_number: string) =>
          validator.isMobilePhone(phone_number, 'ko-KR'),
        '전화번호 양식이 틀립니다.'
      ),
    account_type: z.enum(['personal', 'company']),
    tax_id: z
      .string()
      .max(10, '사업자 등록번호는 최대 10자리 숫자여야 합니다.')
      .regex(/^\d*$/, '사업자 등록번호는 숫자만 입력 가능합니다.')
      .optional(),
    company_name: z.string().optional(),
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()\-_=+\[\]{}<>|~`])[A-Za-z\d@$!%*?&^#()\-_=+\[\]{}<>|~`]{6,}$/,
        {
          message:
            '비밀번호는 최소 하나의 소문자, 대문자, 숫자 및 특수 문자를 포함해야 합니다.',
        }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요.' }),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, '약관에 동의해주세요'),
    agreePrivacy: z
      .boolean()
      .refine((val) => val === true, '개인정보 처리방침에 동의해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      // 사업자 계정인 경우 사업자 등록번호와 회사명 필수
      if (data.account_type === 'company') {
        return data.tax_id && data.tax_id.length === 10 && data.company_name;
      }
      return true;
    },
    {
      message: '사업자 계정인 경우 사업자 등록번호와 회사명이 필요합니다',
      path: ['tax_id'],
    }
  );

type BusinessRegisterFormData = z.infer<typeof businessRegisterSchema>;

export function BusinessRegisterPage() {
  const navigate = useNavigate();
  const { isLoading, register, error, clearError, validateBusinessNumber } =
    useAuth();

  // UI 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBusinessNumberValid, setIsBusinessNumberValid] = useState<
    boolean | null
  >(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<BusinessRegisterFormData>({
    resolver: zodResolver(businessRegisterSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      account_type: 'personal',
      tax_id: '',
      company_name: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const watchedAccountType = form.watch('account_type');
  const watchedTaxId = form.watch('tax_id');

  // ============================================================================
  // 🏛️ 사업자 등록번호 검증 (회원가입 시 자동 처리됨)
  // ============================================================================

  const handleBusinessNumberValidation = async () => {
    if (!watchedTaxId || watchedTaxId.length !== 10) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      // 1. 1차 형식 검증 (클라이언트)
      const isFormatValid = /^\d{10}$/.test(watchedTaxId);
      if (!isFormatValid) {
        setIsBusinessNumberValid(false);
        setValidationError('사업자 등록번호는 10자리 숫자여야 합니다.');
        setIsValidating(false);
        return;
      }
      // 2. 2차 진위 검증 (백엔드 API 호출) ✅
      const result = await validateBusinessNumber(watchedTaxId);

      // API 호출 결과 처리
      if (result.success && result.data?.validateBusinessNumber) {
        const { isValid, statusMessage } = result.data.validateBusinessNumber;

        if (isValid) {
          setIsBusinessNumberValid(true);
          setValidationError(null);
          // 필요하다면 statusMessage(예: "계속사업자")를 보여줄 수도 있음
          toast.success(statusMessage || '유효한 사업자 번호입니다.');
        } else {
          setIsBusinessNumberValid(false);
          setValidationError(
            statusMessage || '국세청에 등록되지 않은 번호입니다.'
          );
        }
      } else {
        // API 호출 실패 (서버 에러 등)
        setIsBusinessNumberValid(false);
        const apiErrorMsg =
          result.error?.message || '사업자 번호 조회에 실패했습니다.';
        setValidationError(apiErrorMsg);
      }
    } catch (error) {
      console.error('Business Validation Error:', error);
      setIsBusinessNumberValid(false);
      setValidationError('검증 중 예기치 않은 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  // ============================================================================
  // 📝 폼 제출 처리 (backend auth.service.ts의 register 메서드와 연동)
  // ============================================================================

  const handleSubmit = async (data: BusinessRegisterFormData) => {
    try {
      clearError();

      // 사업자의 경우 사업자 등록번호 검증 확인
      if (data.account_type === 'company' && !isBusinessNumberValid) {
        setValidationError('사업자 등록번호 검증이 필요합니다.');
        // 검증하지 않았으면 자동으로 검증 시도 가능하도록 유도
        // handleBusinessNumberValidation();
        return;
      }

      // RegisterUserInput 형식으로 데이터 변환
      const registerData: RegisterUserInput = {
        email: data.email,
        password: data.password,
        passwordConfirmation: data.confirmPassword,
        name: data.email.split('@')[0], // 임시로 이메일 앞부분을 이름으로 사용
        phoneNumber: data.phone_number,
        userType: data.account_type === 'company' ? 'BUSINESS' : 'INDIVIDUAL',
        role: 'USER' as const,
        termsAccepted: data.agreeTerms,
        marketingConsent: {
          marketingConsent: data.agreePrivacy, // 개인정보 동의를 마케팅 동의로 매핑
        },
        // 사업자 정보가 있는 경우에만 business 객체 추가
        ...(data.account_type === 'company' &&
          data.tax_id &&
          data.company_name && {
            business: {
              businessNumber: formatBusinessNumber(data.tax_id),
            },
          }),
      };

      const response = await register(registerData);

      if (response?.success) {
        toast.success(response.message || '회원가입이 완료되었습니다.');

        if (response.data?.registerUser.verificationMessage) {
          setTimeout(() => {
            toast.info(response.data?.registerUser.verificationMessage);
          }, 1000);
        }

        setTimeout(() => {
          navigate('/auth/verify-email', {
            state: {
              email: data.email,
              userType:
                data.account_type === 'company' ? 'business' : 'individual',
              businessName: data.company_name,
            },
          });
        }, 2000);
      } else {
        // 에러 메시지 우선순위: GraphQL > API Response > 기본 메시지
        const errorMessage =
          response?.graphQLErrors?.[0]?.message ||
          response?.error?.message ||
          '회원가입 중 오류가 발생했습니다.';

        // 특정 에러 메시지에 따른 처리
        if (errorMessage.includes('이미 진행 중인 회원가입')) {
          toast.error(errorMessage, {
            duration: 5000,
            action: {
              label: '이메일 검증',
              onClick: () => {
                navigate('/auth/verify-email', {
                  state: {
                    email: data.email,
                    userType:
                      data.account_type === 'company'
                        ? 'business'
                        : 'individual',
                    businessName: data.company_name,
                  },
                });
              },
            },
          });
        } else {
          // 일반 에러 처리
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 계정 타입 변경 시 처리
  const handleAccountTypeChange = (value: 'personal' | 'company') => {
    form.setValue('account_type', value);
    setIsBusinessNumberValid(null);
    setValidationError(null);

    if (value === 'personal') {
      form.setValue('tax_id', '');
      form.setValue('company_name', '');
    }
  };

  // ============================================================================
  // 🎨 UI 렌더링
  // ============================================================================

  return (
    <>
      <Helmet>
        <title>회원가입 - Starcoex</title>
        <meta name="description" content="Starcoex 회원가입 페이지" />
      </Helmet>

      {/* 에러 표시 */}
      {error && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
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
        </div>
      )}

      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>새로운 Starcoex 계정을 생성하세요</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* 이메일 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@starcoex.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 전화번호 */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="010-1234-5678"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 계정 유형 */}
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>계정 유형</FormLabel>
                    <Select
                      onValueChange={handleAccountTypeChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="계정 유형을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">개인</SelectItem>
                        <SelectItem value="company">사업자</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 사업자 정보 (사업자 계정인 경우만) */}
              {watchedAccountType === 'company' && (
                <>
                  {/* 사업자 등록번호 */}
                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사업자 등록번호</FormLabel>
                        <FormDescription className="text-xs">
                          국세청에 등록된 사업자 등록정보와 일치해야 합니다.
                        </FormDescription>
                        <FormControl>
                          <div className="w-full flex justify-center">
                            <InputOTP
                              maxLength={10}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              {...field}
                              onChange={(value) => {
                                field.onChange(value);
                                setIsBusinessNumberValid(null);
                                setValidationError(null);
                              }}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={0}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={1}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={2}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={3}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={4}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={5}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={6}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={7}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={8}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                                <InputOTPSlot
                                  index={9}
                                  className="w-6 h-8 text-xs sm:text-base md:w-8 md:h-10 lg:w-6 lg:h-8"
                                />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>

                        {/* 검증 버튼 및 상태 */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleBusinessNumberValidation}
                            disabled={
                              !watchedTaxId ||
                              watchedTaxId.length !== 10 ||
                              isValidating
                            }
                          >
                            {isValidating ? '검증 중...' : '사업자번호 검증'}
                          </Button>

                          {isBusinessNumberValid === true && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} />
                              <span className="text-sm">검증 완료</span>
                            </div>
                          )}

                          {isBusinessNumberValid === false && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle size={16} />
                              <span className="text-sm">검증 실패</span>
                            </div>
                          )}
                        </div>

                        {validationError && (
                          <p className="text-sm text-red-600 mt-1">
                            {validationError}
                          </p>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 회사명 */}
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>회사명</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="회사명을 입력하세요"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* 비밀번호 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="비밀번호를 입력하세요"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 확인 */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="비밀번호를 다시 입력하세요"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 약관 동의 */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel
                            htmlFor="agreeTerms"
                            className="text-sm leading-relaxed"
                          >
                            <Link
                              to="#"
                              className="text-primary underline hover:text-primary/80"
                            >
                              이용약관
                            </Link>
                            에 동의합니다 (필수)
                          </FormLabel>
                        </div>
                      </div>
                      <FormMessage className="!mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreePrivacy"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel
                            htmlFor="agreePrivacy"
                            className="text-sm leading-relaxed"
                          >
                            <Link
                              to="#"
                              className="text-primary underline hover:text-primary/80"
                            >
                              개인정보 처리방침
                            </Link>
                            에 동의합니다 (필수)
                          </FormLabel>
                        </div>
                      </div>
                      <FormMessage className="!mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* 제출 버튼 */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
