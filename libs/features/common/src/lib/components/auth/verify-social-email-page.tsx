import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { CheckCircle, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';
import { StarLogo } from '../logo';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui';

export const VerifySocialEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifySocialEmail, isLoading } = useAuth();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'pending'
  >('loading');
  const [message, setMessage] = useState<string>('');

  const searchParams = new URLSearchParams(location.search);
  const provider = searchParams.get('provider');
  const isPending = searchParams.get('pending') === 'true';
  const email = searchParams.get('email');

  useEffect(() => {
    const handleSocialVerification = async () => {
      if (!provider) {
        setStatus('error');
        setMessage('소셜 제공자 정보가 없습니다.');
        return;
      }

      try {
        if (isPending) {
          setStatus('pending');
          setMessage('소셜 로그인이 완료되었지만, 이메일 인증이 필요합니다.');
        } else {
          setStatus('error');
          setMessage('인증 정보가 부족합니다. 다시 로그인해주세요.');
        }
      } catch (error) {
        console.error('소셜 인증 처리 실패:', error);
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : '소셜 인증 처리 중 오류가 발생했습니다.'
        );
      }
    };

    handleSocialVerification();
  }, [provider, isPending, verifySocialEmail, navigate]);

  const handleRetry = () => {
    navigate(routes.login, { replace: true });
  };

  const handleCompletePending = () => {
    navigate(routes.verifySocialCode, {
      state: {
        provider,
        email,
      },
      replace: true,
    });
  };

  const Wrapper = PageWrapper || React.Fragment;

  const content = (
    <>
      <PageHead
        title={getSeoTitle('소셜 로그인 인증')}
        description="소셜 로그인 인증을 진행합니다."
        siteName={siteName}
        robots="noindex, nofollow"
      />

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Link
            to={routes.home}
            className="inline-flex items-center justify-center gap-3 mb-4"
          >
            <StarLogo width={48} height={48} />
          </Link>
          <CardTitle className="text-xl font-semibold mb-2">
            {provider?.toUpperCase()} 로그인 처리
          </CardTitle>
        </div>

        <Card className={styles?.card}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {status === 'loading' && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  처리 중...
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  인증 완료
                </>
              )}
              {status === 'error' && (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  인증 실패
                </>
              )}
              {status === 'pending' && (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  이메일 인증 필요
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                {status === 'pending'
                  ? '이메일 인증이 처리되어야 회원가입이 완료됩니다.'
                  : message}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {status === 'success' && (
                <CardDescription className="text-center">
                  잠시 후 홈페이지로 이동합니다...
                </CardDescription>
              )}

              {status === 'pending' && (
                <Button
                  onClick={handleCompletePending}
                  className={`w-full ${styles?.primaryButton || ''}`}
                  disabled={isLoading}
                >
                  이메일 인증 완료하기
                </Button>
              )}

              {(status === 'error' || status === 'pending') && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  로그인 페이지로 돌아가기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
};
