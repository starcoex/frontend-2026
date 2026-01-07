// libs/features/common/src/pages/verify-phone.page.tsx
import React, { useState } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { Phone, Shield, CheckCircle } from 'lucide-react';
import * as PortOne from '@portone/browser-sdk/v2';
import { useNavigate } from 'react-router-dom';
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';
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

export const VerifyPhonePage: React.FC = () => {
  const {
    currentUser,
    requestIdentityVerification,
    verifyIdentityVerification,
    checkAuthStatus,
  } = useAuth();
  const navigate = useNavigate();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleIdentityVerification = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const storeId = import.meta.env.VITE_PORTONE_STORE_ID;
      const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY;

      const initResponse = await requestIdentityVerification({
        storeId,
        channelKey,
      });

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.error?.message || '인증 요청 초기화 실패');
      }

      const { identityVerificationId } =
        initResponse.data.requestIdentityVerification;

      if (!identityVerificationId) {
        throw new Error('인증 ID를 발급받지 못했습니다.');
      }

      const sdkResponse = await PortOne.requestIdentityVerification({
        storeId,
        identityVerificationId,
        channelKey,
        customer: {
          fullName: currentUser?.name || '',
          phoneNumber: currentUser?.phoneNumber?.replace(/-/g, '') || '',
        },
        bypass: {
          danal: {
            IsCarrier: 'SKT;KT;LGT;KT_MVNO;LGU_MVNO',
            AGELIMIT: 14,
          },
        },
        redirectUrl: window.location.href,
      });

      if (sdkResponse?.code != null) {
        setMessage({
          type: 'error',
          text: sdkResponse?.message || '본인인증이 취소되었습니다.',
        });
      } else {
        const verifyResponse = await verifyIdentityVerification({
          identityVerificationId,
        });

        if (verifyResponse.success) {
          setMessage({
            type: 'success',
            text: '본인인증이 성공적으로 완료되었습니다.',
          });

          await checkAuthStatus();

          setTimeout(() => {
            navigate(routes.dashboard);
          }, 2000);
        } else {
          setMessage({
            type: 'error',
            text:
              verifyResponse.error?.message ||
              '인증 정보를 확인하지 못했습니다.',
          });
        }
      }
    } catch (error: unknown) {
      console.error('Identity Verification Error:', error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : '본인인증 중 문제가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Wrapper = PageWrapper || React.Fragment;

  const content = (
    <>
      <PageHead
        title={getSeoTitle('휴대폰 인증')}
        description="안전한 서비스 이용을 위해 본인인증을 진행해주세요."
        siteName={siteName}
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            휴대폰 본인인증
          </CardTitle>
          <CardDescription>
            안전한 서비스 이용을 위해 본인인증을 진행해주세요.
          </CardDescription>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${
              message.type === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <AlertDescription
              className={
                message.type === 'error' ? 'text-red-800' : 'text-green-800'
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card className={styles?.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              간편 본인인증
            </CardTitle>
            <CardDescription>
              통신사 패스(PASS) 또는 문자를 통해 본인임을 인증합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
              <CardDescription>
                • 타인 명의의 휴대폰으로는 인증이 불가능합니다.
              </CardDescription>
              <CardDescription className="mt-1">
                • 법인 휴대폰은 법인 명의로 인증이 가능합니다.
              </CardDescription>
            </div>

            <Button
              onClick={handleIdentityVerification}
              disabled={isLoading}
              className={`w-full h-12 text-lg ${styles?.primaryButton || ''}`}
            >
              {isLoading ? (
                '인증 진행 중...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  본인인증 시작하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
};
