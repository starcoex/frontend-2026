import { Facebook, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const contactInfo = [
  {
    label: '일반 문의',
    value: 'contact@starcoex.com',
    href: 'mailto:contact@starcoex.com',
  },
  {
    label: '고객 지원',
    value: 'support@starcoex.com',
    href: 'mailto:support@starcoex.com',
  },
  {
    label: '전화번호',
    value: '+82 2 1234 5678',
    href: 'tel:+82212345678',
  },
  {
    label: '주소',
    value: 'STARCOEX 본사, 서울특별시 강남구 테헤란로 123, 12345',
    href: 'https://maps.google.com?q=STARCOEX+본사,+서울특별시+강남구+테헤란로+123',
  },
];

export default function GasStationContactHero() {
  return (
    <section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
      <div className="container px-0">
        <div className="border-b-dark-gray border-r-dark-gray border-l-dark-gray grid grid-cols-1 border-r border-b border-l lg:grid-cols-2">
          <div className="lg:border-r-dark-gray border-b-dark-gray items-center border-b px-6 py-8 lg:border-r lg:border-b-0 lg:px-16 lg:py-16">
            <h2 className="text-foreground mb-2.5 text-3xl font-medium tracking-tight lg:text-4xl">
              연락하기
            </h2>
            <p className="text-muted-foreground leading-relaxed lg:text-lg">
              궁금한 점이 있거나 피드백, 지원이 필요하시면 언제든 연락주세요.
              아래 양식을 작성하시거나 나열된 연락 방법을 이용해 주시기
              바랍니다.
            </p>
          </div>

          <div className="bg-jet">
            <div className="px-6 py-8 lg:px-16 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div>
                  <div className="flex flex-col gap-10">
                    {contactInfo.map((item, index) => (
                      <div key={index}>
                        <p className="text-foreground font-semibold">
                          {item.label}
                        </p>
                        <Link
                          to={item.href}
                          className="text-muted-foreground mt-2.5 text-sm font-medium tracking-tight hover:text-foreground transition-colors"
                        >
                          {item.value}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 lg:mt-0">
                  <div className="flex lg:w-full lg:items-end lg:justify-end">
                    <p className="text-foreground mb-2.5 font-semibold lg:text-right">
                      소셜 미디어
                    </p>
                  </div>
                  <div className="flex w-full items-end gap-2 lg:justify-end">
                    <Link
                      to="#"
                      className="hover:text-muted-foreground text-foreground transition-colors"
                    >
                      <Facebook className="size-4" />
                    </Link>
                    <Link
                      to="#"
                      className="hover:text-muted-foreground text-foreground transition-colors"
                    >
                      <Twitter className="size-4" />
                    </Link>
                    <Link
                      to="#"
                      className="hover:text-muted-foreground text-foreground transition-colors"
                    >
                      <Linkedin className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
