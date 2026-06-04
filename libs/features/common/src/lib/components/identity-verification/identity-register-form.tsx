import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@starcoex-frontend/auth';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui';
import { Loader2, UserCheck } from 'lucide-react';

const identityRegisterSchema = z
  .object({
    email: z.string().email('올바른 이메일을 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다.'),
    passwordConfirmation: z.string(),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: '이용약관에 동의해주세요.',
    }),
    marketingConsent: z.boolean().optional(),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirmation'],
  });

type IdentityRegisterFormValues = z.infer<typeof identityRegisterSchema>;

interface IdentityRegisterFormProps {
  identityVerificationId: string;
  onSuccess: () => void;
}

export function IdentityRegisterForm({
  identityVerificationId,
  onSuccess,
}: IdentityRegisterFormProps) {
  const { registerWithIdentityVerification, isLoading } = useAuth();

  const form = useForm<IdentityRegisterFormValues>({
    resolver: zodResolver(identityRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      termsAccepted: false,
      marketingConsent: false,
    },
  });

  const onSubmit = async (values: IdentityRegisterFormValues) => {
    const res = await registerWithIdentityVerification({
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
      termsAccepted: values.termsAccepted,
      // ✅ string union type이므로 리터럴 직접 사용
      userType: 'INDIVIDUAL',
      identityVerificationId,
      marketingConsent: values.marketingConsent
        ? {
            marketingConsent: true,
            marketingConsentDate: new Date().toISOString(),
            marketingConsentSource: 'web',
          }
        : undefined,
    });

    if (res.success) {
      toast.success('회원가입이 완료되었습니다!');
      onSuccess();
    } else {
      toast.error(res.error?.message ?? '회원가입에 실패했습니다.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-green-500" />
          추가 정보 입력
        </CardTitle>
        <CardDescription>
          본인인증이 완료되었습니다. 사용할 계정 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="이메일을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비밀번호 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="8자 이상, 영문+숫자 포함"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비밀번호 확인 */}
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이용약관 */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel className="cursor-pointer">
                      <span className="text-primary underline underline-offset-2">
                        이용약관
                      </span>
                      {' 및 '}
                      <span className="text-primary underline underline-offset-2">
                        개인정보처리방침
                      </span>
                      에 동의합니다 (필수)
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* 마케팅 동의 */}
            <FormField
              control={form.control}
              name="marketingConsent"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer leading-none">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                '가입 완료하기'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
