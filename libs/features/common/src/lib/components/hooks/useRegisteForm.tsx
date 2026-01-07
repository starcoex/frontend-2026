import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@starcoex-frontend/auth';
import { RegisterFormData, registerSchema } from '../../schemas';

export interface UseRegisterFormOptions {
  redirectTo?: string;
  verifyEmailPath?: string;
}

export function useRegisterForm(options: UseRegisterFormOptions = {}) {
  const {
    redirectTo = '/auth/register',
    verifyEmailPath = '/auth/verify-email',
  } = options;

  const navigate = useNavigate();
  const { isLoading, register, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();

      const response = await register({
        email: data.email,
        password: data.password,
        termsAccepted: data.agreeTerms,
      });

      if (response?.success) {
        toast.success(response.message || '회원가입이 완료되었습니다.');

        if (response.data?.registerUser.verificationMessage) {
          setTimeout(() => {
            toast.info(response.data?.registerUser.verificationMessage);
          }, 1000);
        }

        setTimeout(() => {
          navigate(verifyEmailPath, {
            state: { email: data.email },
          });
        }, 2000);
      } else {
        const errorMessage =
          response?.graphQLErrors?.[0]?.message ||
          response?.error?.message ||
          '회원가입 중 오류가 발생했습니다.';

        if (errorMessage.includes('이미 진행 중인 회원가입')) {
          toast.error(errorMessage, {
            duration: 5000,
            action: {
              label: '이메일 검증',
              onClick: () => {
                navigate(verifyEmailPath, {
                  state: { email: data.email },
                });
              },
            },
          });
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: unknown) {
      toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBackToRegister = () => {
    navigate(redirectTo);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  return {
    form,
    isLoading,
    error,
    clearError,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    onSubmit: form.handleSubmit(onSubmit),
    handleBackToRegister,
  };
}
