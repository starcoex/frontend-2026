import React from 'react';

// ── 파트너 로고 대체 — 서비스 운영 지표 그리드 ────────────────────────────────

const STATS = [
  { value: '200L', label: '한 드럼 정량 보장', icon: '🛢️' },
  { value: '100L', label: '반 드럼 소량 배달', icon: '🪣' },
  { value: '오후 2시', label: '당일 배송 마감', icon: '⏰' },
  { value: '0부터', label: '미터기 시작 보장', icon: '📟' },
  { value: '3가지', label: '금액·리터·단가 일치', icon: '✅' },
  { value: '실시간', label: 'GPS 배송 추적', icon: '📍' },
  { value: '서울·경기', label: '배달 서비스 지역', icon: '🗺️' },
  { value: '24/7', label: '온라인 주문 가능', icon: '💻' },
  { value: '즉시', label: '운송장 번호 발급', icon: '📄' },
  { value: '무료', label: '난로·돈풍기 임대', icon: '🔥' },
];

export const AboutServiceStats: React.FC = () => {
  return (
    <section id="about-service-stats" className="bg-background px-6 lg:px-0">
      <div className="container px-0 py-10 sm:py-12 md:px-6 md:py-16">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {STATS.map((s) => (
            <li
              key={s.label}
              className="bg-card border-border rounded-[12px] border p-4 flex flex-col items-start gap-2 shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]"
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-foreground font-medium text-base leading-tight">
                  {s.value}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5 leading-snug">
                  {s.label}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
