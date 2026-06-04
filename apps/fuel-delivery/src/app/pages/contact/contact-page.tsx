import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Clock, MapPin } from 'lucide-react';

const INQUIRY_TYPES = [
  { value: 'order', label: '주문 문의' },
  { value: 'tracking', label: '배송 추적 문의' },
  { value: 'quantity', label: '정량 관련 문의' },
  { value: 'small', label: '소량 배달 문의' },
  { value: 'group', label: '공동구매 문의' },
  { value: 'heater', label: '난로·돈풍기 임대 문의' },
  { value: 'other', label: '기타 문의' },
];

const CONTACT_INFO = [
  {
    icon: Phone,
    label: '배달 문의전화',
    value: '702-5144',
    sub: '전화 주문도 가능합니다',
  },
  {
    icon: Clock,
    label: '운영 시간',
    value: '평일 09:00 – 18:00',
    sub: '당일 배송 마감: 오후 2시',
  },
  {
    icon: MapPin,
    label: '서비스 지역',
    value: '서울 · 경기 일부 지역',
    sub: '지역 확대 순차 진행 중',
  },
];

export const ContactPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 문의 제출 API 연동
  };

  return (
    <section id="contact" className="bg-background relative px-6 lg:px-0">
      {/* 배경 그라디언트 */}
      <div className="bg-accent pointer-events-none absolute inset-x-0 top-0 z-0 container h-[600px]" />

      <div className="relative z-10 container px-0">
        {/* 섹션 헤더 */}
        <div className="pt-20 text-center sm:pt-24 md:pt-28">
          <p className="text-muted-foreground text-sm sm:text-base mb-3">
            고객센터
          </p>
          <h2 className="text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
            무엇이든 물어보세요
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm sm:text-base">
            주문, 배송 추적, 정량 관련 문의 등 궁금하신 점을 남겨주시면 빠르게
            답변 드리겠습니다.
          </p>
        </div>

        {/* 연락처 정보 3개 */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 mx-auto max-w-3xl">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-card border-border rounded-[12px] border p-5 flex flex-col gap-2 shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className="text-foreground font-medium text-sm mt-0.5">
                    {item.value}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 문의 폼 */}
        <div className="relative z-10 mt-8 sm:mt-10">
          <div className="bg-card border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] mx-auto max-w-3xl rounded-[12px] border p-6 sm:p-8 md:p-10">
            <h3 className="text-foreground mb-6 text-center text-2xl font-medium">
              문의하기
            </h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* 이름 + 연락처 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-muted-foreground mb-2 block text-sm"
                  >
                    이름
                  </label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    className="h-11 rounded-[8px]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-muted-foreground mb-2 block text-sm"
                  >
                    연락처
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    className="h-11 rounded-[8px]"
                    required
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label
                  htmlFor="email"
                  className="text-muted-foreground mb-2 block text-sm"
                >
                  이메일
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="h-11 rounded-[8px]"
                />
              </div>

              {/* 문의 유형 */}
              <div>
                <label
                  htmlFor="inquiryType"
                  className="text-muted-foreground mb-2 block text-sm"
                >
                  문의 유형
                </label>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={[
                        'rounded-[8px] border px-3 py-1.5 text-sm transition-colors',
                        selectedType === type.value
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground',
                      ].join(' ')}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 메시지 */}
              <div>
                <label
                  htmlFor="message"
                  className="text-muted-foreground mb-2 block text-sm"
                >
                  문의 내용
                </label>
                <Textarea
                  id="message"
                  placeholder="문의 내용을 입력해 주세요..."
                  className="min-h-[150px] resize-y rounded-[8px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-foreground text-background hover:bg-foreground/90 mt-2 h-12 w-full rounded-[8px]"
              >
                문의 보내기
              </Button>
            </form>
          </div>
        </div>

        <div className="h-10 sm:h-12 md:h-14" />
      </div>
    </section>
  );
};
