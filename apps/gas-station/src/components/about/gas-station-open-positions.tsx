import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const openPositions = [
  {
    position: '주유원',
    description:
      '고객에게 친절하고 안전한 주유 서비스를 제공합니다. 차량 점검, 결제 처리, 시설 청소 등의 업무를 담당하며, 제주도의 아름다운 환경에서 함께 일할 동료를 찾고 있습니다.',
    requirements:
      '성실하고 책임감이 강한 분, 고객 서비스 마인드, 주유소 근무 경험 우대',
    schedule: '교대근무 (주간/야간), 주 5일 근무',
    phone: '064-123-4567',
    kakao: 'https://pf.kakao.com/stargas_recruit',
  },
  {
    position: '정비사',
    description:
      '자동차 정비 및 점검 업무를 담당합니다. 엔진오일 교환, 타이어 교체, 기본적인 차량 점검 서비스를 제공하며, 고객의 안전한 드라이빙을 지원합니다.',
    requirements:
      '자동차 정비 자격증 소지자, 관련 경력 1년 이상, 성실하고 꼼꼼한 성격',
    schedule: '오전 8시 ~ 오후 6시, 주 5일 근무',
    phone: '064-123-4567',
    kakao: 'https://pf.kakao.com/stargas_recruit',
  },
  {
    position: '편의점 직원',
    description:
      '주유소 내 편의점 운영 업무를 담당합니다. 상품 진열, 재고 관리, 고객 응대, 결제 처리 등의 업무를 수행하며, 밝고 친절한 서비스로 고객 만족을 실현합니다.',
    requirements:
      '밝고 친절한 성격, 편의점 근무 경험 우대, 컴퓨터 기초 활용 가능',
    schedule: '교대근무 가능, 주 5일 근무, 시간 협의 가능',
    phone: '064-123-4567',
    kakao: 'https://pf.kakao.com/stargas_recruit',
  },
  {
    position: '야간 관리자',
    description:
      '야간 시간대 주유소 전반적인 관리 업무를 담당합니다. 시설 보안, 야간 주유 서비스, 응급 상황 대응 등의 책임감 있는 업무를 수행합니다.',
    requirements:
      '야간 근무 가능, 책임감 강한 분, 주유소 관리 경력 우대, 위급상황 대처 능력',
    schedule: '오후 10시 ~ 오전 6시, 주 5일 근무',
    phone: '064-123-4567',
    kakao: 'https://pf.kakao.com/stargas_recruit',
  },
];

const ContactButton = ({
  phone,
  kakao,
  type,
}: {
  phone: string;
  kakao: string;
  type: 'phone' | 'kakao';
}) => {
  const handleContact = () => {
    if (type === 'phone') {
      window.location.href = `tel:${phone}`;
    } else {
      window.open(kakao, '_blank');
    }
  };

  return (
    <button
      onClick={handleContact}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        type === 'phone'
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
      }`}
    >
      {type === 'phone' ? '📞 전화 문의' : '💬 카톡 문의'}
    </button>
  );
};

export default function GasStationOpenPositions() {
  return (
    <section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
      <div className="border-l-dark-gray border-r-dark-gray relative container border-r border-l px-0">
        <div className="flex flex-col md:flex-row">
          <div className="border-b-dark-gray md:border-r-dark-gray w-full border-b px-8 py-8 md:w-1/3 md:border-r md:px-6">
            <h2 className="text-foreground mb-4 text-3xl font-medium tracking-tight md:text-4xl">
              함께 일해요
            </h2>
            <p className="text-mid-gray">
              별표 주유소에서 제주도의 아름다운 환경과 함께 성장할 동료를 찾고
              있습니다. 관심 있는 포지션이 있으시면 언제든 연락주세요.
            </p>
          </div>

          <div className="w-full md:w-2/3">
            <Accordion type="single" collapsible className="text-foreground">
              {openPositions.map((role, i) => (
                <AccordionItem
                  key={i}
                  value={`pos-${i}`}
                  className="border-b-dark-gray data-[state=open]:bg-jet border-b p-6"
                >
                  <AccordionTrigger className="text-xl">
                    {role.position}
                  </AccordionTrigger>
                  <AccordionContent className="text-mid-gray text-base">
                    <div className="space-y-4">
                      <p>{role.description}</p>

                      <div>
                        <h4 className="text-foreground font-medium mb-2">
                          자격요건
                        </h4>
                        <p className="text-sm">{role.requirements}</p>
                      </div>

                      <div>
                        <h4 className="text-foreground font-medium mb-2">
                          근무조건
                        </h4>
                        <p className="text-sm">{role.schedule}</p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <ContactButton
                          phone={role.phone}
                          kakao={role.kakao}
                          type="phone"
                        />
                        <ContactButton
                          phone={role.phone}
                          kakao={role.kakao}
                          type="kakao"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
