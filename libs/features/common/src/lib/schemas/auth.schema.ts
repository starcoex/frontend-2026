import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '유효한 이메일 주소를 입력해주세요.' }),
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
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
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
