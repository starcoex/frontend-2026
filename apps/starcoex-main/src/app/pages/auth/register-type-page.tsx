import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles } from 'lucide-react';
import { RegisterTypeForm, StarLogo } from '@starcoex-frontend/common';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function RegisterTypePage() {
  const navigate = useNavigate();

  const handleEmailRegister = () => {
    navigate('/auth/register/personal');
  };

  return (
    <>
      <Helmet>
        <title>스타코엑스 회원가입</title>
        <meta
          name="description"
          content="간편한 소셜 로그인으로 스타코엑스 통합 서비스를 이용하세요."
        />
      </Helmet>

      <div className="text-center mb-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-3 mb-4"
        >
          <StarLogo
            format="svg"
            width={20}
            height={20}
            className="w-12 h-12 object-contain"
          />
        </Link>
        <CardHeader className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          스타코엑스 회원가입
        </CardHeader>
        <CardDescription>
          소셜 로그인으로 3초만에 가입하고 모든 서비스를 이용하세요.
        </CardDescription>
      </div>

      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            간편 가입하기
          </CardTitle>
          <CardDescription>소셜 로그인으로 빠르게 시작하세요</CardDescription>
        </CardHeader>

        <RegisterTypeForm
          onEmailRegister={handleEmailRegister}
          loginPath="/auth/login"
          buttonClassName="w-full h-14 font-medium group transition-all relative"
        />
      </Card>
    </>
  );
}
