import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight, LucideIcon } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useContacts } from '@starcoex-frontend/contact'; // ★ 추가
import { ContactCategory } from '@starcoex-frontend/contact'; // ★ 추가

// ─── 연락처 방법 데이터 ───────────────────────────────────────────────────────

const contactMethods = [
  {
    icon: Mail,
    title: '이메일',
    description:
      '궁금한 점이나 도움이 필요하신가요? 이메일을 보내주시면 24시간 이내에 답변드립니다.',
    contact: COMPANY_INFO.email,
    href: `mailto:${COMPANY_INFO.email}`,
  },
  {
    icon: Phone,
    title: '전화',
    description: `평일 ${COMPANY_INFO.hours}, 토요일 09:00~13:00에 전화 상담이 가능합니다.`,
    contact: COMPANY_INFO.phone,
    href: `tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`,
  },
  {
    icon: MapPin,
    title: '오시는 길',
    description: COMPANY_INFO.address,
    contact: '지도에서 보기',
    href: `https://map.naver.com/p/search/${encodeURIComponent(
      COMPANY_INFO.address
    )}`,
    isExternal: true,
  },
];

// ─── 폼 필드 데이터 ───────────────────────────────────────────────────────────

const formFields = [
  {
    id: 'name',
    label: '이름',
    type: 'text' as const,
    placeholder: '홍길동',
    required: true,
    isTextarea: false,
  },
  {
    id: 'email',
    label: '이메일',
    type: 'email' as const,
    placeholder: 'example@starcoex.com',
    required: true,
    isTextarea: false,
  },
  {
    id: 'phone',
    label: '연락처 (선택)',
    type: 'tel' as const,
    placeholder: '010-1234-5678',
    required: false,
    isTextarea: false,
  },
  {
    id: 'message',
    label: '문의 내용',
    type: 'text' as const,
    placeholder: '문의하실 내용을 자유롭게 작성해 주세요.',
    required: true,
    isTextarea: true,
  },
];

// ─── 연락처 방법 카드 ─────────────────────────────────────────────────────────

interface ContactMethodProps {
  icon: LucideIcon;
  title: string;
  description: string;
  contact: string;
  href: string;
  isExternal?: boolean;
}

function ContactMethod({
  icon: Icon,
  title,
  description,
  contact,
  href,
  isExternal,
}: ContactMethodProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="size-5" />
        <h3 className="text-2xl tracking-[-0.96px]">{title}</h3>
      </div>
      <div className="space-y-2 tracking-[-0.32px]">
        <p className="text-muted-foreground text-sm">{description}</p>
        <Link
          to={href}
          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
          className="text-foreground inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {contact}
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function ContactPage() {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitContact } = useContacts(); // ★ 추가

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('이용약관에 동의해 주세요.');
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    setIsSubmitting(true);

    try {
      // ★ TODO → 실제 API 연동
      const res = await submitContact({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || undefined,
        message: formData.get('message') as string,
        category: ContactCategory.GENERAL,
        agreedToTerms: agreed,
        sourceApp: 'www.starcoex.com',
      });

      if (res.success && res.data?.success) {
        toast.success(
          '문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.'
        );
        (e.target as HTMLFormElement).reset();
        setAgreed(false);
      } else {
        toast.error(res.data?.message ?? '문의 접수 중 오류가 발생했습니다.');
      }
    } catch {
      toast.error(
        '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title={`고객센터 - ${COMPANY_INFO.name}`}
        description={`${COMPANY_INFO.name} 고객센터입니다. 궁금한 점이나 도움이 필요하시면 언제든지 문의해 주세요.`}
      />

      <section className="py-14 md:py-20 lg:py-24">
        {/* 섹션 헤더 */}
        <div className="container flex flex-col gap-6 lg:py-8">
          <Badge
            variant="outline"
            className="bg-card w-fit gap-1 px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Mail className="size-4" />
            <span>문의하기</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            무엇이든 물어보세요
          </h2>
          <p className="text-muted-foreground max-w-[600px] tracking-[-0.32px]">
            스타코엑스 서비스에 대한 궁금한 점이 있으시면 언제든지 연락주세요.
            최대한 빠르게 도움을 드리겠습니다.
          </p>
        </div>

        {/* 폼 + 연락처 */}
        <div className="container flex justify-between gap-10 py-12 max-md:flex-col">
          {/* 문의 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-sm font-normal" htmlFor={field.id}>
                  {field.label}
                </Label>
                {field.isTextarea ? (
                  <Textarea
                    id={field.id}
                    required={field.required}
                    placeholder={field.placeholder}
                    rows={4}
                    className="border-border bg-card"
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="border-border bg-card"
                  />
                )}
              </div>
            ))}

            {/* 약관 동의 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                required
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Link to="/terms" className="underline hover:text-primary">
                    이용약관
                  </Link>
                  {' 및 '}
                  <Link to="/privacy" className="underline hover:text-primary">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </Label>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting || !agreed}>
              {isSubmitting ? '전송 중...' : '문의 보내기'}
            </Button>
          </form>

          {/* 연락처 방법 */}
          <div className="grid flex-1 gap-6 self-start lg:grid-cols-2">
            {contactMethods.map((method, index) => (
              <ContactMethod key={index} {...method} />
            ))}

            {/* 운영 시간 안내 */}
            <div className="space-y-2 lg:col-span-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold tracking-[-0.48px]">
                  운영 시간
                </h3>
              </div>
              <div className="text-muted-foreground text-sm space-y-1">
                <p>평일: {COMPANY_INFO.hours}</p>
                <p>토요일: 09:00 - 13:00</p>
                <p>일요일 · 공휴일: 휴무</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
